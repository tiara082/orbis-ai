import { describe, expect, it } from 'vitest'
import { createPlanningFixture, TEST_IDS } from './__fixtures__/planning.fixture'
import { classifyChangeover } from './changeover'
import { packsToLiters } from './products'
import { validatePath } from './routing'
import { buildPlan } from './plan'
import { describeFinishedSku } from '../data/reference'

function catalogWithPackSize(sizeMl: number) {
  const fixture = createPlanningFixture()
  return { ...fixture, catalog: { ...fixture.dependencies.catalog, packSizes: [{ code: TEST_IDS.pack, description: 'Test', sizeMl }] } }
}

describe('catalog dependency boundary', () => {
  it('uses the supplied catalog snapshot for product lookup and does not read a newer catalog', () => {
    const oldCatalog = catalogWithPackSize(1000).catalog
    const newCatalog = catalogWithPackSize(500).catalog

    expect(packsToLiters(TEST_IDS.finished, 10, oldCatalog)).toBe(10)
    expect(packsToLiters(TEST_IDS.finished, 10, newCatalog)).toBe(5)
    expect(packsToLiters(TEST_IDS.finished, 10, oldCatalog)).toBe(10)
  })

  it('uses catalog product metadata for changeover classification', () => {
    const fixture = createPlanningFixture()
    const variantCatalog = {
      ...fixture.dependencies.catalog,
      liquidSkus: [...fixture.dependencies.catalog.liquidSkus, { skuId: 'TEST-LIQUID-CHOCOLATE', productName: 'Chocolate', family: 'TEST', flavour: 'Chocolate', packSizeCodes: [TEST_IDS.pack], marketVariants: [TEST_IDS.market] }],
      finishedSkus: fixture.dependencies.catalog.finishedSkus.map((sku) => sku.finishedSkuId === TEST_IDS.finishedNext ? { ...sku, liquidSkuId: 'TEST-LIQUID-CHOCOLATE' } : sku)
    }

    expect(classifyChangeover(TEST_IDS.finished, TEST_IDS.finishedNext, fixture.dependencies.catalog)).toBe('NONE')
    expect(classifyChangeover(TEST_IDS.finished, TEST_IDS.finishedNext, variantCatalog)).toBe('VARIANT')
  })

  it('uses connections from the supplied catalog snapshot for routing', () => {
    const fixture = createPlanningFixture()
    const path = [TEST_IDS.tank, TEST_IDS.line]
    const withoutConnection = { ...fixture.dependencies.catalog, connections: [] }

    expect(validatePath(path, fixture.dependencies.catalog).valid).toBe(true)
    expect(validatePath(path, withoutConnection).valid).toBe(false)
    expect(validatePath(path, fixture.dependencies.catalog).valid).toBe(true)
  })

  it('keeps legacy product and routing callers on reference defaults', () => {
    const reference = describeFinishedSku(TEST_IDS.finished)
    expect(reference.finished).toBeUndefined()
    expect(validatePath(['UNKNOWN-A', 'UNKNOWN-B']).valid).toBe(false)
  })

  it('buildPlan uses one explicit catalog dependency for plan helpers', () => {
    const fixture = createPlanningFixture()
    const catalog = { ...fixture.dependencies.catalog, packSizes: [{ code: TEST_IDS.pack, description: 'Changed', sizeMl: 500 }] }
    const dependencies = { ...fixture.dependencies, catalog }
    const plan = buildPlan(fixture.config, undefined, dependencies)

    expect(plan.dependencies.catalog).toBe(catalog)
    expect(plan.blocks.filter((block) => block.kind === 'production').every((block) => block.liters === (block.packs ?? 0) * 0.5)).toBe(true)
  })
})
