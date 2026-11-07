import React from 'react'
import { cn } from '../../lib/cn'
import type { Tone } from '../../lib/status'

interface ProgressBarProps {
  /** 0 - 100 */
  value: number
  tone?: Tone
  /** Optional threshold marker, e.g. 50 for the two-filler aseptic tank rule */
  marker?: number
  className?: string
}

const fillClasses: Record<Tone, string> = {
  neutral: 'bg-gray-400',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, tone = 'brand', marker, className }) => {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('relative h-1.5 w-full rounded-full bg-gray-100', className)}>
      <div className={cn('h-full rounded-full', fillClasses[tone])} style={{ width: `${clamped}%` }} />
      {marker !== undefined && (
        <span className="absolute -top-1 h-3.5 w-0.5 rounded-full bg-ink-strong/60" style={{ left: `${marker}%` }} />
      )}
    </div>
  )
}
