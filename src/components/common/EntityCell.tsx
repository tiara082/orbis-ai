import React from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Tone } from '../../lib/status'
import { IconTile } from '../ui/IconTile'

interface EntityCellProps {
  icon: LucideIcon
  id: string
  type?: string
  tone?: Tone
  mono?: boolean
}

export const EntityCell: React.FC<EntityCellProps> = ({ icon, id, type, tone = 'neutral', mono }) => (
  <div className="flex items-center gap-3 min-w-0">
    <IconTile icon={icon} tone={tone} size="md" shape="circle" className={tone === 'neutral' ? 'bg-gray-50' : undefined} />
    <div className="min-w-0 leading-tight">
      <p className={mono ? 'font-mono text-xs font-semibold text-ink-strong truncate' : 'text-sm font-semibold text-ink-strong truncate'}>
        {id}
      </p>
      {type && <p className="text-xs text-ink truncate mt-0.5">{type}</p>}
    </div>
  </div>
)
