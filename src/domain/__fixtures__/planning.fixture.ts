import type { CatalogData } from '../../data/catalog/types'
import type { AssetState, ProductionOrder } from '../../data/scenario'
import type { PlanConfig, PlanDependencies } from '../plan'

export const TEST_IDS = {
  liquid: 'TEST-LIQUID-2A',
  finished: 'TEST-FINISHED-2A',
  finishedNext: 'TEST-FINISHED-NEXT-2A',
  pack: 'TEST-PACK-2A',
  market: 'TEST-MARKET-2A',
  line: 'TEST-LINE-2A',
  tank: 'TEST-TANK-2A',
  tankAlt: 'TEST-TANK-ALT-2A',
  pipe: 'TEST-PIPE-2A',
  connection: 'TEST-CONNECTION-2A',
  connectionAlt: 'TEST-CONNECTION-ALT-2A',
  order: 'TEST-ORDER-2A',
  orderNext: 'TEST-ORDER-NEXT-2A'
} as const

export function createPlanningFixture(): { dependencies: { catalog: CatalogData; operational: PlanDependencies['operational'] }; config: PlanConfig; order: ProductionOrder } {
  const { liquid, finished, finishedNext, pack, market, line, tank, tankAlt, pipe, connection, connectionAlt, order: orderId, orderNext } = TEST_IDS
  const catalog: CatalogData = {
    liquidSkus: [{ skuId: liquid, productName: 'Test Product', family: 'TEST', flavour: 'Full Cream', packSizeCodes: [pack], marketVariants: [market] }],
    finishedSkus: [
      { finishedSkuId: finished, liquidSkuId: liquid, packSizeCode: pack, marketVariant: market },
      { finishedSkuId: finishedNext, liquidSkuId: liquid, packSizeCode: pack, marketVariant: market }
    ],
    packSizes: [{ code: pack, description: 'Test 1000 ml', sizeMl: 1000 }],
    markets: [{ code: market, name: 'Test Market', applicableLiquidSkus: liquid }],
    assets: [
      { id: line, type: 'Filling Line', name: 'Test Line', nodeRole: 'process_asset', compatibleFamilies: ['TEST'], params: {} as never },
      { id: tank, type: 'Aseptic Tank', name: 'Test Tank', nodeRole: 'process_asset', compatibleFamilies: ['TEST'], params: {} as never },
      { id: tankAlt, type: 'Aseptic Tank', name: 'Test Tank Alt', nodeRole: 'process_asset', compatibleFamilies: ['TEST'], params: {} as never },
      { id: pipe, type: 'Dedicated Pipe', name: 'Test Pipe', nodeRole: 'physical_pipe', compatibleFamilies: ['TEST'], params: {} as never }
    ],
    connections: [
      { id: connection, source: tank, destination: line, via: pipe, maxFlow: 10000, flowType: 'aseptic_supply', condition: 'TEST' },
      { id: connectionAlt, source: tank, destination: 'TEST-OTHER-LINE-2A', via: pipe, maxFlow: 10000, flowType: 'aseptic_supply', condition: 'TEST' }
    ],
    lineDedication: [{ lineId: line, allowedSkuIds: [liquid], packSizeCodes: [pack], sourceAsepticTankId: tank, speed: 120 }],
    lineProducts: [{ lineId: line, skuId: liquid, packSizeCode: pack, eligible: true }],
    lineFinished: [
      { lineId: line, finishedSkuId: finished, liquidSkuId: liquid, packSizeCode: pack, marketVariant: market, eligible: true },
      { lineId: line, finishedSkuId: finishedNext, liquidSkuId: liquid, packSizeCode: pack, marketVariant: market, eligible: true }
    ],
    constraints: [{ ruleId: 'TEST-CONSTRAINT-2A', scope: 'TEST', description: 'Test constraint' }],
    changeovers: [
      { ruleId: 'VARIANT', precedence: 'TEST', condition: 'TEST', activity: 'Test changeover', duration: 20, note: 'TEST' },
      { ruleId: 'SIZE', precedence: 'TEST', condition: 'TEST', activity: 'Test size changeover', duration: 20, note: 'TEST' },
      { ruleId: 'PAPER', precedence: 'TEST', condition: 'TEST', activity: 'Test paper changeover', duration: 20, note: 'TEST' },
      { ruleId: 'NONE', precedence: 'TEST', condition: 'TEST', activity: 'None', duration: 0, note: 'TEST' }
    ],
    cipRules: [{ ruleId: 'CIP_FLAVOUR', trigger: 'TEST', assetScope: [line], requirement: 'TEST', duration: 15 }]
  }
  const order: ProductionOrder = { id: orderId, finishedSkuId: finished, packs: 120, priority: 'high', dayOffset: 0, due: 1000 }
  const operationalOrders = [order, { ...order, id: orderNext, finishedSkuId: finishedNext }]
  const assetStates: AssetState[] = [{ assetId: line, status: 'ready', speedPackph: 120 }, { assetId: tank, status: 'ready', outflowLph: 10000 }]
  return {
    dependencies: { catalog, operational: { orders: operationalOrders, assetStates } },
    config: { orderPacks: { [orderId]: 120, [orderNext]: 120 }, orderPriority: { [orderId]: 'high', [orderNext]: 'high' }, lineSpeed: {}, utilizationPct: 100, start: 0, changeoverMin: { VARIANT: 30, SIZE: 20, PAPER: 10 }, cipMin: { CIP_FLAVOUR: 45, CIP_CH_ST: 45, CIP_END_PRODUCTION: 60 } },
    order
  }
}
