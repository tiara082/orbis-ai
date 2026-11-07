import { describe, expect, it } from 'vitest'
import {
  confirmImport,
  correctImportRow,
  createImportDraft,
  previewImport,
  validateImportMappings,
  type ImportFieldDefinition
} from './import-workflow'

type Product = { id: string; size: number; productName?: string; family?: string; flavour?: string; packSizeCodes?: string[]; marketVariants?: string[] }

type LiquidSku = { skuId: string; productName: string; family: string; flavour: string; packSizeCodes: string[]; marketVariants: string[] }

const fields: ImportFieldDefinition[] = [
  { field: 'id', required: true },
  { field: 'size', required: true, kind: 'number' }
]

const parse = (row: Readonly<Record<string, string>>): Product => ({ id: row.id, size: Number(row.size) })
const liquidFields: ImportFieldDefinition[] = [
  { field: 'sku_id', required: true },
  { field: 'product_name', required: true },
  { field: 'product_family', required: true },
  { field: 'flavour', required: true },
  { field: 'allowed_pack_size_codes', required: true },
  { field: 'market_variants', required: true }
]
const parseLiquid = (row: Readonly<Record<string, string>>): LiquidSku => ({
  skuId: row.sku_id,
  productName: row.product_name,
  family: row.product_family,
  flavour: row.flavour,
  packSizeCodes: row.allowed_pack_size_codes.split(';').filter(Boolean),
  marketVariants: row.market_variants.split(';').filter(Boolean)
})
const liquidDraft = (rows: readonly Readonly<Record<string, string>>[]) => createImportDraft({
  sourceFile: { name: 'liquid.csv', type: 'text/csv', size: 12 },
  target: 'liquidSkus',
  mappings: liquidFields.map((field) => ({ sourceColumn: field.field, targetField: field.field })),
  rows
})
const liquidOptions = { fields: liquidFields, parse: parseLiquid, duplicateKey: (row: LiquidSku) => row.skuId }
const draft = (rows: readonly Readonly<Record<string, string>>[]) => createImportDraft({
  sourceFile: { name: 'products.csv', type: 'text/csv', size: 12 },
  target: 'products',
  mappings: [{ sourceColumn: 'sku', targetField: 'id' }, { sourceColumn: 'liters', targetField: 'size' }],
  rows
})
const options = { fields, parse, duplicateKey: (row: Product) => row.id }

it('supports automatic and manual mappings with file provenance', () => {
  const source = [{ sku: 'A', liters: '5' }]
  const automatic = draft(source)
  expect(previewImport(automatic, options).canConfirm).toBe(true)
  const manual = createImportDraft({ ...automatic, mappings: [{ sourceColumn: 'liters', targetField: 'id' }, { sourceColumn: 'sku', targetField: 'size' }] })
  expect(previewImport(manual, options).errors.map((error) => error.code)).toContain('invalid-format')
  expect(automatic.sourceFile).toEqual({ name: 'products.csv', type: 'text/csv', size: 12 })
})

it('does not apply catalog rows before explicit confirmation', () => {
  let applied = 0
  const source = draft([{ sku: 'A', liters: '5' }])
  const preview = previewImport(source, options)
  expect(applied).toBe(0)
  const result = confirmImport(source, preview, { identity: 'import-apply', createdAtLabel: 'demo' })
  if (result.confirmed) applied += result.rows.length
  expect(applied).toBe(1)
})


describe('Liquid SKU identifier extraction', () => {
  const row = (skuId: string, overrides: Partial<Record<string, string>> = {}) => ({ sku_id: skuId, product_name: 'Shared Milk', product_family: 'ESL', flavour: 'Vanilla', allowed_pack_size_codes: 'TEST_250;LARGE_B', market_variants: 'TEST_LOCAL', ...overrides })

  it('accepts one unique Liquid SKU and two different identifiers', () => {
    const result = previewImport(liquidDraft([row('LIQ-A'), row('LIQ-B')]), liquidOptions)
    expect(result.validRows).toHaveLength(2)
    expect(result.errors).toEqual([])
    expect(result.canConfirm).toBe(true)
  })

  it('rejects only the second row when Liquid SKU identifiers match', () => {
    const result = previewImport(liquidDraft([row('LIQ-A'), row('LIQ-A')]), liquidOptions)
    expect(result.validRows).toHaveLength(1)
    expect(result.errors).toEqual([{ row: 3, code: 'duplicate', message: 'Duplicate identifier: LIQ-A' }])
  })

  it('allows equal non-identifier fields when skuIds differ', () => {
    const result = previewImport(liquidDraft([row('LIQ-A'), row('LIQ-B')]), liquidOptions)
    expect(result.validRows.map((item) => item.productName)).toEqual(['Shared Milk', 'Shared Milk'])
    expect(result.validRows.every((item) => item.family === 'ESL' && item.flavour === 'Vanilla')).toBe(true)
  })

  it('reports an empty identifier as required rather than duplicate', () => {
    const result = previewImport(liquidDraft([row(''), row('LIQ-B')]), liquidOptions)
    expect(result.errors[0]).toMatchObject({ row: 2, field: 'sku_id', code: 'required' })
    expect(result.errors.some((error) => error.code === 'duplicate')).toBe(false)
  })
})

describe('import validation workflow', () => {
  it('rejects duplicate source mappings and accepts a resolved mapping', () => {
    const duplicate = [{ sourceColumn: 'product_code', targetField: 'id' }, { sourceColumn: 'product_code', targetField: 'size' }] as const
    expect(validateImportMappings(duplicate)).toEqual([{ row: 0, field: 'size', code: 'duplicate-mapping', message: 'Source column "product_code" is already mapped to id' }])
    expect(validateImportMappings([{ sourceColumn: 'product_code', targetField: 'id' }, { sourceColumn: 'product_name', targetField: 'size' }])).toEqual([])
    const blocked = previewImport(createImportDraft({ ...draft([{ sku: 'A', liters: '5' }]), mappings: duplicate }), options)
    expect(blocked.canConfirm).toBe(false)
  })

  it('revalidates after changing the duplicate mapping', () => {
    const corrected = createImportDraft({ ...draft([{ sku: 'A', liters: '5' }]), mappings: [{ sourceColumn: 'sku', targetField: 'id' }, { sourceColumn: 'liters', targetField: 'size' }] })
    expect(previewImport(corrected, options).canConfirm).toBe(true)
  })

  it('preserves required mapping and correction behavior', () => {
    const missing = createImportDraft({ ...draft([]), mappings: [{ sourceColumn: 'sku', targetField: 'id' }] })
    expect(previewImport(missing, options).errors[0].code).toBe('missing-mapping')
    const corrected = correctImportRow(draft([{ sku: 'A', liters: 'bad' }]), 2, { liters: '5' })
    expect(previewImport(corrected, options).canConfirm).toBe(true)
  })

  it('keeps metadata through confirmation', () => {
    const source = draft([{ sku: 'A', liters: '5' }])
    const result = confirmImport(source, previewImport(source, options), { identity: 'mapping-1', createdAtLabel: 'demo' })
    expect(result.sourceFile).toEqual(source.sourceFile)
    expect(result.mappings).toEqual(source.mappings)
  })

  it('does not imply catalog apply before confirmation', () => {
    let applied = false
    const source = draft([{ sku: 'A', liters: '5' }])
    expect(applied).toBe(false)
    const result = confirmImport(source, previewImport(source, options), { identity: 'apply-1', createdAtLabel: 'demo' })
    applied = result.confirmed
    expect(applied).toBe(true)
  })
})

describe('legacy import validation workflow', () => {
  it('maps and validates rows, including missing mapping, required, format, and duplicates', () => {
    expect(previewImport(createImportDraft({ ...draft([]), mappings: [{ sourceColumn: 'sku', targetField: 'id' }], rows: [] }), options).errors[0].code).toBe('missing-mapping')
    const result = previewImport(draft([{ sku: 'A', liters: 'bad' }, { sku: '', liters: '2' }, { sku: 'A', liters: '3' }, { sku: 'A', liters: '4' }]), options)
    expect(result.totalRows).toBe(4)
    expect(result.validRows).toEqual([{ id: 'A', size: 3 }])
    expect(result.errors.map((error) => error.code)).toEqual(['invalid-format', 'required', 'duplicate'])
    expect(result.canConfirm).toBe(false)
  })

  it('supports correction and revalidation', () => {
    const invalid = draft([{ sku: 'A', liters: 'bad' }])
    expect(previewImport(invalid, options).canConfirm).toBe(false)
    const corrected = correctImportRow(invalid, 2, { liters: '5' })
    expect(previewImport(corrected, options)).toMatchObject({ totalRows: 1, validRows: [{ id: 'A', size: 5 }], errors: [], canConfirm: true })
  })

  it('requires explicit confirmation and freezes a defensive result', () => {
    const sourceRows = [{ sku: 'A', liters: '5' }]
    const sourceMappings = [{ sourceColumn: 'sku', targetField: 'id' }, { sourceColumn: 'liters', targetField: 'size' }]
    const sourceDraft = draft(sourceRows)
    const preview = previewImport(sourceDraft, options)
    expect(() => confirmImport(sourceDraft, { ...preview, canConfirm: false }, { identity: 'import-1', createdAtLabel: 'demo' })).toThrow()
    const result = confirmImport(sourceDraft, preview, { identity: 'import-1', createdAtLabel: 'demo' })
    sourceRows[0].liters = '999'
    sourceMappings[0].sourceColumn = 'changed'
    expect(result.rows).toEqual([{ id: 'A', size: 5 }])
    expect(Object.isFrozen(result)).toBe(true)
    expect(Object.isFrozen(result.rows)).toBe(true)
    expect(result.identity).toBe('import-1')
  })
})
