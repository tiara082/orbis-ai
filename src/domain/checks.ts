import { isLineEligible, lineSupply } from '../data/reference'
import {
  ASSET_STATES,
  DELIVERIES,
  LAB_RECORDS,
  SCENARIO,
  asepticOutflowLimit,
  getAssetState
} from '../data/scenario'
import { asepticSegments, type Plan, type PlanBlock } from './plan'
import { overlaps, type Minutes } from './time'

export type CheckStatus = 'pass' | 'warning' | 'violation' | 'not computable'

export interface CheckResult {
  ruleId: string
  status: CheckStatus
  /** Translation key under checks.<ruleId>.<variant> */
  variant: string
  /**
   * Values for the message. Naming convention used by the UI formatter:
   * *L → liters, *Lph → L/hour, *Time → clock, *Min → duration.
   */
  vars?: Record<string, string | number>
  /** `assumption` = project assumption, not part of the official catalog */
  source: 'catalog' | 'assumption'
}

const result = (
  ruleId: string,
  status: CheckStatus,
  variant: string,
  vars?: CheckResult['vars'],
  source: CheckResult['source'] = 'catalog'
): CheckResult => ({ ruleId, status, variant, vars, source })

// ---------- Receiving and storage (scenario state) ----------

export function releasedMilkL() {
  return DELIVERIES.filter((delivery) => {
    const lab = LAB_RECORDS.find((record) => record.deliveryId === delivery.id)
    return lab?.qcStatus === 'Passed' && delivery.unloadEnd !== undefined
  }).reduce((sum, delivery) => sum + delivery.volumeL, 0)
}

export function pendingMilk() {
  return DELIVERIES.filter((delivery) => {
    const lab = LAB_RECORDS.find((record) => record.deliveryId === delivery.id)
    return delivery.arrival !== undefined && lab?.qcStatus === 'Pending'
  })
}

export const incomingMilk = () => DELIVERIES.filter((delivery) => delivery.arrival === undefined)

export function checkReceivingGate(): CheckResult {
  const unloaded = DELIVERIES.filter((delivery) => delivery.unloadStart !== undefined)
  const early = unloaded.find((delivery) => {
    const release = LAB_RECORDS.find((record) => record.deliveryId === delivery.id)?.releaseTime
    return release === undefined || release > (delivery.unloadStart as Minutes)
  })
  if (early) return result('RECEIVING_GATE', 'violation', 'early', { tanker: early.id })
  const pending = pendingMilk()
  if (pending.length > 0) {
    return result('RECEIVING_GATE', 'warning', 'blocked', {
      tanker: pending.map((delivery) => delivery.id).join(', '),
      volumeL: pending.reduce((sum, delivery) => sum + delivery.volumeL, 0)
    })
  }
  return result('RECEIVING_GATE', 'pass', 'pass', { count: unloaded.length })
}

export function checkBayExclusive(): CheckResult {
  const unloaded = DELIVERIES.filter((delivery) => delivery.bayId && delivery.unloadStart !== undefined)
  for (const a of unloaded) {
    for (const b of unloaded) {
      if (a.id >= b.id || a.bayId !== b.bayId) continue
      if (overlaps(a.unloadStart!, a.unloadEnd!, b.unloadStart!, b.unloadEnd!)) {
        return result('BAY_EXCLUSIVE', 'violation', 'overlap', { bay: a.bayId!, tankerA: a.id, tankerB: b.id })
      }
    }
  }
  return result('BAY_EXCLUSIVE', 'pass', 'pass', { count: unloaded.length })
}

export function checkCapacity(): CheckResult {
  const tanks = ASSET_STATES.filter((state) => state.capacityL !== undefined)
  const bad = tanks.find((state) => (state.volumeL ?? 0) < 0 || (state.volumeL ?? 0) > (state.capacityL ?? 0))
  if (bad) return result('CAPACITY', 'violation', 'exceeded', { asset: bad.assetId })
  return result('CAPACITY', 'pass', 'pass', { count: tanks.length })
}

export interface HoldingStatus {
  assetId: string
  batchId?: string
  ageMin: number
  limitMin: number
  remainingMin: number
  expiry: Minutes
}

export function holdingStatuses(now: Minutes = SCENARIO.snapshot): HoldingStatus[] {
  return ASSET_STATES.filter((state) => state.batchStart !== undefined && state.holdingLimitH && (state.volumeL ?? 0) > 0).map(
    (state) => {
      const limitMin = (state.holdingLimitH ?? 0) * 60
      const expiry = (state.batchStart as Minutes) + limitMin
      return {
        assetId: state.assetId,
        batchId: state.batchId,
        ageMin: now - (state.batchStart as Minutes),
        limitMin,
        remainingMin: expiry - now,
        expiry
      }
    }
  )
}

export const HOLDING_WARNING_MIN = 180

export function checkHolding(): CheckResult {
  const statuses = holdingStatuses().sort((a, b) => a.remainingMin - b.remainingMin)
  const expired = statuses.find((status) => status.remainingMin < 0)
  if (expired) return result('HOLDING', 'violation', 'expired', { asset: expired.assetId })
  const risk = statuses.find((status) => status.remainingMin < HOLDING_WARNING_MIN)
  if (risk) {
    return result('HOLDING', 'warning', 'risk', {
      asset: risk.assetId,
      remainingMin: risk.remainingMin,
      expiryTime: risk.expiry
    })
  }
  return result('HOLDING', 'pass', 'pass', { count: statuses.length })
}

/** Incoming milk needs an empty raw milk tank; empty tanks need CIP first (CIP_EMPTY) */
export function checkReceivingCapacity(): CheckResult {
  const incomingL = [...pendingMilk(), ...incomingMilk()].reduce((sum, delivery) => sum + delivery.volumeL, 0)
  const emptyTanks = ASSET_STATES.filter((state) => state.assetId.startsWith('RMT-') && (state.volumeL ?? 0) === 0)
  const emptyCapacityL = emptyTanks.reduce((sum, state) => sum + (state.capacityL ?? 0), 0)
  if (emptyCapacityL < incomingL) {
    return result('CAPACITY', 'violation', 'incoming', { incomingL, emptyCapacityL })
  }
  const needsCip = emptyTanks.filter((state) => state.status === 'cip required').map((state) => state.assetId)
  if (needsCip.length > 0) {
    return result('CIP_EMPTY', 'warning', 'beforeReceiving', { incomingL, asset: needsCip.join(', ') })
  }
  return result('CAPACITY', 'pass', 'incomingOk', { incomingL })
}

// ---------- Plan checks ----------

const production = (plan: Plan) => plan.blocks.filter((block) => block.kind === 'production')

function checkLineProduct(plan: Plan): CheckResult {
  const bad = production(plan).find((block) => !isLineEligible(block.lineId, block.finishedSkuId ?? ''))
  if (bad) return result('LINE_PRODUCT', 'violation', 'ineligible', { line: bad.lineId, sku: bad.finishedSkuId ?? '' })
  return result('LINE_PRODUCT', 'pass', 'pass', { count: production(plan).length })
}

function sharedTankPairs(plan: Plan) {
  const blocks = production(plan)
  const pairs: [PlanBlock, PlanBlock, string][] = []
  blocks.forEach((a, i) =>
    blocks.slice(i + 1).forEach((b) => {
      const tank = lineSupply(a.lineId).asepticTankId
      if (a.lineId !== b.lineId && tank && tank === lineSupply(b.lineId).asepticTankId && overlaps(a.start, a.end, b.start, b.end)) {
        pairs.push([a, b, tank])
      }
    })
  )
  return pairs
}

function checkAtSameProduct(plan: Plan): CheckResult {
  const conflict = sharedTankPairs(plan).find(([a, b]) => a.liquidSkuId !== b.liquidSkuId)
  if (conflict) {
    const [a, b, tank] = conflict
    return result('AT_SAME_PRODUCT', 'violation', 'conflict', {
      at: tank,
      lineA: `${a.lineId} ${a.liquidSkuId}`,
      lineB: `${b.lineId} ${b.liquidSkuId}`,
      startTime: Math.max(a.start, b.start)
    })
  }
  return result('AT_SAME_PRODUCT', 'pass', 'pass')
}

function checkAtSharedFlow(plan: Plan): CheckResult[] {
  const blocks = production(plan)
  const tanks = [...new Set(blocks.map((block) => lineSupply(block.lineId).asepticTankId).filter(Boolean))] as string[]
  return tanks.map((tank) => {
    const fed = blocks.filter((block) => lineSupply(block.lineId).asepticTankId === tank)
    const peakLph = Math.max(
      ...fed.map((probe) =>
        fed.filter((block) => block.start <= probe.start && block.end > probe.start).reduce((sum, block) => sum + (block.drawLph ?? 0), 0)
      )
    )
    const limitLph = asepticOutflowLimit(tank)
    return result('AT_SHARED_FLOW', peakLph > limitLph ? 'violation' : 'pass', peakLph > limitLph ? 'over' : 'pass', {
      at: tank,
      peakLph,
      limitLph
    })
  })
}

/**
 * SIMULTANEOUS: a product switch empties the aseptic tank; it must be cleaned
 * (CIP_EMPTY) and refilled to the minimum operating level before filling starts.
 */
export function asepticReadiness(plan: Plan) {
  const segments = asepticSegments(plan)
  return segments
    .map((segment, i) => {
      const previous = segments.slice(0, i).reverse().find((s) => s.asepticTankId === segment.asepticTankId)
      if (!previous) return undefined
      const state = getAssetState(segment.asepticTankId)
      const minPct = segment.lineIds.length >= 2 ? state?.minLevelPct?.twoLines ?? 50 : state?.minLevelPct?.oneLine ?? 25
      const refillMin = state?.inflowLph ? (((state.capacityL ?? 0) * minPct) / 100 / state.inflowLph) * 60 : 0
      const cipMin = state?.cipMinutes ?? 0
      const readyAt = previous.end + cipMin + refillMin
      return { segment, previousEnd: previous.end, cipMin, refillMin, minPct, readyAt, lateMin: Math.max(0, readyAt - segment.start) }
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
}

function checkSimultaneous(plan: Plan): CheckResult {
  const late = asepticReadiness(plan).find((item) => item.lateMin > 0)
  if (late) {
    return result('SIMULTANEOUS', 'warning', 'minLevel', {
      at: late.segment.asepticTankId,
      minPct: late.minPct,
      startTime: late.segment.start,
      readyTime: late.readyAt,
      lateMin: late.lateMin
    })
  }
  return result('SIMULTANEOUS', 'pass', 'pass')
}

function checkChangeover(plan: Plan): CheckResult {
  const transitions = plan.blocks.filter((block) => block.kind === 'VARIANT' || block.kind === 'SIZE' || block.kind === 'PAPER')
  return result('CHANGEOVER_PRECEDENCE', 'pass', 'pass', {
    list: transitions.map((block) => `${block.lineId} ${block.kind}`).join(', ') || '—'
  })
}

function checkCipEnd(plan: Plan): CheckResult {
  const cips = plan.blocks.filter((block) => block.kind === 'CIP')
  return result('CIP_END_PRODUCTION', 'pass', 'pass', { count: cips.length })
}

function checkFillingSpeed(plan: Plan): CheckResult {
  const block = production(plan)[0]
  if (!block) return result('FILLING_SPEED_UNIT', 'not computable', 'empty')
  return result('FILLING_SPEED_UNIT', 'pass', 'pass', { line: block.lineId, drawLph: block.drawLph ?? 0 })
}

function checkDueTimes(plan: Plan): CheckResult {
  const late = plan.orders.filter((order) => order.lateMin > 0).sort((a, b) => b.lateMin - a.lateMin)[0]
  if (late) return result('PLAN', 'warning', 'late', { order: late.orderId, lateMin: late.lateMin, dueTime: late.due })
  return result('PLAN', 'pass', 'pass', { count: plan.orders.length })
}

function checkMilk(plan: Plan, availableL: number): CheckResult {
  if (plan.milkRequiredL > availableL) {
    return result('MILK_BALANCE', 'violation', 'short', { requiredL: plan.milkRequiredL, availableL, shortL: plan.milkRequiredL - availableL }, 'assumption')
  }
  return result('MILK_BALANCE', 'pass', 'pass', { requiredL: plan.milkRequiredL, availableL, spareL: availableL - plan.milkRequiredL }, 'assumption')
}

export interface CheckContext {
  milkAvailableL: number
}

export function runPlanChecks(plan: Plan, context: CheckContext = { milkAvailableL: releasedMilkL() }): CheckResult[] {
  return [
    checkReceivingGate(),
    checkBayExclusive(),
    checkCapacity(),
    checkHolding(),
    checkMilk(plan, context.milkAvailableL),
    checkLineProduct(plan),
    checkAtSameProduct(plan),
    ...checkAtSharedFlow(plan),
    checkSimultaneous(plan),
    checkChangeover(plan),
    checkCipEnd(plan),
    checkFillingSpeed(plan),
    checkDueTimes(plan),
    result('HEADER_RESOURCE', 'not computable', 'missing'),
    result('CATALOG_DURATIONS', 'not computable', 'scenario')
  ]
}

export const worstStatus = (results: CheckResult[]): CheckStatus =>
  results.some((r) => r.status === 'violation')
    ? 'violation'
    : results.some((r) => r.status === 'warning')
      ? 'warning'
      : 'pass'

export const countByStatus = (results: CheckResult[]) => ({
  pass: results.filter((r) => r.status === 'pass').length,
  warning: results.filter((r) => r.status === 'warning').length,
  violation: results.filter((r) => r.status === 'violation').length,
  notComputable: results.filter((r) => r.status === 'not computable').length
})
