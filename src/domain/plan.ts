import { getFinishedSku, lineSupply } from '../data/reference'
import { PRODUCTION_ORDERS, getAssetState, type Priority } from '../data/scenario'
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

export interface Plan {
  blocks: PlanBlock[]
  lineIds: string[]
  orders: OrderOutcome[]
  start: Minutes
  end: Minutes
  milkRequiredL: number
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

const orderById = (orderId: string) => PRODUCTION_ORDERS.find((order) => order.id === orderId)

export function buildPlan(config: PlanConfig, assignment: LineAssignment[] = DEFAULT_ASSIGNMENT): Plan {
  const blocks: PlanBlock[] = []

  for (const line of assignment) {
    const speed = (config.lineSpeed[line.lineId] ?? 0) * (config.utilizationPct / 100)
    let t = config.start
    let prevSku: string | undefined

    for (const item of line.items) {
      const order = orderById(item.orderId)
      const finished = order ? getFinishedSku(order.finishedSkuId) : undefined
      if (!order || !finished || speed <= 0) continue
      const packs = item.packs ?? config.orderPacks[order.id] ?? order.packs

      if (prevSku) {
        const prevLiquid = getFinishedSku(prevSku)?.liquidSkuId ?? ''
        const cipRule = flavourCipTrigger(prevLiquid, finished.liquidSkuId)
        if (cipRule) {
          blocks.push({ lineId: line.lineId, kind: 'CIP', start: t, end: t + config.cipMin[cipRule], ruleId: cipRule })
          t += config.cipMin[cipRule]
        }
        const activity = classifyChangeover(prevSku, order.finishedSkuId)
        if (activity !== 'NONE') {
          const duration = config.changeoverMin[activity]
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
        liters: packsToLiters(order.finishedSkuId, packs),
        milkL: milkRequirement(order.finishedSkuId, packs),
        drawLph: liquidDrawLph(order.finishedSkuId, speed)
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
    const order = orderById(orderId)!
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
    milkRequiredL: orders.reduce((sum, order) => sum + order.milkL, 0)
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
export function asepticSegments(plan: Plan): AsepticSegment[] {
  const segments: AsepticSegment[] = []
  const production = plan.blocks.filter((block) => block.kind === 'production').sort((a, b) => a.start - b.start)
  for (const block of production) {
    const asepticTankId = lineSupply(block.lineId).asepticTankId
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
