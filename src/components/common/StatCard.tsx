import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { getStatusStyle, toneText, type Tone } from '../../lib/status'
import { IconTile } from '../ui/IconTile'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  caption?: string
  /** Tone of the caption; or pass captionStatus to resolve tone + icon from lib/status.ts */
  captionTone?: Tone
  captionStatus?: string
  valueClassName?: string
  className?: string
  /** Extra content inside the value box, e.g. a ProgressBar */
  children?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  caption,
  captionTone,
  captionStatus,
  valueClassName,
  className,
  children
}) => {
  const status = captionStatus ? getStatusStyle(captionStatus) : undefined
  const tone = captionTone ?? status?.tone ?? 'neutral'
  const CaptionIcon = status?.icon

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-xs p-2.5 flex flex-col gap-2.5', className)}>
      <div className="flex items-center gap-2 px-1 pt-0.5">
        <IconTile icon={icon} size="sm" shape="circle" />
        <span className="text-xs font-medium text-ink truncate">{label}</span>
      </div>
      <div className="rounded-lg bg-gray-50 px-3 py-2.5 flex-1">
        <p className={cn('text-2xl font-extrabold tracking-tight text-ink-strong leading-none tabular-nums', valueClassName)}>
          {value}
        </p>
        {children}
        {caption && (
          <p className="mt-2 flex items-center gap-1 text-[11px] min-w-0">
            {CaptionIcon && <CaptionIcon className={cn('w-3 h-3 shrink-0', toneText[tone])} strokeWidth={2.25} />}
            <span className={cn('truncate', CaptionIcon ? 'text-ink' : toneText[tone])}>{caption}</span>
          </p>
        )}
      </div>
    </div>
  )
}
