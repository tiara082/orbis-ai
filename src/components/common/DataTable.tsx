import React, { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { Badge } from '../ui/Badge'
import { SearchInput } from '../ui/SearchInput'

type CellValue = string | number | null | undefined

export interface DataTableColumn<T> {
  key: string
  header: string
  /** Raw value used for the default cell, sorting, and search */
  value?: (row: T) => CellValue
  /** Custom cell; falls back to `value`, then to row[key] */
  render?: (row: T, index: number) => React.ReactNode
  /** `number` = right aligned tabular figures; `status` = Badge; `mono` = IDs and codes */
  type?: 'text' | 'number' | 'status' | 'mono'
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
  /** Header tooltip, e.g. unit or data source */
  hint?: string
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey?: (row: T, index: number) => string
  onRowClick?: (row: T, index: number) => void
  /** Highlights the row whose key matches, e.g. the row open in a detail panel */
  selectedKey?: string
  rowClassName?: (row: T) => string | undefined
  title?: string
  subtitle?: string
  /** Extra controls in the title row, e.g. a SegmentedFilter */
  toolbar?: React.ReactNode
  /** Shows a search box that filters on the given text */
  searchText?: (row: T) => string
  searchPlaceholder?: string
  /** Paginates when there are more rows than this */
  pageSize?: number
  /** Left footer; defaults to the row count */
  footer?: React.ReactNode
  /** Right footer note, e.g. the data source */
  note?: React.ReactNode
  empty?: React.ReactNode
  /** Set false when the table already sits inside a card */
  bordered?: boolean
  dense?: boolean
  className?: string
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' }

/** Plain-text cells up to this length stay on one line; longer text wraps */
const SHORT_TEXT = 40

function rawValue<T>(column: DataTableColumn<T>, row: T): CellValue {
  if (column.value) return column.value(row)
  const value = (row as Record<string, unknown>)[column.key]
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectedKey,
  rowClassName,
  title,
  subtitle,
  toolbar,
  searchText,
  searchPlaceholder,
  pageSize,
  footer,
  note,
  empty,
  bordered = true,
  dense,
  className
}: DataTableProps<T>) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !searchText) return rows
    return rows.filter((row) => searchText(row).toLowerCase().includes(q))
  }, [rows, query, searchText])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const column = columns.find((c) => c.key === sort.key)
    if (!column) return filtered
    const factor = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const va = rawValue(column, a)
      const vb = rawValue(column, b)
      if (va === vb) return 0
      if (va === undefined || va === null) return 1
      if (vb === undefined || vb === null) return -1
      return (typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))) * factor
    })
  }, [filtered, sort, columns])

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const currentPage = Math.min(page, pageCount - 1)
  const visible = pageSize ? sorted.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : sorted

  const toggleSort = (key: string) => {
    setPage(0)
    setSort((current) => {
      if (!current || current.key !== key) return { key, dir: 'asc' }
      if (current.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
  }

  const showHeader = title || subtitle || toolbar || searchText
  const countText =
    sorted.length === rows.length
      ? t('table.count', { count: rows.length })
      : t('table.countFiltered', { shown: sorted.length, total: rows.length })

  return (
    <div className={cn('bg-white overflow-hidden', bordered && 'rounded-xl border border-gray-200 shadow-xs', className)}>
      {showHeader && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
          {(title || subtitle) && (
            <div className="min-w-0">
              {title && <h3 className="text-sm font-bold text-ink-strong">{title}</h3>}
              {subtitle && <p className="text-xs text-ink mt-0.5">{subtitle}</p>}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {toolbar}
            {searchText && (
              <SearchInput
                size="sm"
                className="w-56"
                placeholder={searchPlaceholder ?? t('table.search')}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(0)
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto thin-scrollbar [contain:inline-size]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map((col) => {
                const align = col.align ?? (col.type === 'number' ? 'right' : 'left')
                const active = sort?.key === col.key
                const SortIcon = !active ? ArrowUpDown : sort?.dir === 'asc' ? ArrowUp : ArrowDown
                return (
                  <th
                    key={col.key}
                    scope="col"
                    title={col.hint}
                    className={cn('px-4 py-2.5 text-xs font-medium text-ink whitespace-nowrap', alignClass[align], col.className)}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={cn(
                          'inline-flex items-center gap-1 hover:text-ink-strong transition-colors',
                          align === 'right' && 'flex-row-reverse',
                          active && 'text-ink-strong'
                        )}
                      >
                        {col.header}
                        <SortIcon className={cn('w-3 h-3', active ? 'text-brand' : 'text-gray-300')} />
                      </button>
                    ) : (
                      <span className={cn('inline-flex items-center gap-1', align === 'right' && 'flex-row-reverse')}>
                        {col.header}
                        {col.hint && <Info className="w-3 h-3 text-gray-300" />}
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-ink">
                  {empty ?? t('table.empty')}
                </td>
              </tr>
            ) : (
              visible.map((row, index) => {
                const key = rowKey ? rowKey(row, index) : String(index)
                return (
                  <tr
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                    className={cn(
                      'transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-gray-50/80',
                      selectedKey !== undefined && selectedKey === key && 'bg-brand-muted/50 hover:bg-brand-muted/60',
                      rowClassName?.(row)
                    )}
                  >
                    {columns.map((col) => {
                      const align = col.align ?? (col.type === 'number' ? 'right' : 'left')
                      const value = rawValue(col, row)
                      let content: React.ReactNode
                      if (col.render) content = col.render(row, index)
                      else if (col.type === 'status') content = value ? <Badge status={String(value)} /> : '—'
                      else content = value === undefined || value === null || value === '' ? '—' : value
                      const isText = typeof content === 'string'
                      const isShort = typeof content === 'number' || (typeof content === 'string' && content.length <= SHORT_TEXT)
                      return (
                        <td
                          key={col.key}
                          className={cn(
                            'px-4 text-ink-strong align-middle',
                            dense ? 'py-2' : 'py-3',
                            alignClass[align],
                            isShort && 'whitespace-nowrap',
                            isText && !isShort && 'min-w-[240px]',
                            col.type === 'number' && 'tabular-nums whitespace-nowrap',
                            col.type === 'mono' && 'font-mono text-xs whitespace-nowrap',
                            col.className
                          )}
                        >
                          {content}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-gray-100 text-xs text-ink">
        <div className="flex items-center gap-3">
          <span>{footer ?? countText}</span>
          {pageSize && pageCount > 1 && (
            <span className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label={t('table.previous')}
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
                className="w-6 h-6 inline-flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="tabular-nums">
                {currentPage + 1}/{pageCount}
              </span>
              <button
                type="button"
                aria-label={t('table.next')}
                disabled={currentPage >= pageCount - 1}
                onClick={() => setPage(currentPage + 1)}
                className="w-6 h-6 inline-flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
        {note && <div className="flex items-center gap-1.5">{note}</div>}
      </div>
    </div>
  )
}
