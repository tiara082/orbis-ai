import { getFinishedSku, getLiquidSku } from '../data/reference'
import type { CatalogData } from '../data/catalog/types'

export type ChangeoverActivity = 'VARIANT' | 'SIZE' | 'PAPER' | 'NONE'

/**
 * CHANGEOVER_PRECEDENCE: a flavour change overrides size and paper; the same
 * flavour with a different size is a size change even if the market changes;
 * only a market change is a paper change. CIP is evaluated separately.
 */
export function classifyChangeover(prevFinishedSkuId: string, nextFinishedSkuId: string, catalog?: CatalogData): ChangeoverActivity {
  const prev = catalog ? catalog.finishedSkus.find((sku) => sku.finishedSkuId === prevFinishedSkuId) : getFinishedSku(prevFinishedSkuId)
  const next = catalog ? catalog.finishedSkus.find((sku) => sku.finishedSkuId === nextFinishedSkuId) : getFinishedSku(nextFinishedSkuId)
  if (!prev || !next) return 'NONE'
  const prevFlavour = (catalog ? catalog.liquidSkus.find((sku) => sku.skuId === prev.liquidSkuId) : getLiquidSku(prev.liquidSkuId))?.flavour
  const nextFlavour = (catalog ? catalog.liquidSkus.find((sku) => sku.skuId === next.liquidSkuId) : getLiquidSku(next.liquidSkuId))?.flavour
  if (prevFlavour !== nextFlavour) return 'VARIANT'
  if (prev.packSizeCode !== next.packSizeCode) return 'SIZE'
  if (prev.marketVariant !== next.marketVariant) return 'PAPER'
  return 'NONE'
}

export type FlavourCipRule = 'CIP_FLAVOUR' | 'CIP_CH_ST'

/** CIP triggers from cip_rules.csv that depend on the flavour sequence */
export function flavourCipTrigger(prevLiquidSkuId: string, nextLiquidSkuId: string, catalog?: CatalogData): FlavourCipRule | undefined {
  const prev = (catalog ? catalog.liquidSkus.find((sku) => sku.skuId === prevLiquidSkuId) : getLiquidSku(prevLiquidSkuId))?.flavour
  const next = (catalog ? catalog.liquidSkus.find((sku) => sku.skuId === nextLiquidSkuId) : getLiquidSku(nextLiquidSkuId))?.flavour
  if ((prev === 'Chocolate' || prev === 'Strawberry') && next === 'Full Cream') return 'CIP_FLAVOUR'
  if ((prev === 'Chocolate' && next === 'Strawberry') || (prev === 'Strawberry' && next === 'Chocolate')) return 'CIP_CH_ST'
  return undefined
}
