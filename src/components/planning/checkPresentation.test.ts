import { describe, expect, it } from 'vitest'
import { filterChecks, summarizeChecks } from './checkPresentation'
import type { CheckResult } from '../../domain/checks'

const checks: CheckResult[] = [
  { ruleId: 'A', status: 'pass', variant: 'pass', source: 'catalog' },
  { ruleId: 'B', status: 'warning', variant: 'warn', source: 'catalog' },
  { ruleId: 'C', status: 'violation', variant: 'bad', source: 'catalog' },
  { ruleId: 'D', status: 'not computable', variant: 'unknown', source: 'catalog' }
]

describe('planning diagnostic presentation', () => {
  it('summarizes actual check statuses', () => {
    expect(summarizeChecks(checks)).toEqual({ pass: 1, warning: 1, violation: 1, 'not computable': 1 })
  })

  it('filters the actual diagnostic list by status', () => {
    expect(filterChecks(checks, 'violation').map((check) => check.ruleId)).toEqual(['C'])
    expect(filterChecks(checks, 'not computable').map((check) => check.ruleId)).toEqual(['D'])
    expect(filterChecks(checks, 'all')).toHaveLength(4)
  })
})
