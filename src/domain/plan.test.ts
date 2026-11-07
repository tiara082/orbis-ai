import { describe, expect, it } from 'vitest'
import { createPlanningFixture, TEST_IDS } from './__fixtures__/planning.fixture'
import { buildPlan, type LineAssignment } from './plan'
import type { CatalogData } from '../data/catalog/types'

const catalogOf = (fixture: ReturnType<typeof createPlanningFixture>): CatalogData => fixture.dependencies.catalog

const assignment = (orderId: string, lineId = TEST_IDS.line): LineAssignment[] => [{ lineId, items: [{ orderId }] }]

describe('planning against an isolated catalog snapshot', () => {
  it('uses one explicit dependency snapshot for preview and checks', async () => {
    const fixture = createPlanningFixture()
    const preview = buildPlan(fixture.config, assignment(fixture.order.id), fixture.dependencies)
    const pending = buildPlan(fixture.config, assignment(fixture.order.id), fixture.dependencies)
    const { runPlanChecks } = await import('./checks')
    expect(preview.dependencies).toBe(fixture.dependencies)
    expect(pending.dependencies).toBe(fixture.dependencies)
    expect(runPlanChecks(preview)).toEqual(runPlanChecks(pending))
  })

  it('changes preview diagnostics when catalog or operational snapshots change', async () => {
    const fixture = createPlanningFixture()
    const catalogChanged = { ...fixture.dependencies, catalog: { ...catalogOf(fixture), lineProducts: [] } }
    const operationalChanged = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, assetStates: [{ assetId: TEST_IDS.tank, status: 'maintenance' as const, capacityL: 1, volumeL: 2 }] } }
    const baseline = buildPlan(fixture.config, assignment(fixture.order.id), fixture.dependencies)
    const catalogPlan = buildPlan(fixture.config, assignment(fixture.order.id), catalogChanged)
    const operationalPlan = buildPlan(fixture.config, assignment(fixture.order.id), operationalChanged)
    const { runPlanChecks } = await import('./checks')
    expect(catalogPlan.diagnostics.length).toBeGreaterThan(baseline.diagnostics.length)
    expect(runPlanChecks(operationalPlan)).not.toEqual(runPlanChecks(baseline))
  })

  it('creates a production block for a valid Finished SKU', () => {
    const fixture = createPlanningFixture()
    const plan = buildPlan(fixture.config, assignment(fixture.order.id), fixture.dependencies)
    expect(plan.blocks.some((block) => block.kind === 'production' && block.finishedSkuId === TEST_IDS.finished)).toBe(true)
    expect(plan.diagnostics.filter((item) => item.orderId === fixture.order.id)).toHaveLength(0)
  })

  it('reports a missing Finished SKU instead of dropping the order silently', () => {
    const fixture = createPlanningFixture()
    const dependencies = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, orders: [{ ...fixture.order, finishedSkuId: 'TEST-MISSING-FINISHED-2A' }] } }
    const plan = buildPlan(fixture.config, assignment(fixture.order.id), dependencies)
    expect(plan.blocks.filter((block) => block.kind === 'production')).toHaveLength(0)
    expect(plan.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'missing dependency', finishedSkuId: 'TEST-MISSING-FINISHED-2A' })]))
  })

  it('reports an incompatible line as a constraint violation', () => {
    const fixture = createPlanningFixture()
    const dependencies = { ...fixture.dependencies, catalog: { ...catalogOf(fixture), lineFinished: [] } }
    const plan = buildPlan(fixture.config, assignment(fixture.order.id), dependencies)
    expect(plan.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'constraint violation', orderId: fixture.order.id })]))
  })

  it('changes line supply when the catalog connection changes', () => {
    const fixture = createPlanningFixture()
    const first = buildPlan(fixture.config, assignment(fixture.order.id), fixture.dependencies)
    const changedCatalog = { ...catalogOf(fixture), connections: [{ ...catalogOf(fixture).connections[0], source: TEST_IDS.tankAlt }] }
    const second = buildPlan(fixture.config, assignment(fixture.order.id), { ...fixture.dependencies, catalog: changedCatalog })
    expect(first.blocks[0]?.supplyTankId).toBe(TEST_IDS.tank)
    expect(second.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({ severity: 'constraint violation', message: expect.stringContaining('source tank') })]))
    expect(changedCatalog.connections[0].source).not.toBe(fixture.dependencies.catalog.connections[0].source)
  })

  it('changes production duration when line speed changes', () => {
    const fixture = createPlanningFixture()
    const slow = buildPlan({ ...fixture.config, lineSpeed: { [TEST_IDS.line]: 60 } }, assignment(fixture.order.id), fixture.dependencies)
    const fast = buildPlan({ ...fixture.config, lineSpeed: { [TEST_IDS.line]: 120 } }, assignment(fixture.order.id), fixture.dependencies)
    const slowBlock = slow.blocks.find((block) => block.kind === 'production')!
    const fastBlock = fast.blocks.find((block) => block.kind === 'production')!
    expect(slowBlock.end - slowBlock.start).toBe(120)
    expect(fastBlock.end - fastBlock.start).toBe(60)
  })

  it('uses the catalog changeover duration', () => {
    const fixture = createPlanningFixture()
    const base = buildPlan(fixture.config, [{ lineId: TEST_IDS.line, items: [{ orderId: fixture.order.id }, { orderId: TEST_IDS.orderNext }] }], fixture.dependencies)
    const changed = { ...catalogOf(fixture), finishedSkus: catalogOf(fixture).finishedSkus.map((row, index) => index === 0 ? { ...row, marketVariant: 'TEST-MARKET-OTHER-2A' } : row), markets: [...catalogOf(fixture).markets, { code: 'TEST-MARKET-OTHER-2A', name: 'Other', applicableLiquidSkus: TEST_IDS.liquid }], changeovers: catalogOf(fixture).changeovers.map((rule) => rule.ruleId === 'PAPER' ? { ...rule, duration: 55 } : rule) }
    const plan = buildPlan(fixture.config, [{ lineId: TEST_IDS.line, items: [{ orderId: fixture.order.id }, { orderId: TEST_IDS.orderNext }] }], { ...fixture.dependencies, catalog: changed })
    expect(plan.blocks.some((block) => block.kind === 'PAPER' && block.end - block.start === 55)).toBe(true)
    expect(base.blocks.some((block) => block.kind === 'PAPER')).toBe(false)
  })

  it('uses the catalog CIP duration when the trigger applies', () => {
    const fixture = createPlanningFixture()
    const catalog = catalogOf(fixture)
    const flavouredId = 'TEST-LIQUID-FLAVOUR-2A'
    const secondId = 'TEST-LIQUID-SECOND-2A'
    const changed = {
      ...catalog,
      liquidSkus: [
        { ...catalog.liquidSkus[0], skuId: flavouredId, flavour: 'Chocolate' },
        { ...catalog.liquidSkus[0], skuId: secondId, flavour: 'Full Cream' }
      ],
      finishedSkus: [
        { ...catalog.finishedSkus[0], liquidSkuId: flavouredId },
        { ...catalog.finishedSkus[1], liquidSkuId: secondId }
      ],
      lineDedication: catalog.lineDedication.map((row) => ({ ...row, allowedSkuIds: [flavouredId, secondId], packSizeCodes: [TEST_IDS.pack] })),
      lineProducts: [
        { lineId: TEST_IDS.line, skuId: flavouredId, packSizeCode: TEST_IDS.pack, eligible: true },
        { lineId: TEST_IDS.line, skuId: secondId, packSizeCode: TEST_IDS.pack, eligible: true }
      ],
      lineFinished: [
        { lineId: TEST_IDS.line, finishedSkuId: TEST_IDS.finished, liquidSkuId: flavouredId, packSizeCode: TEST_IDS.pack, marketVariant: TEST_IDS.market, eligible: true },
        { lineId: TEST_IDS.line, finishedSkuId: TEST_IDS.finishedNext, liquidSkuId: secondId, packSizeCode: TEST_IDS.pack, marketVariant: TEST_IDS.market, eligible: true }
      ],
      cipRules: [{ ...catalog.cipRules[0], duration: 17 }]
    }
    const plan = buildPlan(fixture.config, [{ lineId: TEST_IDS.line, items: [{ orderId: fixture.order.id }, { orderId: TEST_IDS.orderNext }] }], { ...fixture.dependencies, catalog })
    const changedPlan = buildPlan(fixture.config, [{ lineId: TEST_IDS.line, items: [{ orderId: fixture.order.id }, { orderId: TEST_IDS.orderNext }] }], { ...fixture.dependencies, catalog: changed })
    expect(plan.blocks.some((block) => block.kind === 'CIP' && block.ruleId === 'CIP_FLAVOUR')).toBe(false)
    expect(changedPlan.blocks.some((block) => block.kind === 'CIP' && block.ruleId === 'CIP_FLAVOUR' && block.end - block.start === 17)).toBe(true)
  })

  it('uses the supplied operational snapshot for receiving gate A/B', async () => {
    const { checkReceivingGate } = await import('./checks')
    const fixture = createPlanningFixture()
    const delivery = { id: 'TEST-DELIVERY-2C2', farmId: 'TEST-FARM-2C2', volumeL: 100, truckCapacityL: 200, departure: 0, eta: 10, arrival: 20, unloadStart: 30, unloadEnd: 40, destinations: [] }
    const lab = { deliveryId: delivery.id, sampleId: 'TEST-SAMPLE-2C2', samplingStart: 20, samplingEnd: 21, labStart: 21, result: 'within spec' as const, qcStatus: 'Passed' as const, releaseTime: 25 }
    const allowed = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, deliveries: [delivery], labRecords: [lab] } }
    const blocked = { ...allowed, operational: { ...allowed.operational, deliveries: [{ ...delivery, arrival: 20, unloadStart: undefined, unloadEnd: undefined }], labRecords: [{ ...lab, qcStatus: 'Pending' as const, releaseTime: undefined }] } }
    expect(checkReceivingGate(allowed)).toMatchObject({ ruleId: 'RECEIVING_GATE', status: 'pass' })
    expect(checkReceivingGate(blocked)).toMatchObject({ ruleId: 'RECEIVING_GATE', status: 'warning' })
    expect(checkReceivingGate(blocked)).not.toEqual(checkReceivingGate(allowed))
  })

  it('uses supplied operational capacity for receiving capacity', async () => {
    const { checkReceivingCapacity } = await import('./checks')
    const fixture = createPlanningFixture()
    const delivery = { id: 'TEST-DELIVERY-CAP-2C2', farmId: 'TEST-FARM-2C2', volumeL: 500, truckCapacityL: 500, departure: 0, eta: 10, arrival: undefined, destinations: [] }
    const base = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, deliveries: [delivery], labRecords: [] } }
    const enough = { ...base, operational: { ...base.operational, deliveries: [{ ...delivery, arrival: undefined }], assetStates: [{ assetId: 'RMT-TEST-2C2', status: 'ready' as const, capacityL: 1000, volumeL: 0 }] } }
    const insufficient = { ...base, operational: { ...base.operational, deliveries: [{ ...delivery, arrival: undefined }], assetStates: [{ assetId: 'RMT-TEST-2C2', status: 'ready' as const, capacityL: 100, volumeL: 0 }] } }
    expect(checkReceivingCapacity(enough)).toMatchObject({ status: 'pass' })
    expect(checkReceivingCapacity(insufficient)).toMatchObject({ status: 'violation' })
  })

  it('keeps Plan A checks bound to Plan A dependencies', async () => {
    const { checkReceivingGate } = await import('./checks')
    const fixture = createPlanningFixture()
    const plan = buildPlan(fixture.config, assignment(fixture.order.id), fixture.dependencies)
    const changed = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, deliveries: [{ id: 'TEST-DELIVERY-PLAN-2C2', farmId: 'TEST-FARM-2C2', volumeL: 10, truckCapacityL: 10, departure: 0, eta: 1, arrival: 2, unloadStart: 3, unloadEnd: 4, destinations: [] }], labRecords: [] } }
    expect(checkReceivingGate(plan.dependencies)).toMatchObject({ status: 'warning' })
    expect(checkReceivingGate(changed)).toMatchObject({ status: 'violation' })
  })

  it('preserves dependency flow for plan callers through plan.dependencies', () => {
    const fixture = createPlanningFixture()
    const plan = buildPlan(fixture.config, assignment(fixture.order.id), fixture.dependencies)
    expect(plan.dependencies).toBe(fixture.dependencies)
  })

  it('changes aseptic readiness when the supplied tank runtime state changes', async () => {
    const { asepticReadiness } = await import('./checks')
    const fixture = createPlanningFixture()
    const line2 = 'TEST-LINE-2C3'
    const secondOrder = { ...fixture.order, id: 'TEST-ORDER-2C3', finishedSkuId: TEST_IDS.finishedNext }
    const catalog = catalogOf(fixture)
    const secondLiquid = 'TEST-LIQUID-2C3'
    const expandedCatalog = {
      ...catalog,
      liquidSkus: [...catalog.liquidSkus, { ...catalog.liquidSkus[0], skuId: secondLiquid, flavour: 'Chocolate' }],
      finishedSkus: catalog.finishedSkus.map((row) => row.finishedSkuId === TEST_IDS.finishedNext ? { ...row, liquidSkuId: secondLiquid } : row),
      assets: [...catalog.assets, { ...catalog.assets[0], id: line2, name: 'Test Line 2C3' }],
      connections: [...catalog.connections, { ...catalog.connections[0], id: 'TEST-CONNECTION-2C3', destination: line2 }],
      lineDedication: [...catalog.lineDedication, { ...catalog.lineDedication[0], lineId: line2, allowedSkuIds: [secondLiquid] }],
      lineProducts: [...catalog.lineProducts, { ...catalog.lineProducts[0], lineId: line2, skuId: secondLiquid }],
      lineFinished: [...catalog.lineFinished, { ...catalog.lineFinished[0], lineId: line2 }, { ...catalog.lineFinished[1], lineId: line2, liquidSkuId: secondLiquid }]
    }
    const dependencies = { catalog: expandedCatalog, operational: { ...fixture.dependencies.operational, orders: [fixture.order, secondOrder], assetStates: [...fixture.dependencies.operational.assetStates, { assetId: line2, status: 'ready' as const, speedPackph: 120 }, { assetId: TEST_IDS.tank, status: 'ready' as const, capacityL: 1000, inflowLph: 1000, minLevelPct: { oneLine: 25, twoLines: 50 }, cipMinutes: 5 }] } }
    const plan = buildPlan(fixture.config, [{ lineId: TEST_IDS.line, items: [{ orderId: fixture.order.id }] }, { lineId: line2, items: [{ orderId: secondOrder.id }] }], dependencies)
    const ready = { ...dependencies, operational: { ...dependencies.operational, assetStates: dependencies.operational.assetStates.map((state) => state.assetId === TEST_IDS.tank ? { ...state, inflowLph: 1000 } : state) } }
    const slow = { ...dependencies, operational: { ...dependencies.operational, assetStates: dependencies.operational.assetStates.map((state) => state.assetId === TEST_IDS.tank ? { ...state, capacityL: 2000, inflowLph: 100 } : state) } }
    expect(asepticReadiness(plan, ready)).toHaveLength(1)
    expect(asepticReadiness(plan, ready)[0].readyAt).not.toBe(asepticReadiness(plan, slow)[0].readyAt)
  })

  it('runPlanChecks(plan) uses plan.dependencies, while explicit dependencies override it', async () => {
    const { runPlanChecks } = await import('./checks')
    const fixture = createPlanningFixture()
    const delivery = { id: 'TEST-DELIVERY-2C3', farmId: 'TEST-FARM-2C3', volumeL: 100, truckCapacityL: 100, departure: 0, eta: 1, arrival: 2, unloadStart: undefined, unloadEnd: undefined, destinations: [] }
    const planDependencies = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, deliveries: [delivery], labRecords: [{ deliveryId: delivery.id, sampleId: 'TEST-SAMPLE-2C3', samplingStart: 2, samplingEnd: 3, labStart: 3, result: 'awaiting result' as const, qcStatus: 'Pending' as const }] } }
    const plan = buildPlan(fixture.config, assignment(fixture.order.id), planDependencies)
    const override = { ...planDependencies, operational: { ...planDependencies.operational, deliveries: [], labRecords: [] } }
    const fromPlan = runPlanChecks(plan).find((check) => check.ruleId === 'RECEIVING_GATE')
    const fromOverride = runPlanChecks(plan, { milkAvailableL: 0 }, override).find((check) => check.ruleId === 'RECEIVING_GATE')
    expect(fromPlan).toMatchObject({ status: 'warning' })
    expect(fromOverride).toMatchObject({ status: 'pass' })
  })

  it('uses nominal capacity as a design ceiling without replacing operational capacity', async () => {
    const { checkCapacity } = await import('./checks')
    const fixture = createPlanningFixture()
    const asset = { ...catalogOf(fixture).assets.find((item) => item.id === TEST_IDS.tank)!, params: { capacity_l: 1000 } as never }
    const catalog = { ...catalogOf(fixture), assets: catalogOf(fixture).assets.map((item) => item.id === TEST_IDS.tank ? asset : item) }
    const below = { ...fixture.dependencies, catalog, operational: { ...fixture.dependencies.operational, assetStates: [{ assetId: TEST_IDS.tank, status: 'ready' as const, capacityL: 900, volumeL: 800 }] } }
    const above = { ...below, operational: { ...below.operational, assetStates: [{ ...below.operational.assetStates[0], capacityL: 1200, volumeL: 800 }] } }
    expect(checkCapacity(below)).toMatchObject({ status: 'pass' })
    expect(checkCapacity(above)).toMatchObject({ status: 'violation' })
  })

  it('evaluates deterministic CIP asset type scope and reports semantic scope as not computable', async () => {
    const { runPlanChecks } = await import('./checks')
    const fixture = createPlanningFixture()
    const catalog = { ...catalogOf(fixture), assets: catalogOf(fixture).assets.map((item) => item.id === TEST_IDS.tank ? { ...item, type: 'Aseptic Tank' } : item), cipRules: [{ ...catalogOf(fixture).cipRules[0], ruleId: 'CIP_END_PRODUCTION', assetScope: ['Aseptic Tank'] }] }
    const plan = buildPlan(fixture.config, [{ lineId: TEST_IDS.line, items: [{ orderId: fixture.order.id }, { orderId: TEST_IDS.orderNext }] }], { ...fixture.dependencies, catalog })
    const scope = runPlanChecks(plan).find((check) => check.ruleId === 'CIP_SCOPE')
    expect(scope).toMatchObject({ status: 'pass' })
    const semanticCatalog = { ...catalog, cipRules: [{ ...catalog.cipRules[0], assetScope: ['Aset yang benar-benar dilalui produk terkait'] }] }
    const semanticPlan = buildPlan(fixture.config, [{ lineId: TEST_IDS.line, items: [{ orderId: fixture.order.id }, { orderId: TEST_IDS.orderNext }] }], { ...fixture.dependencies, catalog: semanticCatalog })
    expect(runPlanChecks(semanticPlan).find((check) => check.ruleId === 'CIP_SCOPE')).toMatchObject({ status: 'not computable' })
  })

  it('keeps the current diagnostic contract explicit for catalog constraints', () => {
    const fixture = createPlanningFixture()
    const plan = buildPlan(fixture.config, assignment(fixture.order.id), fixture.dependencies)
    expect(fixture.dependencies.catalog.constraints.some((rule) => rule.ruleId === 'TEST-CONSTRAINT-2A')).toBe(true)
    expect(plan.diagnostics).toEqual([])
  })
})
