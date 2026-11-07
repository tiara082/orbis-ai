import type { CatalogData, CatalogIssue, CatalogValidationResult } from './types'

const issue = (message: string, category?: CatalogIssue['category'], recordId?: string, field?: string): CatalogIssue => ({
  message,
  category,
  recordId,
  field
})

function ids<T>(rows: T[], key: (row: T) => string) {
  return new Set(rows.map(key))
}

export function validateCatalog(data: CatalogData): CatalogValidationResult {
  const errors: CatalogIssue[] = []
  const warnings: CatalogIssue[] = []
  const liquidIds = ids(data.liquidSkus, (row) => row.skuId)
  const finishedIds = ids(data.finishedSkus, (row) => row.finishedSkuId)
  const packIds = ids(data.packSizes, (row) => row.code)
  const marketIds = ids(data.markets, (row) => row.code)
  const assetIds = ids(data.assets, (row) => row.id)
  const lineIds = new Set(data.assets.filter((row) => row.type === 'Filling Line').map((row) => row.id))
  const reportDuplicates = <T>(rows: T[], key: (row: T) => string, category: CatalogIssue['category']) => {
    const seen = new Set<string>()
    for (const row of rows) {
      const id = key(row)
      if (seen.has(id)) errors.push(issue(`Duplicate identifier: ${id}`, category, id))
      seen.add(id)
    }
  }

  reportDuplicates(data.liquidSkus, (row) => row.skuId, 'liquidSkus')
  reportDuplicates(data.finishedSkus, (row) => row.finishedSkuId, 'finishedSkus')
  reportDuplicates(data.packSizes, (row) => row.code, 'packSizes')
  reportDuplicates(data.markets, (row) => row.code, 'markets')
  reportDuplicates(data.assets, (row) => row.id, 'assets')
  reportDuplicates(data.connections, (row) => row.id, 'connections')

  for (const row of data.finishedSkus) {
    if (!liquidIds.has(row.liquidSkuId)) errors.push(issue(`Unknown liquid SKU: ${row.liquidSkuId}`, 'finishedSkus', row.finishedSkuId, 'liquidSkuId'))
    if (!packIds.has(row.packSizeCode)) errors.push(issue(`Unknown pack size: ${row.packSizeCode}`, 'finishedSkus', row.finishedSkuId, 'packSizeCode'))
    if (!marketIds.has(row.marketVariant)) errors.push(issue(`Unknown market variant: ${row.marketVariant}`, 'finishedSkus', row.finishedSkuId, 'marketVariant'))
  }
  for (const row of data.liquidSkus) {
    for (const market of row.marketVariants) if (!marketIds.has(market)) errors.push(issue(`Unknown market variant: ${market}`, 'liquidSkus', row.skuId, 'marketVariants'))
    for (const pack of row.packSizeCodes) if (!packIds.has(pack)) errors.push(issue(`Unknown pack size: ${pack}`, 'liquidSkus', row.skuId, 'packSizeCodes'))
  }
  for (const row of data.connections) {
    if (!assetIds.has(row.source)) errors.push(issue(`Unknown connection source: ${row.source}`, 'connections', row.id, 'source'))
    if (!assetIds.has(row.destination)) errors.push(issue(`Unknown connection destination: ${row.destination}`, 'connections', row.id, 'destination'))
    if (row.via && !assetIds.has(row.via)) errors.push(issue(`Unknown connection via asset: ${row.via}`, 'connections', row.id, 'via'))
  }
  for (const row of data.lineDedication) {
    if (!lineIds.has(row.lineId)) errors.push(issue(`Unknown line: ${row.lineId}`, 'lineDedication', row.lineId, 'lineId'))
    if (!assetIds.has(row.sourceAsepticTankId)) errors.push(issue(`Unknown source tank: ${row.sourceAsepticTankId}`, 'lineDedication', row.lineId, 'sourceAsepticTankId'))
    for (const sku of row.allowedSkuIds) if (!liquidIds.has(sku)) warnings.push(issue(`Unknown dedicated SKU: ${sku}`, 'lineDedication', row.lineId, 'allowedSkuIds'))
  }
  for (const row of data.lineProducts) {
    if (!lineIds.has(row.lineId)) errors.push(issue(`Unknown line: ${row.lineId}`, 'lineProducts', row.lineId, 'lineId'))
    if (!liquidIds.has(row.skuId)) errors.push(issue(`Unknown liquid SKU: ${row.skuId}`, 'lineProducts', row.lineId, 'skuId'))
    if (!packIds.has(row.packSizeCode)) errors.push(issue(`Unknown pack size: ${row.packSizeCode}`, 'lineProducts', row.lineId, 'packSizeCode'))
  }
  for (const row of data.lineFinished) {
    const finished = data.finishedSkus.find((item) => item.finishedSkuId === row.finishedSkuId)
    if (!lineIds.has(row.lineId)) errors.push(issue(`Unknown line: ${row.lineId}`, 'lineFinished', row.lineId, 'lineId'))
    if (!finishedIds.has(row.finishedSkuId)) errors.push(issue(`Unknown finished SKU: ${row.finishedSkuId}`, 'lineFinished', row.finishedSkuId, 'finishedSkuId'))
    if (!finished) continue
    if (finished.liquidSkuId !== row.liquidSkuId || finished.packSizeCode !== row.packSizeCode || finished.marketVariant !== row.marketVariant) {
      errors.push(issue(`Compatibility does not match finished SKU definition`, 'lineFinished', row.finishedSkuId))
    }
  }
  const assetTypeNames = new Set(data.assets.map((asset) => asset.type))
  for (const row of data.cipRules) {
    for (const asset of row.assetScope) {
      if (!assetIds.has(asset) && !assetTypeNames.has(asset) && !['Aset yang benar-benar dilalui produk terkait', 'Aset yang benar-benar dilalui kedua flavour', 'Mesin dan jalur pada production run/campaign terkait', 'Satu aset', 'SFP Tank'].includes(asset)) {
        errors.push(issue(`Unknown CIP asset: ${asset}`, 'cipRules', row.ruleId, 'assetScope'))
      }
    }
  }
  return { valid: errors.length === 0, errors, warnings }
}
