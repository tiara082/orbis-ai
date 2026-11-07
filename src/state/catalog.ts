import { useSyncExternalStore } from 'react'
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
  PACK_SIZES,
  setCatalogOverlay,
  type Asset,
  type ChangeoverRule,
  type CipRule,
  type Connection,
  type ConstraintRule,
  type FinishedSku,
  type LineDedication,
  type LineFinishedSkuCompatibility,
  type LineProductCompatibility,
  type LiquidSku,
  type MarketVariant,
  type PackSize
} from '../data/reference'

export interface CatalogData {
  liquidSkus: LiquidSku[]
  finishedSkus: FinishedSku[]
  packSizes: PackSize[]
  markets: MarketVariant[]
  assets: Asset[]
  connections: Connection[]
  lineDedication: LineDedication[]
  lineProducts: LineProductCompatibility[]
  lineFinished: LineFinishedSkuCompatibility[]
  constraints: ConstraintRule[]
  changeovers: ChangeoverRule[]
  cipRules: CipRule[]
}

export type CatalogCollection = keyof CatalogData

const STORAGE_KEY = 'orbis-master-data'

function official(): CatalogData {
  return {
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
  }
}

function cloneOfficial(): CatalogData {
  return structuredClone(official())
}

interface Snapshot {
  data: CatalogData
  customized: boolean
}

function publish(snapshot: Snapshot) {
  const { data } = snapshot
  setCatalogOverlay(
    snapshot.customized
      ? {
          liquidSkus: data.liquidSkus,
          finishedSkus: data.finishedSkus,
          packSizes: data.packSizes,
          assets: data.assets,
          connections: data.connections,
          lineDedication: data.lineDedication,
          lineProducts: data.lineProducts,
          lineFinished: data.lineFinished
        }
      : {}
  )
}

function load(): Snapshot {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { data: cloneOfficial(), customized: false }
    const parsed = JSON.parse(raw) as Snapshot
    const base = cloneOfficial()
    const data = { ...base }
    for (const key of Object.keys(base) as CatalogCollection[]) {
      if (Array.isArray(parsed.data?.[key])) data[key] = parsed.data[key] as never
    }
    return { data, customized: parsed.customized === true }
  } catch {
    return { data: cloneOfficial(), customized: false }
  }
}

let snapshot: Snapshot = load()
publish(snapshot)

const listeners = new Set<() => void>()

function commit(next: Snapshot) {
  snapshot = next
  publish(next)
  if (next.customized) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  else sessionStorage.removeItem(STORAGE_KEY)
  listeners.forEach((listener) => listener())
}

export function upsertCatalog<K extends CatalogCollection>(
  key: K,
  rows: CatalogData[K],
  rowKey: (row: CatalogData[K][number]) => string
) {
  const current = snapshot.data[key] as CatalogData[K][number][]
  const incoming = rows as CatalogData[K][number][]
  const byId = new Map(current.map((row) => [rowKey(row), row]))
  let added = 0
  let updated = 0
  const fresh: CatalogData[K][number][] = []
  for (const row of incoming) {
    const id = rowKey(row)
    if (byId.has(id)) updated += 1
    else {
      added += 1
      fresh.push(row)
    }
    byId.set(id, row)
  }
  const merged = [...current.map((row) => byId.get(rowKey(row)) as CatalogData[K][number]), ...fresh]
  commit({ data: { ...snapshot.data, [key]: merged }, customized: true })
  return { added, updated }
}

export function resetCatalog() {
  commit({ data: cloneOfficial(), customized: false })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCatalog() {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot)
}
