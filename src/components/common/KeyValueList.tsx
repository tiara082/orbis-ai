import React from 'react'
import { cn } from '../../lib/cn'

export interface KeyValueItem {
  label: string
  value: React.ReactNode
  mono?: boolean
}

interface KeyValueListProps {
  items: KeyValueItem[]
  /** `rows` = label left / value right; `grid` = label above value in columns */
  layout?: 'rows' | 'grid'
  columns?: 2 | 3 | 4
  className?: string
}

const gridCols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }

export const KeyValueList: React.FC<KeyValueListProps> = ({ items, layout = 'rows', columns = 2, className }) => {
  if (layout === 'grid') {
    return (
      <dl className={cn('grid grid-cols-1 gap-3', gridCols[columns], className)}>
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
            <dt className="text-[11px] font-medium text-ink">{item.label}</dt>
            <dd className={cn('mt-1 text-sm font-semibold text-ink-strong', item.mono && 'font-mono text-xs')}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    )
  }

  return (
    <dl className={cn('divide-y divide-gray-100', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
          <dt className="text-ink">{item.label}</dt>
          <dd className={cn('font-semibold text-ink-strong text-right', item.mono && 'font-mono text-xs')}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
