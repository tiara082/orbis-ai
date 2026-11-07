import React from 'react'
import { cn } from '../../lib/cn'

interface SectionPanelProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  /** `muted` = gray panel holding white cards (default); `plain` = white card */
  variant?: 'muted' | 'plain'
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}

export const SectionPanel: React.FC<SectionPanelProps> = ({
  title,
  subtitle,
  actions,
  variant = 'muted',
  className,
  bodyClassName,
  children
}) => (
  <section
    className={cn(
      'rounded-2xl border',
      variant === 'muted' ? 'bg-gray-50 border-gray-200/80 p-3' : 'bg-white border-gray-200 shadow-xs p-5',
      className
    )}
  >
    {(title || actions) && (
      <div
        className={cn(
          'flex flex-wrap items-start justify-between gap-3',
          variant === 'muted' ? 'px-2 pt-1.5 pb-3' : 'mb-4'
        )}
      >
        <div className="min-w-0">
          {title && <h2 className="text-[15px] font-bold tracking-tight text-ink-strong">{title}</h2>}
          {subtitle && <p className="text-xs text-ink mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className={bodyClassName}>{children}</div>
  </section>
)

/** Plain white card used inside a muted SectionPanel or on its own */
export const Card: React.FC<{
  className?: string
  onClick?: () => void
  children: React.ReactNode
}> = ({ className, onClick, children }) => (
  <div
    onClick={onClick}
    className={cn(
      'bg-white rounded-xl border border-gray-200 shadow-xs',
      onClick && 'cursor-pointer transition-colors hover:border-brand-subtle',
      className
    )}
  >
    {children}
  </div>
)
