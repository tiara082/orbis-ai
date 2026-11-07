import { describe, expect, it } from 'vitest'
import { createPlanningFixture, TEST_IDS } from '../../domain/__fixtures__/planning.fixture'
import { lineSupply } from '../../domain/plan'

describe('machine allocation planning dependency', () => {
  it('resolves supply from the active plan dependency snapshot', () => {
    const fixture = createPlanningFixture()
    const changed = { ...fixture.dependencies, catalog: { ...fixture.dependencies.catalog, connections: fixture.dependencies.catalog.connections.map((connection) => connection.destination === TEST_IDS.line ? { ...connection, source: 'TEST-ALT-TANK', via: 'TEST-ALT-PIPE' } : connection) } }
    expect(lineSupply(TEST_IDS.line, changed)).toMatchObject({ asepticTankId: 'TEST-ALT-TANK', pipeId: 'TEST-ALT-PIPE' })
    expect(lineSupply(TEST_IDS.line, fixture.dependencies)).not.toMatchObject({ asepticTankId: 'TEST-ALT-TANK', pipeId: 'TEST-ALT-PIPE' })
  })
})
