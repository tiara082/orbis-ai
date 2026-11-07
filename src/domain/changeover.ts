import { getFinishedSku, getLiquidSku } from '../data/reference'

export type ChangeoverActivity = 'VARIANT' | 'SIZE' | 'PAPER' | 'NONE'

/**
 * CHANGEOVER_PRECEDENCE: a flavour change overrides size and paper; the same
 * flavour with a different size is a size change even if the market changes;
 * only a market change is a paper change. CIP is evaluated separately.
 */
export function classifyChangeover(prevFinishedSkuId: string, nextFinishedSkuId: string): ChangeoverActivity {
  const prev = getFinishedSku(prevFinishedSkuId)
  const next = getFinishedSku(nextFinishedSkuId)
  if (!prev || !next) return 'NONE'
  const prevFlavour = getLiquidSku(prev.liquidSkuId)?.flavour
  const nextFlavour = getLiquidSku(next.liquidSkuId)?.flavour
  if (prevFlavour !== nextFlavour) return 'VARIANT'
  if (prev.packSizeCode !== next.packSizeCode) return 'SIZE'
  if (prev.marketVariant !== next.marketVariant) return 'PAPER'
  return 'NONE'
}

export type FlavourCipRule = 'CIP_FLAVOUR' | 'CIP_CH_ST'

/** CIP triggers from cip_rules.csv that depend on the flavour sequence */
export function flavourCipTrigger(prevLiquidSkuId: string, nextLiquidSkuId: string): FlavourCipRule | undefined {
  const prev = getLiquidSku(prevLiquidSkuId)?.flavour
  const next = getLiquidSku(nextLiquidSkuId)?.flavour
  if ((prev === 'Chocolate' || prev === 'Strawberry') && next === 'Full Cream') return 'CIP_FLAVOUR'
  if ((prev === 'Chocolate' && next === 'Strawberry') || (prev === 'Strawberry' && next === 'Chocolate')) return 'CIP_CH_ST'
  return undefined
}
