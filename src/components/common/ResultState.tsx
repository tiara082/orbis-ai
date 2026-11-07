import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { getStatusStyle, type Tone } from '../../lib/status'
import { Badge } from '../ui/Badge'
import { IconTile } from '../ui/IconTile'
import { KeyValueList, type KeyValueItem } from './KeyValueList'

interface ResultStateProps {
  /** Status text, e.g. "Approved", "Rejected", "Delayed" */
  status: string
  icon?: LucideIcon
  tone?: Tone
  title: string
  description?: React.ReactNode
  details?: KeyValueItem[]
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export const ResultState: React.FC<ResultStateProps> = ({
  status,
  icon,
  tone,
  title,
  description,
  details,
  actions,
  className,
  children
}) => {
  const resolved = getStatusStyle(status)
  const finalTone = tone ?? resolved.tone
  const Icon = icon ?? resolved.icon

  return (
    <div className={cn('rounded-2xl border border-gray-200 bg-gray-50 p-3', className)}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {Icon && <IconTile icon={Icon} tone={finalTone} size="lg" shape="circle" />}
          <div className="flex-1 min-w-0">
            <Badge status={status} tone={finalTone} icon={null} size="md" shape="pill">
              {status}
            </Badge>
            <h2 className="mt-3 text-lg font-bold tracking-tight text-ink-strong">{title}</h2>
            {description && <div className="text-sm text-ink mt-1.5 max-w-2xl">{description}</div>}
            {details && details.length > 0 && (
              <KeyValueList items={details} layout="grid" columns={details.length >= 3 ? 3 : 2} className="mt-5" />
            )}
            {children && <div className="mt-5">{children}</div>}
            {actions && <div className="mt-6 flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
