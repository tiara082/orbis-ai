import type { CheckResult } from '../../domain/checks'

export type CheckFilter = 'all' | CheckResult['status']

export function filterChecks(checks: CheckResult[], filter: CheckFilter): CheckResult[] {
  return filter === 'all' ? checks : checks.filter((check) => check.status === filter)
}

export function summarizeChecks(checks: CheckResult[]) {
  return checks.reduce(
    (summary, check) => ({ ...summary, [check.status]: summary[check.status] + 1 }),
    { pass: 0, warning: 0, violation: 0, 'not computable': 0 } as Record<CheckResult['status'], number>
  )
}
