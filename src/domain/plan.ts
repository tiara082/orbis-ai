import { getSnapshot } from '../data/catalog/repository'
import type { CatalogData, CatalogSnapshot } from '../data/catalog/types'
import { PRODUCTION_ORDERS, getAssetState, type AssetState, type BayConfig, type Delivery, type LabRecord, type Priority, type ProductionOrder } from '../data/scenario'
import { classifyChangeover, flavourCipTrigger } from './changeover'
import { liquidDrawLph, milkRequirement, packsToLiters } from './products'
import { at, type Minutes } from './time'

export type PlanBlockKind = 'production' | 'VARIANT' | 'SIZE' | 'PAPER' | 'CIP' | 'wait'

export interface PlanBlock {
  lineId: string
  kind: PlanBlockKind
  start: Minutes
  end: Minutes
  orderId?: string
  finishedSkuId?: string
  liquidSkuId?: string
  packs?: number
  liters?: number
  milkL?: number
  drawLph?: number
  /** Catalog rule that caused a non-productive block, e.g. CIP_END_PRODUCTION */
  ruleId?: string
  supplyTankId?: string
  supplyPipeId?: string
}

export interface PlanConfig {
  orderPacks: Record<string, number>
  orderPriority: Record<string, Priority>
  lineSpeed: Record<string, number>
  /** Breakdown and stops are covered by the utilization percentage */
  utilizationPct: number
  start: Minutes
  changeoverMin: { VARIANT: number; SIZE: number; PAPER: number }
  cipMin: { CIP_FLAVOUR: number; CIP_CH_ST: number; CIP_END_PRODUCTION: number }
}

export interface AssignmentItem {
  orderId: string
  /** Overrides the order quantity when an order is split across lines */
  packs?: number
  /** Earliest production start, e.g. waiting for the shared aseptic tank to switch product */
  notBefore?: Minutes
}

export interface LineAssignment {
  lineId: string
  items: AssignmentItem[]
}

export interface OrderOutcome {
  orderId: string
  finishedSkuId: string
  lineIds: string[]
  packs: number
  liters: number
  milkL: number
  start: Minutes
  finish: Minutes
  due: Minutes
  lateMin: number
}

export type PlanningDiagnosticSeverity = 'warning' | 'constraint violation' | 'missing dependency'

export interface PlanningDiagnostic {
  severity: PlanningDiagnosticSeverity
  orderId?: string
  lineId?: string
  finishedSkuId?: string
  message: string
}

export interface OperationalSnapshot {
  orders: ProductionOrder[]
  assetStates: AssetState[]
  deliveries?: Delivery[]
  labRecords?: LabRecord[]
  bays?: BayConfig[]
  snapshot?: Minutes
}

export interface PlanDependencies {
  catalog: CatalogSnapshot | CatalogData
  operational: OperationalSnapshot
}

export interface Plan {
  blocks: PlanBlock[]
  lineIds: string[]
  orders: OrderOutcome[]
  start: Minutes
  end: Minutes
  milkRequiredL: number
  diagnostics: PlanningDiagnostic[]
  dependencies: PlanDependencies
}

export function defaultPlanningDependencies(): PlanDependencies {
  return {
    catalog: getSnapshot(),
    operational: { orders: PRODUCTION_ORDERS, assetStates: [] }
  }
}

function catalogData(dependencies: PlanDependencies) {
  return 'data' in dependencies.catalog ? dependencies.catalog.data : dependencies.catalog
}

function assetState(assetId: string, dependencies: PlanDependencies) {
  return dependencies.operational.assetStates.find((state) => state.assetId === assetId) ?? getAssetState(assetId)
}

function suppliedLine(lineId: string, dependencies: PlanDependencies) {
  const catalog = catalogData(dependencies)
  const connection = catalog.connections.find((item) => item.destination === lineId && item.flowType === 'aseptic_supply')
  return { asepticTankId: connection?.source, pipeId: connection?.via, connectionId: connection?.id }
}

export function lineSupply(lineId: string, dependencies: PlanDependencies = defaultPlanningDependencies()) {
  return suppliedLine(lineId, dependencies)
}

function lineEligibility(lineId: string, finishedSkuId: string, dependencies: PlanDependencies) {
  const catalog = catalogData(dependencies)
  const finished = catalog.finishedSkus.find((row) => row.finishedSkuId === finishedSkuId)
  if (!finished) return { eligible: false, reason: `Finished SKU is missing from catalog: ${finishedSkuId}` }
  const product = catalog.lineProducts.find(
    (row) => row.lineId === lineId && row.skuId === finished.liquidSkuId && row.packSizeCode === finished.packSizeCode
  )
  if (product && !product.eligible) return { eligible: false, reason: `Line product compatibility is not eligible: ${lineId} / ${finished.liquidSkuId} / ${finished.packSizeCode}` }
  if (!product) return { eligible: false, reason: `Line product compatibility is missing: ${lineId} / ${finished.liquidSkuId} / ${finished.packSizeCode}` }
  const finishedCompatibility = catalog.lineFinished.find((row) => row.lineId === lineId && row.finishedSkuId === finishedSkuId)
  if (finishedCompatibility && !finishedCompatibility.eligible) return { eligible: false, reason: `Line Finished SKU compatibility is not eligible: ${lineId} / ${finishedSkuId}` }
  if (!finishedCompatibility) return { eligible: false, reason: `Line Finished SKU compatibility is missing: ${lineId} / ${finishedSkuId}` }
  const dedication = catalog.lineDedication.find((row) => row.lineId === lineId)
  if (dedication) {
    if (!dedication.allowedSkuIds.includes(finished.liquidSkuId) || !dedication.packSizeCodes.includes(finished.packSizeCode)) {
      return { eligible: false, reason: `Line dedication does not allow product or pack size: ${lineId} / ${finishedSkuId}` }
    }
    const supply = suppliedLine(lineId, dependencies)
    if (supply.asepticTankId !== dedication.sourceAsepticTankId) {
      return { eligible: false, reason: `Line dedication source tank does not match asset connection: ${lineId}` }
    }
  }
  return { eligible: true as const }
}

export const PLANNED_ORDERS = PRODUCTION_ORDERS.filter((order) => order.dayOffset === 0)

export const DEFAULT_CONFIG: PlanConfig = {
  orderPacks: Object.fromEntries(PLANNED_ORDERS.map((order) => [order.id, order.packs])),
  orderPriority: Object.fromEntries(PLANNED_ORDERS.map((order) => [order.id, order.priority])),
  lineSpeed: { 'FL-01': getAssetState('FL-01')?.speedPackph ?? 0, 'FL-02': getAssetState('FL-02')?.speedPackph ?? 0 },
  utilizationPct: 100,
  start: at('08:00'),
  changeoverMin: { VARIANT: 30, SIZE: 20, PAPER: 10 },
  cipMin: { CIP_FLAVOUR: 45, CIP_CH_ST: 45, CIP_END_PRODUCTION: 60 }
}

/** Field options for the manual flavour change (15/40/60 min) plus the 30 min used in the example schedule */
export const VARIANT_DURATION_OPTIONS = [15, 30, 40, 60]

export const DEFAULT_ASSIGNMENT: LineAssignment[] = [
  { lineId: 'FL-01', items: [{ orderId: 'PO-1030-01' }, { orderId: 'PO-1030-03' }] },
  { lineId: 'FL-02', items: [{ orderId: 'PO-1030-02' }] }
]

const orderById = (orderId: string, dependencies: PlanDependencies) => dependencies.operational.orders.find((order) => order.id === orderId)

export function buildPlan(
  config: PlanConfig,
  assignment: LineAssignment[] = DEFAULT_ASSIGNMENT,
  dependencies: PlanDependencies = defaultPlanningDependencies()
): Plan {
  const blocks: PlanBlock[] = []
  const diagnostics: PlanningDiagnostic[] = []
  const catalog = catalogData(dependencies)

  for (const line of assignment) {
    const speed = (config.lineSpeed[line.lineId] ?? assetState(line.lineId, dependencies)?.speedPackph ?? 0) * (config.utilizationPct / 100)
    if (!catalog.assets.some((asset) => asset.id === line.lineId)) {
      diagnostics.push({ severity: 'missing dependency', lineId: line.lineId, message: `Line asset is missing from catalog: ${line.lineId}` })
    }

    let t = config.start
    let prevSku: string | undefined

    for (const item of line.items) {
      const order = orderById(item.orderId, dependencies)
      const finished = order ? catalog.finishedSkus.find((sku) => sku.finishedSkuId === order.finishedSkuId) : undefined
      if (!order) {
        diagnostics.push({ severity: 'missing dependency', orderId: item.orderId, lineId: line.lineId, message: `Production order is missing: ${item.orderId}` })
        continue
      }
      if (!finished) {
        diagnostics.push({ severity: 'missing dependency', orderId: order.id, lineId: line.lineId, finishedSkuId: order.finishedSkuId, message: `Finished SKU is missing from catalog: ${order.finishedSkuId}` })
        continue
      }
      const eligibility = lineEligibility(line.lineId, order.finishedSkuId, dependencies)
      if (!eligibility.eligible) {
        diagnostics.push({ severity: 'constraint violation', orderId: order.id, lineId: line.lineId, finishedSkuId: order.finishedSkuId, message: eligibility.reason })
        continue
      }
      if (speed <= 0) {
        diagnostics.push({ severity: 'constraint violation', orderId: order.id, lineId: line.lineId, message: `Line has no available speed: ${line.lineId}` })
        continue
      }
      const packs = item.packs ?? config.orderPacks[order.id] ?? order.packs

      if (prevSku) {
        const prevLiquid = catalog.finishedSkus.find((sku) => sku.finishedSkuId === prevSku)?.liquidSkuId ?? ''
        const cipRule = flavourCipTrigger(prevLiquid, finished.liquidSkuId, catalog)
        const catalogCipRule = cipRule ? catalog.cipRules.find((rule) => rule.ruleId === cipRule) : undefined
        if (cipRule) {
          const duration = typeof catalogCipRule?.duration === 'number' ? catalogCipRule.duration : config.cipMin[cipRule]
          blocks.push({ lineId: line.lineId, kind: 'CIP', start: t, end: t + duration, ruleId: cipRule })
          t += duration
        }
        const activity = classifyChangeover(prevSku, order.finishedSkuId, catalog)
        const catalogRule = catalog.changeovers.find((rule) => rule.ruleId === activity)
        if (activity !== 'NONE') {
          const duration = typeof catalogRule?.duration === 'number' ? catalogRule.duration : config.changeoverMin[activity]
          blocks.push({ lineId: line.lineId, kind: activity, start: t, end: t + duration, ruleId: activity })
          t += duration
        }
      }

      if (item.notBefore !== undefined && t < item.notBefore) {
        blocks.push({ lineId: line.lineId, kind: 'wait', start: t, end: item.notBefore, ruleId: 'AT_SAME_PRODUCT' })
        t = item.notBefore
      }

      const duration = (packs / speed) * 60
      blocks.push({
        lineId: line.lineId,
        kind: 'production',
        start: t,
        end: t + duration,
        orderId: order.id,
        finishedSkuId: order.finishedSkuId,
        liquidSkuId: finished.liquidSkuId,
        packs,
        liters: packsToLiters(order.finishedSkuId, packs, catalog),
        milkL: milkRequirement(order.finishedSkuId, packs, catalog),
        drawLph: liquidDrawLph(order.finishedSkuId, speed, catalog)
        ,supplyTankId: suppliedLine(line.lineId, dependencies).asepticTankId
        ,supplyPipeId: suppliedLine(line.lineId, dependencies).pipeId
      })
      t += duration
      prevSku = order.finishedSkuId
    }

    if (prevSku) {
      const duration = config.cipMin.CIP_END_PRODUCTION
      blocks.push({ lineId: line.lineId, kind: 'CIP', start: t, end: t + duration, ruleId: 'CIP_END_PRODUCTION' })
    }
  }

  const production = blocks.filter((block) => block.kind === 'production')
  const orderIds = [...new Set(production.map((block) => block.orderId as string))]
  const orders: OrderOutcome[] = orderIds.map((orderId) => {
    const parts = production.filter((block) => block.orderId === orderId)
    const order = orderById(orderId, dependencies)!
    const finish = Math.max(...parts.map((block) => block.end))
    return {
      orderId,
      finishedSkuId: order.finishedSkuId,
      lineIds: [...new Set(parts.map((block) => block.lineId))],
      packs: parts.reduce((sum, block) => sum + (block.packs ?? 0), 0),
      liters: parts.reduce((sum, block) => sum + (block.liters ?? 0), 0),
      milkL: parts.reduce((sum, block) => sum + (block.milkL ?? 0), 0),
      start: Math.min(...parts.map((block) => block.start)),
      finish,
      due: order.due,
      lateMin: Math.max(0, finish - order.due)
    }
  })

  return {
    blocks,
    lineIds: assignment.map((line) => line.lineId),
    orders,
    start: config.start,
    end: blocks.length ? Math.max(...blocks.map((block) => block.end)) : config.start,
    milkRequiredL: orders.reduce((sum, order) => sum + order.milkL, 0),
    diagnostics
    ,dependencies
  }
}

export interface AsepticSegment {
  asepticTankId: string
  liquidSkuId: string
  start: Minutes
  end: Minutes
  lineIds: string[]
}

/** Product segments an aseptic tank must supply, derived from the production blocks of the lines it feeds */
export function asepticSegments(plan: Plan, dependencies: PlanDependencies = defaultPlanningDependencies()): AsepticSegment[] {
  const segments: AsepticSegment[] = []
  const production = plan.blocks.filter((block) => block.kind === 'production').sort((a, b) => a.start - b.start)
  for (const block of production) {
    const asepticTankId = suppliedLine(block.lineId, dependencies).asepticTankId
    if (!asepticTankId || !block.liquidSkuId) continue
    const last = [...segments].reverse().find((segment) => segment.asepticTankId === asepticTankId)
    if (last && last.liquidSkuId === block.liquidSkuId && block.start <= last.end) {
      last.end = Math.max(last.end, block.end)
      if (!last.lineIds.includes(block.lineId)) last.lineIds.push(block.lineId)
    } else {
      segments.push({ asepticTankId, liquidSkuId: block.liquidSkuId, start: block.start, end: block.end, lineIds: [block.lineId] })
    }
  }
  return segments
}
