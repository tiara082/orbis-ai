import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { getStatusStyle, toneSoft, toneSolid, type Tone } from '../../lib/status'

interface BadgeProps {
  /** Domain status text; tone and icon are resolved from lib/status.ts */
  status?: string
  tone?: Tone
  icon?: LucideIcon | null
  variant?: 'soft' | 'outline' | 'solid'
  shape?: 'rounded' | 'pill'
  size?: 'sm' | 'md'
  className?: string
  children?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  tone,
  icon,
  variant = 'soft',
  shape = 'rounded',
  size = 'sm',
  className,
  children
}) => {
  const { t } = useTranslation()
  const resolved = status ? getStatusStyle(status) : undefined
  const finalTone: Tone = tone ?? resolved?.tone ?? 'neutral'
  const Icon = icon === null ? undefined : icon ?? resolved?.icon
  const statusKey = status ? `status.${status.trim().toLowerCase()}` : undefined
  const translatedStatus = statusKey ? t(statusKey) : undefined
  const statusLabel = translatedStatus && translatedStatus !== statusKey ? translatedStatus : status

  const variantClass =
    variant === 'solid'
      ? toneSolid[finalTone]
      : variant === 'outline'
        ? cn('border', toneSoft[finalTone], 'bg-white')
        : cn('border', toneSoft[finalTone])

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium whitespace-nowrap',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        shape === 'pill' ? 'rounded-full' : 'rounded-md',
        variantClass,
        className
      )}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} strokeWidth={2.25} />}
      {children ?? statusLabel ?? status}
    </span>
  )
}
