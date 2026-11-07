import { cn } from '../../lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  count?: number
}

interface SegmentedFilterProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedFilter<T extends string>({
  options,
  value,
  onChange,
  className
}: SegmentedFilterProps<T>) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium transition-colors',
              active ? 'bg-brand text-white shadow-sm' : 'text-ink hover:bg-gray-100 hover:text-ink-strong'
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn('tabular-nums', active ? 'text-white/80' : 'text-ink')}>{option.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
