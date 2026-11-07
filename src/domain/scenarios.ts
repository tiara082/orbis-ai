import { DELIVERIES } from '../data/scenario'
import { releasedMilkL, runPlanChecks, worstStatus, type CheckResult, type CheckStatus } from './checks'
import { buildPlan, DEFAULT_ASSIGNMENT, type LineAssignment, type Plan, type PlanConfig, type PlanDependencies } from './plan'

export type ScenarioId = 'baseline' | 'split-chocolate' | 'split-naive' | 'fl02-breakdown' | 'variant-60' | 'milk-short'

export interface ScenarioResult {
  id: ScenarioId
  plan: Plan
  checks: CheckResult[]
  status: CheckStatus
  milkAvailableL: number
}

function evaluate(id: ScenarioId, config: PlanConfig, assignment: LineAssignment[], dependencies: PlanDependencies, milkAvailableL = releasedMilkL(dependencies)): ScenarioResult {
  const plan = buildPlan(config, assignment, dependencies)
  const checks = runPlanChecks(plan, { milkAvailableL }, plan.dependencies)
  return { id, plan, checks, status: worstStatus(checks), milkAvailableL }
}

/** Planning scenarios: the recommended baseline and what-if variants, all checked against the same rules */
export function runScenarios(config: PlanConfig, dependencies?: PlanDependencies): ScenarioResult[] {
  const resolved = dependencies ?? buildPlan(config, DEFAULT_ASSIGNMENT).dependencies
  const baseline = evaluate('baseline', config, DEFAULT_ASSIGNMENT, resolved)
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
    evaluate('split-chocolate', config, split(chocolate?.start), resolved),
    evaluate('split-naive', config, split(), resolved),
    evaluate('fl02-breakdown', config, [
      { lineId: 'FL-01', items: [{ orderId: 'PO-1030-01' }, { orderId: 'PO-1030-02' }, { orderId: 'PO-1030-03' }] }
    ], resolved),
    evaluate('variant-60', { ...config, changeoverMin: { ...config.changeoverMin, VARIANT: 60 } }, DEFAULT_ASSIGNMENT, resolved),
    evaluate('milk-short', config, DEFAULT_ASSIGNMENT, resolved, releasedMilkL(resolved) - (rejectedTanker?.volumeL ?? 0))
  ]
}
