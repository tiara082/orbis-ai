import { describe, expect, it } from 'vitest'
import { createPlanningFixture } from '../domain/__fixtures__/planning.fixture'
import { buildPlan } from '../domain/plan'
import { revisionDiagnostics, revisionSnapshot } from './planning'

describe('tank allocation diagnostic separation', () => {
  it('keeps approved diagnostics independent from current operational state', () => {
    const fixture = createPlanningFixture()
    const plan = buildPlan(fixture.config, undefined, fixture.dependencies)
    const snapshot = revisionSnapshot(plan, fixture.dependencies)
    const revision = { id: 'REV-1', version: 1, config: fixture.config, generatedAt: 0, generatedBy: 'test', status: 'approved' as const, ...snapshot }
    const approved = revisionDiagnostics(revision)
    const before = structuredClone(approved)
    fixture.dependencies.operational.assetStates[0].volumeL = 999999
    expect(approved).toEqual(before)
    expect(revisionDiagnostics(revision)).toBe(approved)
  })

  it('uses the changed operational snapshot for runtime capacity and holding checks', async () => {
    const fixture = createPlanningFixture()
    const base = buildPlan(fixture.config, undefined, fixture.dependencies)
    const changed = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, assetStates: fixture.dependencies.operational.assetStates.map((state) => ({ ...state, capacityL: 1, volumeL: 2 })) } }
    const { checkCapacity, checkHolding } = await import('../domain/checks')
    expect(checkCapacity(changed)).not.toEqual(checkCapacity(base.dependencies))
    expect(checkHolding(changed)).toEqual(expect.objectContaining({ ruleId: 'HOLDING' }))
  })
})
