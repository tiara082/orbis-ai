import { describe, expect, it } from 'vitest'
import { auditConstraints } from './constraint-audit'
import { createPlanningFixture } from './__fixtures__/planning.fixture'

describe('constraint audit', () => {
  it('classifies actual catalog constraints without inventing parameters', () => {
    const fixture = createPlanningFixture()
    const entries = auditConstraints(fixture.dependencies.catalog)
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ ruleId: 'TEST-CONSTRAINT-2A', classification: 'descriptive only', evaluatedBy: 'none' })
    expect(entries[0].missingParameters).toContain('typed parameters and severity/thresholds')
  })
})
