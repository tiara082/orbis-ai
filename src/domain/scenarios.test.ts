import { describe, expect, it } from 'vitest'
import { createPlanningFixture, TEST_IDS } from './__fixtures__/planning.fixture'
import { runScenarios } from './scenarios'

describe('scenario dependency boundary', () => {
  it('uses one dependency object for every scenario variant', () => {
    const fixture = createPlanningFixture()
    const results = runScenarios(fixture.config, fixture.dependencies)
    expect(results).toHaveLength(6)
    expect(results.every((result) => result.plan.dependencies === fixture.dependencies)).toBe(true)
  })

  it('applies catalog and operational snapshot changes consistently to all variants', () => {
    const fixture = createPlanningFixture()
    const catalog = { ...fixture.dependencies, catalog: { ...fixture.dependencies.catalog, lineProducts: [] } }
    const operational = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, assetStates: fixture.dependencies.operational.assetStates.map((state) => state.assetId === TEST_IDS.line ? { ...state, speedPackph: 1 } : state) } }
    const catalogResults = runScenarios(fixture.config, catalog)
    const operationalResults = runScenarios({ ...fixture.config, lineSpeed: {} }, operational)
    expect(catalogResults.every((result) => result.plan.dependencies === catalog)).toBe(true)
    expect(operationalResults.every((result) => result.plan.dependencies === operational)).toBe(true)
    expect(catalogResults[0].plan.diagnostics.length).toBeGreaterThan(0)
    expect(operationalResults[0].plan.dependencies).toBe(operational)
    expect(operationalResults[0].plan.dependencies.operational.assetStates).toBe(operational.operational.assetStates)
  })
})
