import { describeFinishedSku, getLiquidSku } from '../data/reference'

/**
 * Project assumption, not part of the official catalog: Full Cream uses 100%
 * raw milk, flavoured products (Chocolate, Strawberry) use 90% raw milk and
 * 10% premix. Density is 1 kg/L.
 */
export const FLAVOURED = ['Chocolate', 'Strawberry']
export const FLAVOURED_MILK_FRACTION = 0.9

export const isFlavoured = (liquidSkuId: string) => FLAVOURED.includes(getLiquidSku(liquidSkuId)?.flavour ?? '')

export const milkFraction = (liquidSkuId: string) => (isFlavoured(liquidSkuId) ? FLAVOURED_MILK_FRACTION : 1)

/** Liquid volume of an order: packs × pack size */
export function packsToLiters(finishedSkuId: string, packs: number) {
  const { pack } = describeFinishedSku(finishedSkuId)
  return pack ? (packs * pack.sizeMl) / 1000 : 0
}

export function milkRequirement(finishedSkuId: string, packs: number) {
  const { finished } = describeFinishedSku(finishedSkuId)
  return finished ? packsToLiters(finishedSkuId, packs) * milkFraction(finished.liquidSkuId) : 0
}

/** FILLING_SPEED_UNIT: liquid draw L/hour = speed_packph × pack_size_ml / 1000 */
export function liquidDrawLph(finishedSkuId: string, speedPackph: number) {
  const { pack } = describeFinishedSku(finishedSkuId)
  return pack ? (speedPackph * pack.sizeMl) / 1000 : 0
}
