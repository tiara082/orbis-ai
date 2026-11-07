import { setCatalogOverlay } from '../reference'
import { createCsvCatalog } from './adapters/csv'
import { createLocalAdapter } from './adapters/local'
import { validateCatalog } from './validation'
import type { CatalogCollection, CatalogData, CatalogImportResult, CatalogRepository, CatalogSnapshot } from './types'

const STORAGE_KEY = 'orbis-master-data'
const listeners = new Set<() => void>()
const csvData = createCsvCatalog()
const local = createLocalAdapter(typeof sessionStorage === 'undefined' ? undefined : sessionStorage, STORAGE_KEY, csvData)
let snapshot: CatalogSnapshot = local.load()

function syncReferenceOverlay(data: CatalogData) {
  setCatalogOverlay({
    liquidSkus: data.liquidSkus,
    finishedSkus: data.finishedSkus,
    packSizes: data.packSizes,
    markets: data.markets,
    assets: data.assets,
    connections: data.connections,
    lineDedication: data.lineDedication,
    lineProducts: data.lineProducts,
    lineFinished: data.lineFinished,
    constraints: data.constraints,
    changeovers: data.changeovers,
    cipRules: data.cipRules
  })
}

syncReferenceOverlay(snapshot.data)

function publishSnapshot(next: CatalogSnapshot) {
  snapshot = next
  syncReferenceOverlay(next.data)
  local.save(next)
  listeners.forEach((listener) => listener())
}

export const catalogRepository: CatalogRepository = {
  getSnapshot: () => snapshot,
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getVersion: () => snapshot.version,
  publish(next) {
    const validation = validateCatalog(next)
    if (!validation.valid) return validation
    publishSnapshot({ data: structuredClone(next), version: snapshot.version + 1, customized: true })
    return validation
  },
  reset() {
    local.clear()
    publishSnapshot({ data: createCsvCatalog(), version: snapshot.version + 1, customized: false })
  },
  upsert(key, rows, rowKey) {
    const current = snapshot.data[key] as CatalogData[typeof key][number][]
    const incoming = rows as CatalogData[typeof key][number][]
    const byId = new Map(current.map((row) => [rowKey(row), row]))
    const seen = new Set<string>()
    let added = 0
    let updated = 0
    const warnings = []
    for (const row of incoming) {
      const id = rowKey(row)
      if (seen.has(id)) warnings.push({ category: key, recordId: id, message: `Duplicate identifier in import: ${id}` })
      seen.add(id)
      if (byId.has(id)) updated += 1
      else added += 1
      byId.set(id, row)
    }
    const merged = [...current.map((row) => byId.get(rowKey(row)) as CatalogData[typeof key][number]), ...incoming.filter((row) => !current.some((old) => rowKey(old) === rowKey(row)))]
    const next = { ...snapshot.data, [key]: merged } as CatalogData
    const validation = validateCatalog(next)
    if (!validation.valid || warnings.length > 0) {
      return { category: key, added: 0, updated: 0, rejected: incoming.length, warnings: [...warnings, ...validation.warnings], dependencyErrors: validation.errors }
    }
    publishSnapshot({ data: next, version: snapshot.version + 1, customized: true })
    return { category: key, added, updated, rejected: 0, warnings: [...warnings, ...validation.warnings], dependencyErrors: [] }
  }
}

export const getSnapshot = () => catalogRepository.getSnapshot()
export const subscribe = (listener: () => void) => catalogRepository.subscribe(listener)
export const getVersion = () => catalogRepository.getVersion()
export const publish = (data: CatalogData) => catalogRepository.publish(data)
export const reset = () => catalogRepository.reset()
export const upsert = <K extends CatalogCollection>(key: K, rows: CatalogData[K], rowKey: (row: CatalogData[K][number]) => string): CatalogImportResult<K> => catalogRepository.upsert(key, rows, rowKey)
