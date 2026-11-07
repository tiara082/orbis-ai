import type { CatalogData } from '../data/catalog/types'
import type { Plan, PlanDependencies } from './plan'
import type { CheckResult, CheckStatus } from './checks'

export type ConstraintClassification = 'directly computable' | 'computable with existing operational data' | 'descriptive only' | 'requires business clarification'

export interface ConstraintAuditEntry {
  ruleId: string
  scope: string
  description: string
  classification: ConstraintClassification
  parameters: string[]
  missingParameters: string[]
  source: string[]
  evaluatedBy: 'buildPlan' | 'runPlanChecks' | 'none'
}

const COMPUTED: Record<string, Omit<ConstraintAuditEntry, 'ruleId' | 'scope' | 'description'>> = {
  RECEIVING_GATE: { classification: 'computable with existing operational data', parameters: ['delivery arrival/unload times', 'lab release'], missingParameters: [], source: ['OperationalSnapshot.deliveries', 'OperationalSnapshot.labRecords'], evaluatedBy: 'runPlanChecks' },
  BAY_EXCLUSIVE: { classification: 'computable with existing operational data', parameters: ['bayId', 'unloadStart', 'unloadEnd'], missingParameters: [], source: ['OperationalSnapshot.deliveries'], evaluatedBy: 'runPlanChecks' },
  CAPACITY: { classification: 'computable with existing operational data', parameters: ['volumeL', 'operational capacity', 'nominal capacity when numeric'], missingParameters: [], source: ['OperationalSnapshot.assetStates', 'CatalogData.assets'], evaluatedBy: 'runPlanChecks' },
  HOLDING: { classification: 'computable with existing operational data', parameters: ['batchStart', 'holdingLimitH', 'snapshot time'], missingParameters: [], source: ['OperationalSnapshot.assetStates'], evaluatedBy: 'runPlanChecks' },
  LINE_PRODUCT: { classification: 'directly computable', parameters: ['line', 'SKU', 'pack size'], missingParameters: [], source: ['CatalogData.lineProducts', 'CatalogData.lineFinished'], evaluatedBy: 'buildPlan' },
  CHANGEOVER_PRECEDENCE: { classification: 'directly computable', parameters: ['SKU flavour', 'pack size', 'market variant'], missingParameters: [], source: ['CatalogData.finishedSkus', 'CatalogData.liquidSkus'], evaluatedBy: 'buildPlan' },
  AT_SHARED_FLOW: { classification: 'computable with existing operational data', parameters: ['drawLph', 'outflowLph'], missingParameters: [], source: ['Plan.blocks', 'OperationalSnapshot.assetStates'], evaluatedBy: 'runPlanChecks' },
  AT_SAME_PRODUCT: { classification: 'directly computable', parameters: ['line supply', 'liquid SKU', 'time overlap'], missingParameters: [], source: ['CatalogData.connections', 'Plan.blocks'], evaluatedBy: 'runPlanChecks' },
  SIMULTANEOUS: { classification: 'computable with existing operational data', parameters: ['tank capacity', 'inflow', 'minimum level', 'CIP duration'], missingParameters: [], source: ['Plan.blocks', 'OperationalSnapshot.assetStates'], evaluatedBy: 'runPlanChecks' },
  FILLING_SPEED_UNIT: { classification: 'directly computable', parameters: ['packs/hour', 'pack size'], missingParameters: [], source: ['Plan.blocks', 'CatalogData.packSizes'], evaluatedBy: 'runPlanChecks' },
  PLAN: { classification: 'computable with existing operational data', parameters: ['order due', 'production outcome'], missingParameters: [], source: ['OperationalSnapshot.orders', 'Plan.orders'], evaluatedBy: 'runPlanChecks' }
}

const CLARIFICATION = new Set(['MARKET_VARIANT', 'CONNECTION', 'NOMINAL_NOT_ACTUAL', 'SIMULTANEOUS', 'HEADER_RESOURCE', 'RECIPE_ROUTE'])

export function auditConstraints(catalog: CatalogData, _plan?: Plan, _dependencies?: PlanDependencies): ConstraintAuditEntry[] {
  return catalog.constraints.map((constraint) => {
    const computed = COMPUTED[constraint.ruleId]
    if (computed) return { ruleId: constraint.ruleId, scope: constraint.scope, description: constraint.description, ...computed }
    const clarification = CLARIFICATION.has(constraint.ruleId)
    return {
      ruleId: constraint.ruleId,
      scope: constraint.scope,
      description: constraint.description,
      classification: clarification ? 'requires business clarification' : 'descriptive only',
      parameters: [],
      missingParameters: ['typed parameters and severity/thresholds'],
      source: ['ConstraintRule.description'],
      evaluatedBy: 'none'
    }
  })
}

export function constraintResult(ruleId: string, results: CheckResult[]): CheckResult | undefined {
  return results.find((result) => result.ruleId === ruleId)
}

export type { CheckStatus }
