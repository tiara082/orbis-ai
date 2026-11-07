import { useRef, useState } from 'react'
import { Download, FileSpreadsheet, Plus } from 'lucide-react'
import { DetailDrawer } from '../../../components/common/DetailDrawer'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { useTranslation } from '../../../lib/i18n'
import { downloadTemplate, headerKey, readSheet } from './sheets'

export interface ImportField {
  /** Column name in the Excel template and the official CSV */
  header: string
  label: string
  required?: boolean
  kind?: 'text' | 'number' | 'select'
  options?: { value: string; label: string }[]
  placeholder?: string
}

export type RowError = { error: 'required' | 'number'; field: string }

interface RecordActionsProps<T> {
  title: string
  fileName: string
  fields: ImportField[]
  parse: (record: Record<string, string>) => T | RowError
  onApply: (rows: T[]) => { added: number; updated: number }
}

const inputClass =
  'mt-1 w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

function isError<T>(value: T | RowError): value is RowError {
  return typeof value === 'object' && value !== null && 'error' in value
}

export function RecordActions<T>({ title, fileName, fields, parse, onApply }: RecordActionsProps<T>) {
  const { t } = useTranslation()
  const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')

  const blank = () => Object.fromEntries(fields.map((field) => [field.header, field.options?.[0]?.value ?? '']))

  const applyParsed = (records: Record<string, string>[], rowOffset: number) => {
    const rows: T[] = []
    const problems: string[] = []
    records.forEach((record, index) => {
      if (Object.values(record).every((value) => value.trim() === '')) return
      const parsed = parse(record)
      if (isError(parsed)) {
        if (problems.length < 4) {
          problems.push(
            t(parsed.error === 'number' ? 'master.edit.notNumber' : 'master.edit.required', {
              row: rowOffset + index,
              field: parsed.field
            })
          )
        }
        return
      }
      rows.push(parsed)
    })
    if (rows.length === 0 && problems.length === 0) {
      setNotice(t('master.edit.noRows'))
      return
    }
    const result = rows.length > 0 ? onApply(rows) : { added: 0, updated: 0 }
    const summary = t('master.edit.result', { added: result.added, updated: result.updated, skipped: problems.length })
    setNotice(problems.length > 0 ? `${summary} ${problems.join(' ')}` : summary)
  }

  const submitForm = () => {
    const record = Object.fromEntries(fields.map((field) => [field.header, (draft[field.header] ?? '').trim()]))
    const parsed = parse(record)
    if (isError(parsed)) {
      setFormError(t(parsed.error === 'number' ? 'master.edit.notNumber' : 'master.edit.required', { row: 1, field: parsed.field }))
      return
    }
    const result = onApply([parsed])
    setNotice(t('master.edit.result', { added: result.added, updated: result.updated, skipped: 0 }))
    setOpen(false)
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const table = await readSheet(file)
      const present = new Set(Object.keys(table[0] ?? {}).map(headerKey))
      const missing = fields.filter((field) => field.required && !present.has(headerKey(field.header)))
      if (missing.length > 0) {
        setNotice(t('master.edit.headerMismatch', { columns: missing.map((field) => field.header).join(', ') }))
        return
      }
      const aligned = table.map((row) => {
        const byKey = new Map(Object.entries(row).map(([key, value]) => [headerKey(key), value]))
        return Object.fromEntries(fields.map((field) => [field.header, byKey.get(headerKey(field.header)) ?? '']))
      })
      applyParsed(aligned, 2)
    } catch {
      setNotice(t('master.edit.unreadable'))
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        icon={Plus}
        onClick={() => {
          setDraft(blank())
          setFormError('')
          setOpen(true)
        }}
      >
        {t('master.edit.add')}
      </Button>
      <Button size="sm" variant="outline" icon={FileSpreadsheet} onClick={() => fileRef.current?.click()}>
        {t('master.edit.upload')}
      </Button>
      <Button size="sm" variant="ghost" icon={Download} onClick={() => void downloadTemplate(fileName, fields.map((field) => field.header))}>
        {t('master.edit.template')}
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(event) => {
          void onFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      {notice && <span className="text-xs text-ink max-w-md">{notice}</span>}

      <DetailDrawer open={open} onClose={() => setOpen(false)} eyebrow={t('master.edit.formEyebrow')} title={title} description={t('master.edit.formHint')}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            submitForm()
          }}
        >
          {fields.map((field) => (
            <label key={field.header} className="block">
              <span className="text-xs font-medium text-ink-strong">
                {field.label}
                {field.required && <span className="text-danger"> *</span>}
              </span>
              <span className="ml-2 font-mono text-[10px] text-ink">{field.header}</span>
              {field.kind === 'select' && field.options ? (
                <Select className="mt-1" size="md" value={draft[field.header] ?? ''} options={field.options} onChange={(value) => setDraft((current) => ({ ...current, [field.header]: value }))} />
              ) : (
                <input
                  className={inputClass}
                  type={field.kind === 'number' ? 'number' : 'text'}
                  step="any"
                  required={field.required}
                  placeholder={field.placeholder}
                  value={draft[field.header] ?? ''}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.header]: event.target.value }))}
                />
              )}
            </label>
          ))}
          {formError && <p className="text-xs text-danger">{formError}</p>}
          <div className="flex gap-2 pt-2">
            <Button type="submit">{t('master.edit.save')}</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('common.close')}
            </Button>
          </div>
        </form>
      </DetailDrawer>
    </>
  )
}
