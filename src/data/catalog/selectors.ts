import type { CatalogCollection, CatalogData } from './types'
import { getSnapshot } from './repository'

export function getCollection<K extends CatalogCollection>(key: K): CatalogData[K] {
  return getSnapshot().data[key]
}

export const getLiquidSkus = () => getCollection('liquidSkus')
export const getFinishedSkus = () => getCollection('finishedSkus')
export const getPackSizes = () => getCollection('packSizes')
export const getMarketVariants = () => getCollection('markets')
export const getAssets = () => getCollection('assets')
export const getConnections = () => getCollection('connections')
export const getLineDedications = () => getCollection('lineDedication')
export const getLineProductCompatibility = () => getCollection('lineProducts')
export const getLineFinishedSkuCompatibility = () => getCollection('lineFinished')
export const getConstraints = () => getCollection('constraints')
export const getChangeoverRules = () => getCollection('changeovers')
export const getCipRules = () => getCollection('cipRules')

export const getLiquidSku = (id: string) => getLiquidSkus().find((row) => row.skuId === id)
export const getFinishedSku = (id: string) => getFinishedSkus().find((row) => row.finishedSkuId === id)
export const getPackSize = (id: string) => getPackSizes().find((row) => row.code === id)
export const getAsset = (id: string) => getAssets().find((row) => row.id === id)
export const getConnection = (source: string, destination: string) => getConnections().find((row) => row.source === source && row.destination === destination)
