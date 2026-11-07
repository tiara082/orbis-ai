import { describe, expect, it } from 'vitest'
import { createPlanningFixture, TEST_IDS } from '../domain/__fixtures__/planning.fixture'
import { buildPlan } from '../domain/plan'
import { revisionSnapshot } from './planning'

describe('immutable planning revisions', () => {
  it('stores independent plan, diagnostics, and dependency identities', () => {
    const fixture = createPlanningFixture()
    const plan = buildPlan(fixture.config, undefined, fixture.dependencies)
    const revision = revisionSnapshot(plan, fixture.dependencies)
    const originalBlocks = revision.plan.blocks.length
    fixture.dependencies.operational.assetStates[0].volumeL = 999999
    expect(revision.plan.blocks).toHaveLength(originalBlocks)
    expect(revision.diagnostics).toEqual(expect.any(Array))
    expect(revision.catalogVersion).toBe(0)
    expect(revision.operationalIdentity).toContain(TEST_IDS.tank)
    expect(revision.inputIdentity).toContain(fixture.order.id)
  })

  it('keeps the snapshot and diagnostics tied to the generated plan', () => {
    const fixture = createPlanningFixture()
    const plan = buildPlan(fixture.config, undefined, fixture.dependencies)
    const revision = revisionSnapshot(plan, fixture.dependencies)
    expect(revision.plan.dependencies).not.toBe(fixture.dependencies)
    expect(revision.diagnostics).toEqual(revisionSnapshot(plan, fixture.dependencies).diagnostics)
    expect(Object.isFrozen(revision.plan)).toBe(true)
    expect(Object.isFrozen(revision.diagnostics)).toBe(true)
  })
})
