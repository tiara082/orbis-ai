import React from 'react'
import { Search } from 'lucide-react'
import { cn } from '../../lib/cn'

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md'
}

export const SearchInput: React.FC<SearchInputProps> = ({ size = 'md', className, ...props }) => (
  <div className={cn('relative', className)}>
    <Search
      className={cn(
        'absolute left-3 top-1/2 -translate-y-1/2 text-ink pointer-events-none',
        size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
      )}
    />
    <input
      type="search"
      className={cn(
        'w-full rounded-lg border border-gray-200 bg-white text-ink-strong placeholder:text-ink/70',
        'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors',
        size === 'sm' ? 'h-8 pl-8 pr-3 text-xs' : 'h-10 pl-9 pr-3 text-sm'
      )}
      {...props}
    />
  </div>
)
