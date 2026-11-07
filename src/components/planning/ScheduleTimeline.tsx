import React from 'react'
import { cn } from '../../lib/cn'

export type BlockKind = 'plain' | 'flavoured' | 'changeover' | 'cip' | 'idle'

export interface ScheduleBlock {
  label: string
  /** Decimal hours, e.g. 10.75 = 10:45 */
  start: number
  end: number
  kind: BlockKind
}

export interface ScheduleLane {
  label: string
  sublabel?: string
  blocks: ScheduleBlock[]
}

interface ScheduleTimelineProps {
  lanes: ScheduleLane[]
  startHour: number
  endHour: number
  /** Hours between axis ticks */
  tickEvery?: number
  showLegend?: boolean
  className?: string
}

const kindClasses: Record<BlockKind, string> = {
  plain: 'bg-info-muted border-info-subtle text-info',
  flavoured: 'bg-brand-muted border-brand-subtle text-brand',
  changeover: 'bg-warning-muted border-warning-subtle text-warning',
  cip: 'bg-gray-100 border-gray-200 text-ink',
  idle: 'bg-transparent border-dashed border-gray-200 text-ink'
}

const legend: { kind: BlockKind; label: string }[] = [
  { kind: 'plain', label: 'Plain (Full Cream)' },
  { kind: 'flavoured', label: 'Flavoured' },
  { kind: 'changeover', label: 'Changeover' },
  { kind: 'cip', label: 'CIP' }
]

const formatHour = (h: number) => {
  const hours = Math.floor(h)
  const minutes = Math.round((h - hours) * 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  lanes,
  startHour,
  endHour,
  tickEvery = 2,
  showLegend = true,
  className
}) => {
  const span = endHour - startHour
  const pct = (h: number) => ((h - startHour) / span) * 100
  const ticks: number[] = []
  for (let h = startHour; h <= endHour; h += tickEvery) ticks.push(h)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="overflow-x-auto thin-scrollbar">
        <div className="min-w-[560px]">
          {lanes.map((lane) => (
            <div key={lane.label} className="flex items-center gap-3 py-2">
              <div className="w-32 shrink-0 leading-tight">
                <p className="text-xs font-semibold text-ink-strong truncate">{lane.label}</p>
                {lane.sublabel && <p className="text-[11px] text-ink truncate">{lane.sublabel}</p>}
              </div>
              <div className="relative flex-1 h-10 rounded-lg bg-gray-50 border border-gray-100">
                {lane.blocks.map((block) => (
                  <div
                    key={`${block.label}-${block.start}`}
                    title={`${block.label} · ${formatHour(block.start)}–${formatHour(block.end)}`}
                    className={cn(
                      'absolute top-1 bottom-1 rounded-md border px-2 flex flex-col justify-center overflow-hidden',
                      kindClasses[block.kind]
                    )}
                    style={{ left: `${pct(block.start)}%`, width: `calc(${pct(block.end) - pct(block.start)}% - 2px)` }}
                  >
                    <span className="text-[11px] font-semibold truncate leading-tight">{block.label}</span>
                    <span className="text-[10px] opacity-80 truncate leading-tight tabular-nums">
                      {formatHour(block.start)}–{formatHour(block.end)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 pt-1">
            <div className="w-32 shrink-0" />
            <div className="relative flex-1 h-4">
              {ticks.map((h) => (
                <span
                  key={h}
                  className="absolute -translate-x-1/2 text-[10px] font-medium text-ink tabular-nums first:translate-x-0 last:-translate-x-full"
                  style={{ left: `${pct(h)}%` }}
                >
                  {formatHour(h)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showLegend && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink">
          {legend.map((item) => (
            <span key={item.kind} className="flex items-center gap-1.5">
              <span className={cn('w-2.5 h-2.5 rounded-sm border', kindClasses[item.kind])} />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
