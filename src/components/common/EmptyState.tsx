import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { IconTile } from '../ui/IconTile'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className }) => (
  <div
    className={cn(
      'rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-14 flex flex-col items-center text-center',
      className
    )}
  >
    <IconTile icon={icon} tone="brand" size="lg" shape="circle" />
    <h3 className="mt-4 text-base font-bold text-ink-strong">{title}</h3>
    {description && <p className="mt-1 text-sm text-ink max-w-md">{description}</p>}
    {action && (
      <Button className="mt-5" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
)
