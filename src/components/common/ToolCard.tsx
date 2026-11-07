import React from 'react'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Tone } from '../../lib/status'
import { IconTile } from '../ui/IconTile'

interface ToolCardProps {
  icon: LucideIcon
  iconTone?: Tone
  title: string
  description?: string
  badge?: React.ReactNode
  onClick?: () => void
  /** Show an arrow after the title to hint navigation */
  showArrow?: boolean
  className?: string
  children?: React.ReactNode
}

export const ToolCard: React.FC<ToolCardProps> = ({
  icon,
  iconTone = 'brand',
  title,
  description,
  badge,
  onClick,
  showArrow,
  className,
  children
}) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    className={cn(
      'group bg-white rounded-xl border border-gray-200 shadow-xs p-4 flex flex-col',
      onClick && 'cursor-pointer transition-colors hover:border-brand-subtle',
      className
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <IconTile icon={icon} tone={iconTone} />
      {badge}
    </div>
    <h3 className="mt-4 text-sm font-bold text-ink-strong flex items-center gap-1.5">
      {title}
      {(showArrow ?? Boolean(onClick)) && (
        <ArrowRight className="w-3.5 h-3.5 text-ink transition-transform group-hover:translate-x-0.5" />
      )}
    </h3>
    {description && <p className="text-xs text-ink mt-1">{description}</p>}
    {children && (
      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    )}
  </div>
)
