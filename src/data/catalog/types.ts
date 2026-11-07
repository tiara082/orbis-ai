import type {
  Asset,
  ChangeoverRule,
  CipRule,
  Connection,
  ConstraintRule,
  FinishedSku,
  LineDedication,
  LineFinishedSkuCompatibility,
  LineProductCompatibility,
  LiquidSku,
  MarketVariant,
  PackSize
} from '../reference'

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
export type CatalogKey = CatalogCollection

export interface CatalogIssue {
  category?: CatalogCollection
  recordId?: string
  field?: string
  message: string
}

export interface CatalogValidationResult {
  valid: boolean
  errors: CatalogIssue[]
  warnings: CatalogIssue[]
}

export interface CatalogImportResult<K extends CatalogCollection = CatalogCollection> {
  category: K
  added: number
  updated: number
  rejected: number
  warnings: CatalogIssue[]
  dependencyErrors: CatalogIssue[]
}

export interface CatalogSnapshot {
  data: CatalogData
  version: number
  customized: boolean
}

export interface CatalogRepository {
  getSnapshot(): CatalogSnapshot
  subscribe(listener: () => void): () => void
  getVersion(): number
  publish(next: CatalogData): CatalogValidationResult
  reset(): void
  upsert<K extends CatalogCollection>(key: K, rows: CatalogData[K], rowKey: (row: CatalogData[K][number]) => string): CatalogImportResult<K>
}
