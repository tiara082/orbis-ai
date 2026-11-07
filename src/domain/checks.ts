import {
  ASSET_STATES,
  DELIVERIES,
  LAB_RECORDS,
  SCENARIO,
} from '../data/scenario'
import { asepticSegments, lineSupply, type Plan, type PlanBlock, type PlanDependencies } from './plan'
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

function operational(dependencies?: PlanDependencies) {
  return dependencies?.operational
}

export function releasedMilkL(dependencies?: PlanDependencies) {
  const deliveries = operational(dependencies)?.deliveries ?? DELIVERIES
  const labs = operational(dependencies)?.labRecords ?? LAB_RECORDS
  return deliveries.filter((delivery) => {
    const lab = labs.find((record) => record.deliveryId === delivery.id)
    return lab?.qcStatus === 'Passed' && delivery.unloadEnd !== undefined
  }).reduce((sum, delivery) => sum + delivery.volumeL, 0)
}

export function pendingMilk(dependencies?: PlanDependencies) {
  const deliveries = operational(dependencies)?.deliveries ?? DELIVERIES
  const labs = operational(dependencies)?.labRecords ?? LAB_RECORDS
  return deliveries.filter((delivery) => {
    const lab = labs.find((record) => record.deliveryId === delivery.id)
    return delivery.arrival !== undefined && lab?.qcStatus === 'Pending'
  })
}

export const incomingMilk = (dependencies?: PlanDependencies) => (operational(dependencies)?.deliveries ?? DELIVERIES).filter((delivery) => delivery.arrival === undefined)

export function checkReceivingGate(dependencies?: PlanDependencies): CheckResult {
  const deliveries = operational(dependencies)?.deliveries ?? DELIVERIES
  const labs = operational(dependencies)?.labRecords ?? LAB_RECORDS
  const unloaded = deliveries.filter((delivery) => delivery.unloadStart !== undefined)
  const early = unloaded.find((delivery) => {
    const release = labs.find((record) => record.deliveryId === delivery.id)?.releaseTime
    return release === undefined || release > (delivery.unloadStart as Minutes)
  })
  if (early) return result('RECEIVING_GATE', 'violation', 'early', { tanker: early.id })
  const pending = pendingMilk(dependencies)
  if (pending.length > 0) {
    return result('RECEIVING_GATE', 'warning', 'blocked', {
      tanker: pending.map((delivery) => delivery.id).join(', '),
      volumeL: pending.reduce((sum, delivery) => sum + delivery.volumeL, 0)
    })
  }
  return result('RECEIVING_GATE', 'pass', 'pass', { count: unloaded.length })
}

export function checkBayExclusive(dependencies?: PlanDependencies): CheckResult {
  const unloaded = (operational(dependencies)?.deliveries ?? DELIVERIES).filter((delivery) => delivery.bayId && delivery.unloadStart !== undefined)
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

export function checkCapacity(dependencies?: PlanDependencies): CheckResult {
  const tanks = (operational(dependencies)?.assetStates ?? ASSET_STATES).filter((state) => state.capacityL !== undefined)
  const catalog = dependencies ? ('data' in dependencies.catalog ? dependencies.catalog.data : dependencies.catalog) : undefined
  const bad = tanks.find((state) => {
    const nominal = catalog?.assets.find((asset) => asset.id === state.assetId)?.params.capacity_l
    const nominalCapacity = typeof nominal === 'number' ? nominal : undefined
    return (state.volumeL ?? 0) < 0 || (state.volumeL ?? 0) > (state.capacityL ?? 0) || (nominalCapacity !== undefined && (state.capacityL ?? 0) > nominalCapacity)
  })
  if (bad) return result('CAPACITY', 'violation', 'exceeded', { asset: bad.assetId })
  return result('CAPACITY', 'pass', 'pass', { count: tanks.length })
}

function checkCipScope(plan: Plan, dependencies: PlanDependencies): CheckResult {
  const catalog = 'data' in dependencies.catalog ? dependencies.catalog.data : dependencies.catalog
  const cip = plan.blocks.find((block) => block.kind === 'CIP' && block.ruleId)
  if (!cip) return result('CIP_SCOPE', 'not computable', 'empty')
  const rule = catalog.cipRules.find((item) => item.ruleId === cip.ruleId)
  if (!rule) return result('CIP_SCOPE', 'not computable', 'missingRule', { rule: cip.ruleId ?? '' })
  const assetId = lineSupply(cip.lineId, dependencies).asepticTankId
  const asset = catalog.assets.find((item) => item.id === assetId)
  const deterministic = rule.assetScope.filter((scope) => catalog.assets.some((item) => item.id === scope || item.type === scope))
  if (deterministic.length === 0) return result('CIP_SCOPE', 'not computable', 'semanticScope', { rule: rule.ruleId })
  const matches = deterministic.some((scope) => scope === assetId || scope === asset?.type)
  return result('CIP_SCOPE', matches ? 'pass' : 'violation', matches ? 'pass' : 'outOfScope', { rule: rule.ruleId, asset: assetId ?? '' })
}

export interface HoldingStatus {
  assetId: string
  batchId?: string
  ageMin: number
  limitMin: number
  remainingMin: number
  expiry: Minutes
}

export function holdingStatuses(now?: Minutes, dependencies?: PlanDependencies): HoldingStatus[] {
  const state = operational(dependencies)
  const effectiveNow = now ?? state?.snapshot ?? SCENARIO.snapshot
  return (state?.assetStates ?? ASSET_STATES).filter((state) => state.batchStart !== undefined && state.holdingLimitH && (state.volumeL ?? 0) > 0).map(
    (state) => {
      const limitMin = (state.holdingLimitH ?? 0) * 60
      const expiry = (state.batchStart as Minutes) + limitMin
      return {
        assetId: state.assetId,
        batchId: state.batchId,
        ageMin: effectiveNow - (state.batchStart as Minutes),
        limitMin,
        remainingMin: expiry - effectiveNow,
        expiry
      }
    }
  )
}

export const HOLDING_WARNING_MIN = 180

export function checkHolding(dependencies?: PlanDependencies): CheckResult {
  const statuses = holdingStatuses(undefined, dependencies).sort((a, b) => a.remainingMin - b.remainingMin)
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
export function checkReceivingCapacity(dependencies?: PlanDependencies): CheckResult {
  const incomingL = [...pendingMilk(dependencies), ...incomingMilk(dependencies)].reduce((sum, delivery) => sum + delivery.volumeL, 0)
  const emptyTanks = (operational(dependencies)?.assetStates ?? ASSET_STATES).filter((state) => state.assetId.startsWith('RMT-') && (state.volumeL ?? 0) === 0)
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

function checkLineProduct(plan: Plan, dependencies: PlanDependencies): CheckResult {
  const bad = production(plan).find((block) => {
    const finished = dependencies.catalog && 'data' in dependencies.catalog ? dependencies.catalog.data.finishedSkus.find((row) => row.finishedSkuId === block.finishedSkuId) : dependencies.catalog.finishedSkus.find((row) => row.finishedSkuId === block.finishedSkuId)
    const catalog = 'data' in dependencies.catalog ? dependencies.catalog.data : dependencies.catalog
    return !finished || !catalog.lineFinished.some((row) => row.lineId === block.lineId && row.finishedSkuId === block.finishedSkuId && row.eligible)
  })
  if (bad) return result('LINE_PRODUCT', 'violation', 'ineligible', { line: bad.lineId, sku: bad.finishedSkuId ?? '' })
  return result('LINE_PRODUCT', 'pass', 'pass', { count: production(plan).length })
}

function sharedTankPairs(plan: Plan, dependencies: PlanDependencies) {
  const blocks = production(plan)
  const pairs: [PlanBlock, PlanBlock, string][] = []
  blocks.forEach((a, i) =>
    blocks.slice(i + 1).forEach((b) => {
      const tank = lineSupply(a.lineId, dependencies).asepticTankId
      if (a.lineId !== b.lineId && tank && tank === lineSupply(b.lineId, dependencies).asepticTankId && overlaps(a.start, a.end, b.start, b.end)) {
        pairs.push([a, b, tank])
      }
    })
  )
  return pairs
}

function checkAtSameProduct(plan: Plan, dependencies: PlanDependencies): CheckResult {
  const conflict = sharedTankPairs(plan, dependencies).find(([a, b]) => a.liquidSkuId !== b.liquidSkuId)
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

function checkAtSharedFlow(plan: Plan, dependencies: PlanDependencies): CheckResult[] {
  const blocks = production(plan)
  const tanks = [...new Set(blocks.map((block) => lineSupply(block.lineId, dependencies).asepticTankId).filter(Boolean))] as string[]
  return tanks.map((tank) => {
    const fed = blocks.filter((block) => lineSupply(block.lineId, dependencies).asepticTankId === tank)
    const peakLph = Math.max(
      ...fed.map((probe) =>
        fed.filter((block) => block.start <= probe.start && block.end > probe.start).reduce((sum, block) => sum + (block.drawLph ?? 0), 0)
      )
    )
    const state = dependencies.operational.assetStates.find((asset) => asset.assetId === tank)
    const limitLph = state?.outflowLph ?? 0
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
export function asepticReadiness(plan: Plan, dependencies: PlanDependencies = plan.dependencies) {
  const segments = asepticSegments(plan, dependencies)
  return segments
    .map((segment, i) => {
      const previous = segments.slice(0, i).reverse().find((s) => s.asepticTankId === segment.asepticTankId)
      if (!previous) return undefined
      const state = dependencies.operational.assetStates.find((asset) => asset.assetId === segment.asepticTankId)
      const minPct = segment.lineIds.length >= 2 ? state?.minLevelPct?.twoLines ?? 50 : state?.minLevelPct?.oneLine ?? 25
      const refillMin = state?.inflowLph ? (((state.capacityL ?? 0) * minPct) / 100 / state.inflowLph) * 60 : 0
      const cipMin = state?.cipMinutes ?? 0
      const readyAt = previous.end + cipMin + refillMin
      return { segment, previousEnd: previous.end, cipMin, refillMin, minPct, readyAt, lateMin: Math.max(0, readyAt - segment.start) }
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
}

function checkSimultaneous(plan: Plan, dependencies: PlanDependencies): CheckResult {
  const late = asepticReadiness(plan, dependencies).find((item) => item.lateMin > 0)
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

export function runPlanChecks(plan: Plan, context: CheckContext = { milkAvailableL: releasedMilkL(plan.dependencies) }, dependencies: PlanDependencies = plan.dependencies): CheckResult[] {
  return [
    checkReceivingGate(dependencies),
    checkBayExclusive(dependencies),
    checkCapacity(dependencies),
    checkHolding(dependencies),
    checkMilk(plan, context.milkAvailableL),
    checkLineProduct(plan, dependencies),
    checkAtSameProduct(plan, dependencies),
    ...checkAtSharedFlow(plan, dependencies),
    checkSimultaneous(plan, dependencies),
    checkChangeover(plan),
    checkCipEnd(plan),
    checkCipScope(plan, dependencies),
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
