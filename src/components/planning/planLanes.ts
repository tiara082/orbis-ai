import { describeFinishedSku } from '../../data/reference'
import { asepticReadiness } from '../../domain/checks'
import { asepticSegments, lineSupply, type Plan, type PlanBlock } from '../../domain/plan'
import { isFlavoured } from '../../domain/products'
import type { BlockKind, ScheduleBlock, ScheduleLane } from './ScheduleTimeline'

type Translate = (key: string, vars?: Record<string, string | number>) => string

export function blockKind(block: PlanBlock): BlockKind {
  if (block.kind === 'production') return isFlavoured(block.liquidSkuId ?? '') ? 'flavoured' : 'plain'
  if (block.kind === 'CIP') return 'cip'
  if (block.kind === 'wait') return 'wait'
  return 'changeover'
}

export function blockLabel(block: PlanBlock, t: Translate) {
  if (block.kind === 'production') {
    const { liquid, pack } = describeFinishedSku(block.finishedSkuId ?? '')
    return { label: liquid?.flavour ?? block.finishedSkuId ?? '', sublabel: `${block.orderId} · ${pack?.sizeMl ?? ''} ml` }
  }
  return { label: t(`schedule.block.${block.kind}`), sublabel: block.ruleId }
}

const blockId = (block: PlanBlock) => `${block.lineId}-${block.kind}-${block.start}`

/** One lane per filling line; maintenance windows from the scenario are overlaid */
export function lineLanes(plan: Plan, t: Translate, options: { flaggedLines?: string[] } = {}): ScheduleLane[] {
  return plan.lineIds.map((lineId) => {
    const supply = lineSupply(lineId, plan.dependencies)
    const blocks: ScheduleBlock[] = plan.blocks
      .filter((block) => block.lineId === lineId)
      .map((block) => ({
        id: blockId(block),
        ...blockLabel(block, t),
        start: block.start,
        end: block.end,
        kind: blockKind(block),
        flagged: block.kind === 'production' && options.flaggedLines?.includes(lineId)
      }))
    const maintenance = plan.dependencies.operational.assetStates.find((state) => state.assetId === lineId)?.maintenance
    if (maintenance) {
      blocks.push({ id: `${lineId}-maint`, label: t('schedule.block.maintenance'), start: maintenance.start, end: maintenance.end, kind: 'maintenance' })
    }
    return { id: lineId, label: lineId, sublabel: supply.asepticTankId ? `${supply.asepticTankId} · ${supply.pipeId}` : undefined, blocks }
  })
}

/** Aseptic tank lanes: product segments plus the CIP and refill gap between products */
export function asepticLanes(plan: Plan, t: Translate): ScheduleLane[] {
  const segments = asepticSegments(plan, plan.dependencies)
  const readiness = asepticReadiness(plan, plan.dependencies).map((item) => ({ ...item, asepticTankId: item.segment.asepticTankId }))
  const tanks = [...new Set(segments.map((segment) => segment.asepticTankId))]
  return tanks.map((tankId) => {
    const blocks: ScheduleBlock[] = segments
      .filter((segment) => segment.asepticTankId === tankId)
      .map((segment) => ({
        id: `${tankId}-${segment.start}`,
        label: segment.liquidSkuId,
        sublabel: segment.lineIds.join(' + '),
        start: segment.start,
        end: segment.end,
        kind: isFlavoured(segment.liquidSkuId) ? 'flavoured' : 'plain'
      }))
    for (const item of readiness.filter((r) => r.asepticTankId === tankId)) {
      blocks.push({ id: `${tankId}-cip-${item.previousEnd}`, label: t('schedule.block.CIP_EMPTY'), start: item.previousEnd, end: item.previousEnd + item.cipMin, kind: 'cip' })
      blocks.push({ id: `${tankId}-fill-${item.previousEnd}`, label: t('schedule.block.refill'), start: item.previousEnd + item.cipMin, end: item.readyAt, kind: 'level' })
    }
    return { id: tankId, label: tankId, sublabel: t('schedule.asepticLane'), blocks }
  })
}
