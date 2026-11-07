import {
  ASSETS,
  CHANGEOVER_RULES,
  CIP_RULES,
  CONNECTIONS,
  CONSTRAINTS,
  FINISHED_SKUS,
  LINE_DEDICATION,
  LINE_FINISHED_SKU_COMPATIBILITY,
  LINE_PRODUCT_COMPATIBILITY,
  LIQUID_SKUS,
  MARKET_VARIANTS,
  PACK_SIZES
} from '../../reference'
import type { CatalogData } from '../types'

export function createCsvCatalog(): CatalogData {
  return structuredClone({
    liquidSkus: LIQUID_SKUS,
    finishedSkus: FINISHED_SKUS,
    packSizes: PACK_SIZES,
    markets: MARKET_VARIANTS,
    assets: ASSETS,
    connections: CONNECTIONS,
    lineDedication: LINE_DEDICATION,
    lineProducts: LINE_PRODUCT_COMPATIBILITY,
    lineFinished: LINE_FINISHED_SKU_COMPATIBILITY,
    constraints: CONSTRAINTS,
    changeovers: CHANGEOVER_RULES,
    cipRules: CIP_RULES
  })
}
