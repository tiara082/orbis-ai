import { describe, expect, it } from 'vitest'
import { createPlanningFixture } from '../domain/__fixtures__/planning.fixture'
import { buildPlan } from '../domain/plan'
import { revisionDiagnostics, revisionSnapshot } from './planning'

describe('revision diagnostic source', () => {
  it('uses the stored revision diagnostics instead of recalculating the plan', () => {
    const fixture = createPlanningFixture()
    const snapshot = revisionSnapshot(buildPlan(fixture.config, undefined, fixture.dependencies), fixture.dependencies)
    const revision = { id: 'TEST', version: 1, config: fixture.config, generatedAt: 0, generatedBy: 'test', status: 'pending approval' as const, ...snapshot }
    const stored = revisionDiagnostics(revision, undefined)
    expect(stored).toBe(revision.diagnostics)
  })

  it('keeps stored diagnostics stable when source dependencies change', () => {
    const fixture = createPlanningFixture()
    const snapshot = revisionSnapshot(buildPlan(fixture.config, undefined, fixture.dependencies), fixture.dependencies)
    const revision = { id: 'TEST', version: 1, config: fixture.config, generatedAt: 0, generatedBy: 'test', status: 'pending approval' as const, ...snapshot }
    const before = structuredClone(revision.diagnostics)
    fixture.dependencies.catalog.lineProducts = []
    fixture.dependencies.operational.assetStates[0].volumeL = 999999
    expect(revisionDiagnostics(revision)).toEqual(before)
  })

  it('explicitly falls back for legacy revisions without diagnostics', () => {
    const fixture = createPlanningFixture()
    const plan = buildPlan(fixture.config, undefined, fixture.dependencies)
    const snapshot = revisionSnapshot(plan, fixture.dependencies)
    const legacy = { id: 'LEGACY', version: 1, config: fixture.config, generatedAt: 0, generatedBy: 'test', status: 'approved' as const, ...snapshot, diagnostics: undefined }
    const stored = { ...legacy, diagnostics: snapshot.diagnostics }
    expect(revisionDiagnostics(legacy, plan)).toEqual(revisionDiagnostics(stored))
    expect(revisionDiagnostics(legacy)).toEqual([])
  })
})
