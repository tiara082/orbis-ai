import { useSyncExternalStore } from 'react'
import { catalogRepository } from '../data/catalog/repository'
import type { CatalogCollection, CatalogData } from '../data/catalog/types'

export type { CatalogCollection, CatalogData } from '../data/catalog/types'

export function upsertCatalog<K extends CatalogCollection>(
  key: K,
  rows: CatalogData[K],
  rowKey: (row: CatalogData[K][number]) => string
) {
  return catalogRepository.upsert(key, rows, rowKey)
}

export function resetCatalog() {
  catalogRepository.reset()
}

export function useCatalog() {
  return useSyncExternalStore(catalogRepository.subscribe, catalogRepository.getSnapshot, catalogRepository.getSnapshot)
}
