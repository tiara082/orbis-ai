import React from 'react'
import { Info, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { toneText, type Tone } from '../../lib/status'

interface CalloutProps {
  tone?: Tone
  /** `soft` = tinted panel; `strong` = filled brand banner for the main recommendation */
  variant?: 'soft' | 'strong'
  icon?: LucideIcon
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

const softClasses: Record<Tone, string> = {
  neutral: 'bg-gray-50 border-gray-200',
  brand: 'bg-brand-muted border-brand-subtle',
  success: 'bg-success-muted border-success-subtle',
  warning: 'bg-warning-muted border-warning-subtle',
  danger: 'bg-danger-muted border-danger-subtle',
  info: 'bg-info-muted border-info-subtle'
}

export const Callout: React.FC<CalloutProps> = ({
  tone = 'info',
  variant = 'soft',
  icon: Icon = Info,
  eyebrow,
  title,
  description,
  actions,
  className
}) => {
  const strong = variant === 'strong'

  return (
    <div
      className={cn(
        'rounded-xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4',
        strong ? 'bg-linear-to-br from-brand to-brand-hover border-brand text-white shadow-sm' : softClasses[tone],
        className
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span
          className={cn(
            'inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
            strong ? 'bg-white/15 text-white' : cn('bg-white', toneText[tone])
          )}
        >
          <Icon className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          {eyebrow && (
            <p className={cn('text-[11px] font-semibold uppercase tracking-wider mb-1', strong ? 'text-white/75' : toneText[tone])}>
              {eyebrow}
            </p>
          )}
          <div className={cn('text-sm sm:text-base font-bold tracking-tight', strong ? 'text-white' : 'text-ink-strong')}>
            {title}
          </div>
          {description && (
            <div className={cn('text-xs sm:text-sm mt-1', strong ? 'text-white/80' : 'text-ink')}>{description}</div>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
