export type ImportFieldKind = 'text' | 'number'

export interface ImportFieldDefinition {
  readonly field: string
  readonly required?: boolean
  readonly kind?: ImportFieldKind
  readonly validate?: (value: string, row: Readonly<Record<string, string>>) => string | undefined
}

export interface ImportRowError {
  readonly row: number
  readonly field?: string
  readonly code: 'missing-mapping' | 'duplicate-mapping' | 'required' | 'invalid-format' | 'invalid-reference' | 'duplicate'
  readonly message: string
}

export function validateImportMappings(mappings: readonly ImportMapping[]): ImportRowError[] {
  const seen = new Map<string, string>()
  const errors: ImportRowError[] = []
  for (const mapping of mappings) {
    const previousTarget = seen.get(mapping.sourceColumn)
    if (previousTarget) {
      errors.push({ row: 0, field: mapping.targetField, code: 'duplicate-mapping', message: `Source column "${mapping.sourceColumn}" is already mapped to ${previousTarget}` })
    } else {
      seen.set(mapping.sourceColumn, mapping.targetField)
    }
  }
  return errors
}

export interface ImportMapping {
  readonly sourceColumn: string
  readonly targetField: string
}

export interface ImportDraft {
  readonly sourceFile: { readonly name: string; readonly type: string; readonly size: number }
  readonly target: string
  readonly mappings: readonly ImportMapping[]
  readonly rows: readonly Readonly<Record<string, string>>[]
}

export interface ImportPreview<T> {
  readonly totalRows: number
  readonly validRows: readonly T[]
  readonly errors: readonly ImportRowError[]
  readonly canConfirm: boolean
}

export interface ImportResult<T> {
  readonly identity: string
  readonly target: string
  readonly sourceFile: ImportDraft['sourceFile']
  readonly mappings: readonly ImportMapping[]
  readonly rows: readonly T[]
  readonly confirmed: true
  readonly createdAtLabel: string
}

export type ImportValidationOptions<T> = {
  readonly fields: readonly ImportFieldDefinition[]
  readonly parse: (row: Readonly<Record<string, string>>) => T | { readonly error: 'required' | 'number'; readonly field: string }
  readonly referenceErrors?: (row: Readonly<Record<string, string>>, rowNumber: number) => readonly ImportRowError[]
  readonly duplicateKey?: (value: T) => string
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function freeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as Record<string, unknown>)) freeze(child)
  }
  return value
}

export function createImportDraft(input: {
  sourceFile: ImportDraft['sourceFile']
  target: string
  mappings: readonly ImportMapping[]
  rows: readonly Readonly<Record<string, string>>[]
}): ImportDraft {
  return freeze(clone(input))
}

export function mapImportRows(draft: ImportDraft, fields: readonly ImportFieldDefinition[]): { rows: Record<string, string>[]; errors: ImportRowError[] } {
  const mapped = new Map(draft.mappings.map((mapping) => [mapping.targetField, mapping.sourceColumn]))
  const errors = [
    ...validateImportMappings(draft.mappings),
    ...fields.filter((field) => field.required && !mapped.has(field.field)).map((field) => ({
      row: 0,
      field: field.field,
      code: 'missing-mapping' as const,
      message: `Required field is not mapped: ${field.field}`
    }))
  ]
  const rows = draft.rows.map((row) => Object.fromEntries(fields.map((field) => [field.field, row[mapped.get(field.field) ?? '']?.trim() ?? ''])))
  return { rows, errors }
}

export function previewImport<T>(draft: ImportDraft, options: ImportValidationOptions<T>): ImportPreview<T> {
  const mapped = mapImportRows(draft, options.fields)
  const errors = [...mapped.errors]
  const validRows: T[] = []
  const seen = new Set<string>()
  mapped.rows.forEach((row, index) => {
    const rowNumber = index + 2
    let rowHasError = false
    for (const field of options.fields) {
      const value = row[field.field] ?? ''
      if (field.required && !value) {
        errors.push({ row: rowNumber, field: field.field, code: 'required', message: `Required field is empty: ${field.field}` })
        rowHasError = true
      } else if (value && field.kind === 'number' && !Number.isFinite(Number(value))) {
        errors.push({ row: rowNumber, field: field.field, code: 'invalid-format', message: `Invalid number: ${field.field}` })
        rowHasError = true
      } else if (value && field.validate) {
        const message = field.validate(value, row)
        if (message) {
          errors.push({ row: rowNumber, field: field.field, code: 'invalid-reference', message })
          rowHasError = true
        }
      }
    }
    for (const error of options.referenceErrors?.(row, rowNumber) ?? []) {
      errors.push(error)
      rowHasError = true
    }
    if (rowHasError) return
    const parsed = options.parse(row)
    if (typeof parsed === 'object' && parsed !== null && 'error' in parsed) {
      errors.push({ row: rowNumber, field: parsed.field, code: parsed.error === 'number' ? 'invalid-format' : 'required', message: `${parsed.error}: ${parsed.field}` })
      return
    }
    const key = options.duplicateKey?.(parsed)
    if (key !== undefined && seen.has(key)) {
      errors.push({ row: rowNumber, code: 'duplicate', message: `Duplicate identifier: ${key}` })
      return
    }
    if (key !== undefined) seen.add(key)
    validRows.push(parsed)
  })
  return freeze({ totalRows: draft.rows.length, validRows: clone(validRows), errors: clone(errors), canConfirm: errors.length === 0 && validRows.length > 0 })
}

export function correctImportRow(draft: ImportDraft, rowNumber: number, values: Record<string, string>): ImportDraft {
  const index = rowNumber - 2
  if (index < 0 || index >= draft.rows.length) return draft
  const rows = draft.rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...values } : { ...row })
  return createImportDraft({ ...draft, rows })
}

export function confirmImport<T>(draft: ImportDraft, preview: ImportPreview<T>, input: { identity: string; createdAtLabel: string }): ImportResult<T> {
  if (!preview.canConfirm) throw new Error('Import has blocking validation errors')
  return freeze(clone({
    identity: input.identity,
    target: draft.target,
    sourceFile: draft.sourceFile,
    mappings: draft.mappings,
    rows: preview.validRows,
    confirmed: true as const,
    createdAtLabel: input.createdAtLabel
  }))
}
