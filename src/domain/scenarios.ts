import { DELIVERIES } from '../data/scenario'
import { releasedMilkL, runPlanChecks, worstStatus, type CheckResult, type CheckStatus } from './checks'
import { buildPlan, DEFAULT_ASSIGNMENT, type LineAssignment, type Plan, type PlanConfig } from './plan'

export type ScenarioId = 'baseline' | 'split-chocolate' | 'split-naive' | 'fl02-breakdown' | 'variant-60' | 'milk-short'

export interface ScenarioResult {
  id: ScenarioId
  plan: Plan
  checks: CheckResult[]
  status: CheckStatus
  milkAvailableL: number
}

function evaluate(id: ScenarioId, config: PlanConfig, assignment: LineAssignment[], milkAvailableL = releasedMilkL()): ScenarioResult {
  const plan = buildPlan(config, assignment)
  const checks = runPlanChecks(plan, { milkAvailableL })
  return { id, plan, checks, status: worstStatus(checks), milkAvailableL }
}

/** Planning scenarios: the recommended baseline and what-if variants, all checked against the same rules */
export function runScenarios(config: PlanConfig): ScenarioResult[] {
  const baseline = evaluate('baseline', config, DEFAULT_ASSIGNMENT)
  const chocolate = baseline.plan.blocks.find((block) => block.orderId === 'PO-1030-03')
  const chocolatePacks = config.orderPacks['PO-1030-03'] ?? 0
  const half = Math.round(chocolatePacks / 2)

  const split = (notBefore?: number): LineAssignment[] => [
    { lineId: 'FL-01', items: [{ orderId: 'PO-1030-01' }, { orderId: 'PO-1030-03', packs: chocolatePacks - half }] },
    { lineId: 'FL-02', items: [{ orderId: 'PO-1030-02' }, { orderId: 'PO-1030-03', packs: half, notBefore }] }
  ]

  const rejectedTanker = DELIVERIES.find((delivery) => delivery.id === 'TRK-B01')

  return [
    baseline,
    evaluate('split-chocolate', config, split(chocolate?.start)),
    evaluate('split-naive', config, split()),
    evaluate('fl02-breakdown', config, [
      { lineId: 'FL-01', items: [{ orderId: 'PO-1030-01' }, { orderId: 'PO-1030-02' }, { orderId: 'PO-1030-03' }] }
    ]),
    evaluate('variant-60', { ...config, changeoverMin: { ...config.changeoverMin, VARIANT: 60 } }, DEFAULT_ASSIGNMENT),
    evaluate('milk-short', config, DEFAULT_ASSIGNMENT, releasedMilkL() - (rejectedTanker?.volumeL ?? 0))
  ]
}
