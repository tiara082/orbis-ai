import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconRight?: LucideIcon
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white shadow-sm hover:bg-brand-hover',
  secondary: 'bg-gray-100 text-ink-strong border border-gray-200 hover:bg-gray-200/70',
  outline: 'bg-white text-ink-strong border border-gray-200 shadow-xs hover:bg-gray-50',
  ghost: 'text-ink hover:bg-gray-100 hover:text-ink-strong',
  link: 'text-brand hover:text-brand-hover hover:underline underline-offset-4 px-0 h-auto',
  danger: 'bg-danger text-white shadow-sm hover:opacity-90'
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:pointer-events-none disabled:opacity-50',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}
    {...props}
  >
    {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
    {children}
    {IconRight && <IconRight className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
  </button>
)
