import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  options: SelectOption[]
  onChange: (value: string) => void
  size?: 'sm' | 'md'
}

export const Select: React.FC<SelectProps> = ({ options, onChange, size = 'sm', className, ...props }) => (
  <div className={cn('relative', className)}>
    <select
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        'w-full appearance-none rounded-lg border border-gray-200 bg-white text-ink-strong pr-8',
        'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors',
        size === 'sm' ? 'h-8 pl-3 text-xs' : 'h-10 pl-3 text-sm'
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink pointer-events-none" />
  </div>
)
