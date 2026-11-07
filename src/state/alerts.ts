import { useMemo } from 'react'
import type { AppPath } from '../config/navigation'
import {
  checkHolding,
  checkReceivingCapacity,
  checkReceivingGate,
  runPlanChecks,
  type CheckResult
} from '../domain/checks'
import type { Minutes } from '../domain/time'
import type { Tone } from '../lib/status'
import { usePlanning } from './planning'
import type { Plan, PlanDependencies } from '../domain/plan'

export interface PlantAlert {
  id: string
  tone: Tone
  /** Rule-based alerts reuse the check message (checks.<rule>.<variant>) */
  check?: CheckResult
  /** Non-rule alerts use alerts.<id>.title / .body */
  path: AppPath
  time: Minutes
}

const PATH_BY_RULE: Record<string, AppPath> = {
  RECEIVING_GATE: '/operational-data/lab-release',
  HOLDING: '/operational-data/sfp-storage',
  CIP_EMPTY: '/operational-data/raw-milk-process',
  CAPACITY: '/operational-data/raw-milk-process',
  SIMULTANEOUS: '/production-schedule/planned-vs-actual',
  AT_SAME_PRODUCT: '/ai-planning/generate',
  AT_SHARED_FLOW: '/ai-planning/generate',
  MILK_BALANCE: '/ai-planning/forecasting',
  PLAN: '/production-schedule/recommended',
  LINE_PRODUCT: '/ai-planning/generate'
}

export interface PlantAlertRevision {
  generatedAt: Minutes
}

/** Builds active plant alerts from one explicit plan and its operational dependency snapshot. */
export function buildPlantAlerts(activePlan: Plan, pendingRevision?: PlantAlertRevision): PlantAlert[] {
  const dependencies: PlanDependencies = activePlan.dependencies
  const scenarioChecks = [checkReceivingGate(dependencies), checkHolding(dependencies), checkReceivingCapacity(dependencies)]
  const planChecks = runPlanChecks(activePlan, undefined, dependencies).filter(
      (check) => !['RECEIVING_GATE', 'HOLDING', 'BAY_EXCLUSIVE', 'CAPACITY'].includes(check.ruleId)
    )
  const ruleAlerts: PlantAlert[] = [...scenarioChecks, ...planChecks]
      .filter((check) => check.status === 'violation' || check.status === 'warning')
      .map((check) => ({
        id: `${check.ruleId}-${check.variant}`,
        tone: check.status === 'violation' ? 'danger' : 'warning',
        check,
        path: PATH_BY_RULE[check.ruleId] ?? '/dashboard',
        time: dependencies.operational.snapshot ?? pendingRevision?.generatedAt ?? 0
      }))

  const approval: PlantAlert[] = pendingRevision
      ? [{ id: 'approval', tone: 'brand', path: '/production-schedule/approval', time: pendingRevision.generatedAt }]
      : []

  return [...approval, ...ruleAlerts.sort((a, b) => (a.tone === 'danger' ? -1 : 0) - (b.tone === 'danger' ? -1 : 0))]
}

/** Active plant alerts: scenario state checks + checks on the approved plan + pending approval */
export function usePlantAlerts(): PlantAlert[] {
  const { activePlan, pendingRevision } = usePlanning()

  return useMemo(() => buildPlantAlerts(activePlan, pendingRevision), [activePlan, pendingRevision])
}
