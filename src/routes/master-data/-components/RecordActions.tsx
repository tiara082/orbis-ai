import { useRef, useState } from 'react'
import { Download, FileSpreadsheet, Plus } from 'lucide-react'
import { DetailDrawer } from '../../../components/common/DetailDrawer'
import { Modal } from '../../../components/common/Modal'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { confirmImport, correctImportRow, createImportDraft, previewImport, validateImportMappings, type ImportFieldDefinition, type ImportMapping, type ImportPreview } from '../../../data/import-workflow'
import { useTranslation } from '../../../lib/i18n'
import { downloadTemplate, headerKey, readSheet } from './sheets'

export interface ImportField { header: string; label: string; required?: boolean; kind?: 'text' | 'number' | 'select'; options?: { value: string; label: string }[]; placeholder?: string }
export type RowError = { error: 'required' | 'number'; field: string }
interface RecordActionsProps<T> { title: string; fileName: string; fields: ImportField[]; parse: (record: Record<string, string>) => T | RowError; duplicateKey: (row: T) => string; onApply: (rows: T[]) => { added: number; updated: number; rejected?: number; warnings?: unknown[]; dependencyErrors?: unknown[] } }
const inputClass = 'mt-1 w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'
const isError = <T,>(value: T | RowError): value is RowError => typeof value === 'object' && value !== null && 'error' in value

export function RecordActions<T>({ title, fileName, fields, parse, duplicateKey, onApply }: RecordActionsProps<T>) {
  const { t } = useTranslation(); const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false); const [draft, setDraft] = useState<Record<string, string>>({}); const [formError, setFormError] = useState(''); const [notice, setNotice] = useState('')
  const [importPreview, setImportPreview] = useState<ImportPreview<T> | null>(null); const [importDraft, setImportDraft] = useState<ReturnType<typeof createImportDraft> | null>(null)
  const [sourceColumns, setSourceColumns] = useState<string[]>([]); const [mapping, setMapping] = useState<ImportMapping[]>([]); const [correctionRow, setCorrectionRow] = useState<number | null>(null); const [correctionValues, setCorrectionValues] = useState<Record<string, string>>({})
  const blank = () => Object.fromEntries(fields.map((field) => [field.header, field.options?.[0]?.value ?? '']))
  const fieldDefinitions: ImportFieldDefinition[] = fields.map((field) => ({ field: field.header, required: field.required, kind: field.kind === 'number' ? 'number' : 'text' }))

  const buildPreview = (nextDraft: ReturnType<typeof createImportDraft>) => {
    const nextPreview = previewImport<T>(nextDraft, { fields: fieldDefinitions, parse: (record) => parse(record as Record<string, string>), duplicateKey })
    setImportDraft(nextDraft); setImportPreview(nextPreview)
  }
  const updateMapping = (nextMapping: ImportMapping[]) => {
    if (!importDraft) return
    const mappingErrors = validateImportMappings(nextMapping)
    setMapping(nextMapping)
    buildPreview(createImportDraft({ ...importDraft, mappings: nextMapping }))
    if (mappingErrors.length > 0) setNotice(mappingErrors.map((error) => t('master.edit.duplicateMapping', { column: nextMapping.find((item) => item.targetField === error.field)?.sourceColumn ?? '', target: error.message })).join(' '))
    else setNotice('')
  }
  const onFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const table = await readSheet(file); const columns = Object.keys(table[0] ?? []);    const normalized = new Map(columns.map((column) => [headerKey(column), column]))
    const usedColumns = new Set<string>()
    const initialMapping = fields.flatMap((field) => {
      const sourceColumn = normalized.get(headerKey(field.header))
      if (!sourceColumn || usedColumns.has(sourceColumn)) return []
      usedColumns.add(sourceColumn)
      return [{ sourceColumn, targetField: field.header }]
    })
      const nextDraft = createImportDraft({ sourceFile: { name: file.name, type: file.type || (file.name.toLowerCase().endsWith('.csv') ? 'text/csv' : 'application/octet-stream'), size: file.size }, target: fileName, mappings: initialMapping, rows: table })
      setSourceColumns(columns); setMapping(initialMapping); setCorrectionRow(null); buildPreview(nextDraft)
    } catch { setNotice(t('master.edit.unreadable')) }
  }
  const confirmParsed = () => {
    if (!importDraft || !importPreview?.canConfirm) return
    try { const result = confirmImport(importDraft, importPreview, { identity: `${fileName}-confirmed`, createdAtLabel: 'in-memory confirmation' }); const applied = onApply([...result.rows]); const rejected = applied.rejected ?? 0; const dependencyErrors = applied.dependencyErrors ?? []; const expectedApplied = applied.added + applied.updated; if (rejected === 0 && dependencyErrors.length === 0 && expectedApplied === result.rows.length) { setNotice(t('master.edit.result', { added: applied.added, updated: applied.updated, skipped: rejected })); setImportDraft(null); setImportPreview(null); setMapping([]) } else setNotice(`${t('master.edit.importBlocked')}${dependencyErrors.length > 0 ? ` ${dependencyErrors.map((error) => String((error as { message?: string }).message ?? error)).join(' ')}` : ''}`) } catch { setNotice(t('master.edit.importBlocked')) }
  }
  const saveCorrection = () => { if (!importDraft || correctionRow === null) return; buildPreview(correctImportRow(importDraft, correctionRow, correctionValues)); setCorrectionRow(null); setCorrectionValues({}) }
  const submitForm = () => { const record = Object.fromEntries(fields.map((field) => [field.header, (draft[field.header] ?? '').trim()])); const parsed = parse(record); if (isError(parsed)) { setFormError(t(parsed.error === 'number' ? 'master.edit.notNumber' : 'master.edit.required', { row: 1, field: parsed.field })); return }; const result = onApply([parsed]); setNotice(t('master.edit.result', { added: result.added, updated: result.updated, skipped: 0 })); setOpen(false) }

  return <>
    <Button size="sm" variant="outline" icon={Plus} onClick={() => { setDraft(blank()); setFormError(''); setOpen(true) }}>{t('master.edit.add')}</Button>
    <Button size="sm" variant="outline" icon={FileSpreadsheet} onClick={() => fileRef.current?.click()}>{t('master.edit.upload')}</Button>
    <Button size="sm" variant="ghost" icon={Download} onClick={() => void downloadTemplate(fileName, fields.map((field) => field.header))}>{t('master.edit.template')}</Button>
    <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" aria-label={t('master.edit.uploadFile')} className="hidden" onChange={(event) => { void onFile(event.target.files?.[0]); event.target.value = '' }} />
    {notice && <span className="text-xs text-ink max-w-md">{notice}</span>}
    {importPreview && importDraft && <DetailDrawer open onClose={() => { setImportPreview(null); setImportDraft(null); setMapping([]) }} eyebrow={t('master.edit.previewEyebrow')} title={title} description={`${t('master.edit.previewHint')} · ${importDraft.sourceFile.name} · ${importDraft.sourceFile.size} bytes`}>
      <div className="space-y-3 text-xs"><p>{t('master.edit.previewSummary', { total: importPreview.totalRows, valid: importPreview.validRows.length, invalid: importPreview.errors.length })}</p>
        <div className="rounded-lg border border-gray-200 p-2 space-y-2"><p className="font-semibold text-ink-strong">{t('master.edit.mapping')}</p>{fields.map((field) => { const selected = mapping.find((item) => item.targetField === field.header)?.sourceColumn ?? ''; return <label key={field.header} className="flex items-center gap-2"><span className="w-32 text-ink-strong">{field.label}{field.required && ' *'}</span><Select size="sm" className="flex-1" value={selected} options={[{ value: '', label: t('master.edit.unmapped') }, ...sourceColumns.map((column) => ({ value: column, label: column }))]} onChange={(value) => updateMapping([...mapping.filter((item) => item.targetField !== field.header), ...(value ? [{ sourceColumn: value, targetField: field.header }] : [])])} /></label> })}</div>
        {importPreview.errors.length > 0 && <div className="space-y-1 text-danger"><p className="font-semibold">{t('master.edit.errors')}</p>{importPreview.errors.map((error, index) => <div key={`${error.row}-${error.field}-${index}`} className="flex items-center justify-between gap-2"><span>Row {error.row}{error.field ? ` · ${error.field}` : ''}: {error.message}</span>{error.row > 1 && <Button size="sm" variant="ghost" onClick={() => { setCorrectionRow(error.row); setCorrectionValues(importDraft.rows[error.row - 2] ? { ...importDraft.rows[error.row - 2] } : {}) }}>{t('master.edit.correct')}</Button>}</div>)}</div>}
        {correctionRow !== null && <div className="rounded-lg border border-brand-subtle bg-brand-muted p-2 space-y-2"><p className="font-semibold text-ink-strong">{t('master.edit.correctRow', { row: correctionRow })}</p>{sourceColumns.map((column) => <label key={column} className="block"><span className="font-mono text-[10px] text-ink">{column}</span><input className={inputClass} value={correctionValues[column] ?? ''} onChange={(event) => setCorrectionValues((current) => ({ ...current, [column]: event.target.value }))} /></label>)}<Button size="sm" onClick={saveCorrection}>{t('master.edit.revalidate')}</Button></div>}
        {importPreview.validRows.length > 0 && <div className="max-h-40 overflow-auto rounded-lg bg-gray-50 p-2 font-mono text-[11px]">{importPreview.validRows.map((row, index) => <pre key={index}>{JSON.stringify(row)}</pre>)}</div>}
        <div className="flex gap-2"><Button disabled={!importPreview.canConfirm} onClick={confirmParsed}>{t('master.edit.confirmImport')}</Button><Button variant="outline" onClick={() => { setImportPreview(null); setImportDraft(null); setMapping([]) }}>{t('common.close')}</Button></div>
      </div>
    </DetailDrawer>}
    <Modal open={open} onClose={() => setOpen(false)} eyebrow={t('master.edit.formEyebrow')} title={title} description={t('master.edit.formHint')}><form className="space-y-3" onSubmit={(event) => { event.preventDefault(); submitForm() }}>{fields.map((field) => <label key={field.header} className="block"><span className="text-xs font-medium text-ink-strong">{field.label}{field.required && <span className="text-danger"> *</span>}</span><span className="ml-2 font-mono text-[10px] text-ink">{field.header}</span>{field.kind === 'select' && field.options ? <Select className="mt-1" size="md" value={draft[field.header] ?? ''} options={field.options} onChange={(value) => setDraft((current) => ({ ...current, [field.header]: value }))} /> : <input className={inputClass} type={field.kind === 'number' ? 'number' : 'text'} step="any" required={field.required} placeholder={field.placeholder} value={draft[field.header] ?? ''} onChange={(event) => setDraft((current) => ({ ...current, [field.header]: event.target.value }))} />}</label>)}{formError && <p className="text-xs text-danger">{formError}</p>}<div className="flex gap-2 pt-2"><Button type="submit">{t('master.edit.save')}</Button><Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('common.close')}</Button></div></form></Modal>
  </>
}
