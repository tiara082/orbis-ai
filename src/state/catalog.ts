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
import {
  fetchRemoteCatalog,
  syncCollectionToSupabase,
  seedAllMasterDataToSupabase,
  checkSupabaseHealth,
  type SupabaseHealth
} from '../services/supabaseService'

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

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

export interface Snapshot {
  data: CatalogData
  customized: boolean
  syncStatus: SyncStatus
  syncMessage?: string
}

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
    if (!raw) return { data: cloneOfficial(), customized: false, syncStatus: 'idle' }
    const parsed = JSON.parse(raw) as Partial<Snapshot>
    const base = cloneOfficial()
    const data = { ...base }
    for (const key of Object.keys(base) as CatalogCollection[]) {
      if (Array.isArray(parsed.data?.[key])) data[key] = parsed.data[key] as never
    }
    return { data, customized: parsed.customized === true, syncStatus: 'idle' }
  } catch {
    return { data: cloneOfficial(), customized: false, syncStatus: 'idle' }
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
  
  commit({
    ...snapshot,
    data: { ...snapshot.data, [key]: merged },
    customized: true,
    syncStatus: 'syncing',
    syncMessage: 'Menyimpan ke Supabase...'
  })

  // Asynchronous Supabase write
  syncCollectionToSupabase(key, merged)
    .then((res) => {
      if (res.success) {
        commit({
          ...snapshot,
          syncStatus: 'synced',
          syncMessage: 'Perubahan berhasil disimpan ke Supabase'
        })
      } else {
        commit({
          ...snapshot,
          syncStatus: 'error',
          syncMessage: 'Tersimpan lokal; Supabase belum disinkronkan'
        })
      }
    })
    .catch(() => {
      commit({
        ...snapshot,
        syncStatus: 'error',
        syncMessage: 'Gagal mengirim ke Supabase'
      })
    })

  return { added, updated }
}

export function resetCatalog() {
  commit({ data: cloneOfficial(), customized: false, syncStatus: 'idle' })
}

export async function pushAllToSupabase() {
  commit({ ...snapshot, syncStatus: 'syncing', syncMessage: 'Mengunggah semua Master Data ke Supabase...' })
  try {
    await seedAllMasterDataToSupabase()
    commit({ ...snapshot, syncStatus: 'synced', syncMessage: 'Semua 13 Master Data tersinkron ke Supabase' })
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    commit({ ...snapshot, syncStatus: 'error', syncMessage: `Gagal upload ke Supabase: ${msg}` })
    return { success: false, error: msg }
  }
}

/** Check health and attempt to load latest catalog from Supabase on start */
export async function initSupabaseCatalog(): Promise<SupabaseHealth> {
  const health = await checkSupabaseHealth()
  if (health.connected && health.tablesExist) {
    try {
      const remote = await fetchRemoteCatalog()
      if (remote && remote.liquidSkus && remote.liquidSkus.length > 0) {
        commit({
          data: remote,
          customized: true,
          syncStatus: 'synced',
          syncMessage: 'Memuat data dari Supabase'
        })
      }
    } catch (e) {
      console.warn('Could not fetch remote catalog:', e)
    }
  }
  return health
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCatalog() {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot)
}
