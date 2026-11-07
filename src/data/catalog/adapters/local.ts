import type { CatalogData, CatalogSnapshot } from '../types'

export interface LocalCatalogStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function createLocalAdapter(storage: LocalCatalogStorage | undefined, key: string, fallback: CatalogData) {
  return {
    load(): CatalogSnapshot {
      if (!storage) return { data: structuredClone(fallback), version: 0, customized: false }
      try {
        const parsed = JSON.parse(storage.getItem(key) ?? '') as Partial<CatalogSnapshot>
        return {
          data: mergeCatalog(fallback, parsed.data),
          version: typeof parsed.version === 'number' ? parsed.version : 0,
          customized: parsed.customized === true
        }
      } catch {
        return { data: structuredClone(fallback), version: 0, customized: false }
      }
    },
    save(snapshot: CatalogSnapshot) {
      storage?.setItem(key, JSON.stringify(snapshot))
    },
    clear() {
      storage?.removeItem(key)
    }
  }
}

function mergeCatalog(base: CatalogData, candidate: Partial<CatalogData> | undefined): CatalogData {
  const data = structuredClone(base)
  if (!candidate) return data
  for (const key of Object.keys(data) as (keyof CatalogData)[]) {
    if (Array.isArray(candidate[key])) data[key] = candidate[key] as never
  }
  return data
}
