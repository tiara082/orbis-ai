import { describeFinishedSku, getLiquidSku } from '../data/reference'
import type { CatalogData } from '../data/catalog/types'

/**
 * Project assumption, not part of the official catalog: Full Cream uses 100%
 * raw milk, flavoured products (Chocolate, Strawberry) use 90% raw milk and
 * 10% premix. Density is 1 kg/L.
 */
export const FLAVOURED = ['Chocolate', 'Strawberry']
export const FLAVOURED_MILK_FRACTION = 0.9

export const isFlavoured = (liquidSkuId: string, catalog?: CatalogData) =>
  FLAVOURED.includes((catalog ? catalog.liquidSkus.find((sku) => sku.skuId === liquidSkuId) : getLiquidSku(liquidSkuId))?.flavour ?? '')

export const milkFraction = (liquidSkuId: string, catalog?: CatalogData) => (isFlavoured(liquidSkuId, catalog) ? FLAVOURED_MILK_FRACTION : 1)

/** Liquid volume of an order: packs × pack size */
export function packsToLiters(finishedSkuId: string, packs: number, catalog?: CatalogData) {
  const { pack } = catalog
    ? (() => {
        const finished = catalog.finishedSkus.find((sku) => sku.finishedSkuId === finishedSkuId)
        return { pack: finished ? catalog.packSizes.find((item) => item.code === finished.packSizeCode) : undefined }
      })()
    : describeFinishedSku(finishedSkuId)
  return pack ? (packs * pack.sizeMl) / 1000 : 0
}

export function milkRequirement(finishedSkuId: string, packs: number, catalog?: CatalogData) {
  const finished = catalog ? catalog.finishedSkus.find((sku) => sku.finishedSkuId === finishedSkuId) : describeFinishedSku(finishedSkuId).finished
  return finished ? packsToLiters(finishedSkuId, packs, catalog) * milkFraction(finished.liquidSkuId, catalog) : 0
}

/** FILLING_SPEED_UNIT: liquid draw L/hour = speed_packph × pack_size_ml / 1000 */
export function liquidDrawLph(finishedSkuId: string, speedPackph: number, catalog?: CatalogData) {
  const pack = catalog
    ? (() => {
        const finished = catalog.finishedSkus.find((sku) => sku.finishedSkuId === finishedSkuId)
        return finished ? catalog.packSizes.find((item) => item.code === finished.packSizeCode) : undefined
      })()
    : describeFinishedSku(finishedSkuId).pack
  return pack ? (speedPackph * pack.sizeMl) / 1000 : 0
}
