import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Tone } from '../../lib/status'

interface IconTileProps {
  icon: LucideIcon
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  shape?: 'square' | 'circle'
  className?: string
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-white border border-gray-200 text-ink',
  brand: 'bg-brand-muted text-brand',
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  danger: 'bg-danger-muted text-danger',
  info: 'bg-info-muted text-info'
}

const sizeClasses = {
  sm: { box: 'w-7 h-7', icon: 'w-3.5 h-3.5' },
  md: { box: 'w-9 h-9', icon: 'w-4 h-4' },
  lg: { box: 'w-11 h-11', icon: 'w-5 h-5' }
}

export const IconTile: React.FC<IconTileProps> = ({
  icon: Icon,
  tone = 'neutral',
  size = 'md',
  shape = 'square',
  className
}) => (
  <span
    className={cn(
      'inline-flex items-center justify-center shrink-0',
      shape === 'circle' ? 'rounded-full' : 'rounded-lg',
      sizeClasses[size].box,
      toneClasses[tone],
      className
    )}
  >
    <Icon className={sizeClasses[size].icon} strokeWidth={2} />
  </span>
)
