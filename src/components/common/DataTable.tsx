import React from 'react'
import { cn } from '../../lib/cn'

export interface DataTableColumn<T> {
  key: string
  header: string
  render?: (row: T, index: number) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey?: (row: T, index: number) => string
  onRowClick?: (row: T, index: number) => void
  /** Title row rendered above the table (e.g. section title + SegmentedFilter) */
  title?: string
  toolbar?: React.ReactNode
  /** Left footer text, e.g. "Showing 4 of 4 relationships" */
  footer?: React.ReactNode
  /** Right footer note, e.g. a disclaimer */
  note?: React.ReactNode
  empty?: React.ReactNode
  /** Set false when the table already sits inside a card */
  bordered?: boolean
  className?: string
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' }

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  title,
  toolbar,
  footer,
  note,
  empty = 'No records found.',
  bordered = true,
  className
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'bg-white overflow-hidden',
        bordered && 'rounded-xl border border-gray-200 shadow-xs',
        className
      )}
    >
      {(title || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
          {title && <h3 className="text-sm font-bold text-ink-strong">{title}</h3>}
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-xs font-medium text-ink whitespace-nowrap',
                    alignClass[col.align ?? 'left'],
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-ink">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={rowKey ? rowKey(row, index) : index}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-gray-50/80')}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-4 py-3.5 text-ink-strong align-middle', alignClass[col.align ?? 'left'], col.className)}
                    >
                      {col.render
                        ? col.render(row, index)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(footer || note) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 text-xs text-ink">
          <div>{footer}</div>
          {note && <div className="flex items-center gap-1.5">{note}</div>}
        </div>
      )}
    </div>
  )
}
