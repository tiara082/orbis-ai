import React from 'react'
import { clock, type Minutes } from '../../domain/time'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/cn'

export type BlockKind = 'plain' | 'flavoured' | 'changeover' | 'cip' | 'wait' | 'maintenance' | 'level'

export interface ScheduleBlock {
  id: string
  label: string
  sublabel?: string
  start: Minutes
  end: Minutes
  kind: BlockKind
  /** Draws the block with a red outline, e.g. a rule violation */
  flagged?: boolean
}

export interface ScheduleLane {
  id: string
  label: string
  sublabel?: string
  blocks: ScheduleBlock[]
}

interface ScheduleTimelineProps {
  lanes: ScheduleLane[]
  start: Minutes
  end: Minutes
  /** Minutes between axis ticks */
  tickEvery?: number
  /** Vertical marker, e.g. the scenario snapshot time */
  now?: Minutes
  nowLabel?: string
  legend?: BlockKind[]
  /** Overrides legend text per kind, e.g. `plain` = unloading on the bay timeline */
  legendLabels?: Partial<Record<BlockKind, string>>
  onBlockClick?: (block: ScheduleBlock, lane: ScheduleLane) => void
  className?: string
}

const kindClasses: Record<BlockKind, string> = {
  plain: 'bg-info-muted border-info-subtle text-info',
  flavoured: 'bg-brand-muted border-brand-subtle text-brand',
  changeover: 'bg-warning-muted border-warning-subtle text-warning',
  cip: 'bg-gray-100 border-gray-200 text-ink',
  wait: 'bg-transparent border-dashed border-gray-300 text-ink',
  maintenance: 'bg-danger-muted border-danger-subtle text-danger',
  level: 'bg-success-muted border-success-subtle text-success'
}

const DEFAULT_LEGEND: BlockKind[] = ['plain', 'flavoured', 'changeover', 'cip', 'wait']

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  lanes,
  start,
  end,
  tickEvery = 120,
  now,
  nowLabel,
  legend = DEFAULT_LEGEND,
  legendLabels,
  onBlockClick,
  className
}) => {
  const { t } = useTranslation()
  const span = end - start
  const pct = (m: Minutes) => ((Math.min(Math.max(m, start), end) - start) / span) * 100
  const ticks: Minutes[] = []
  for (let m = start; m <= end; m += tickEvery) ticks.push(m)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="overflow-x-auto thin-scrollbar [contain:inline-size]">
        <div className="min-w-[640px]">
          <div className="relative">
            {lanes.map((lane) => (
              <div key={lane.id} className="flex items-center gap-3 py-1.5">
                <div className="w-32 shrink-0 leading-tight">
                  <p className="text-xs font-semibold text-ink-strong truncate">{lane.label}</p>
                  {lane.sublabel && <p className="text-[11px] text-ink truncate">{lane.sublabel}</p>}
                </div>
                <div className="relative flex-1 h-11 rounded-lg bg-gray-50 border border-gray-100">
                  {lane.blocks
                    .filter((block) => block.end > start && block.start < end)
                    .map((block) => {
                      const width = pct(block.end) - pct(block.start)
                      const Tag = onBlockClick ? 'button' : 'div'
                      return (
                        <Tag
                          key={block.id}
                          type={onBlockClick ? 'button' : undefined}
                          onClick={onBlockClick ? () => onBlockClick(block, lane) : undefined}
                          title={`${block.label}${block.sublabel ? ` · ${block.sublabel}` : ''} · ${clock(block.start)}–${clock(block.end)}`}
                          className={cn(
                            'absolute top-1 bottom-1 rounded-md border px-1.5 flex flex-col justify-center overflow-hidden text-left',
                            kindClasses[block.kind],
                            block.flagged && 'ring-2 ring-danger/60',
                            onBlockClick && 'hover:brightness-95 cursor-pointer'
                          )}
                          style={{ left: `${pct(block.start)}%`, width: `calc(${width}% - 2px)` }}
                        >
                          {width > 4 && (
                            <>
                              <span className="text-[11px] font-semibold truncate leading-tight">{block.label}</span>
                              <span className="text-[10px] opacity-80 truncate leading-tight tabular-nums">
                                {clock(block.start)}–{clock(block.end)}
                              </span>
                            </>
                          )}
                        </Tag>
                      )
                    })}
                </div>
              </div>
            ))}

            {now !== undefined && now >= start && now <= end && (
              <div className="absolute inset-y-0 left-[8.75rem] right-0 pointer-events-none">
                <div className="absolute inset-y-0 w-px bg-danger/70" style={{ left: `${pct(now)}%` }}>
                  {nowLabel && (
                    <span className="absolute -top-0.5 left-1 text-[10px] font-semibold text-danger whitespace-nowrap bg-white/90 px-1 rounded">
                      {nowLabel}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-32 shrink-0" />
            <div className="relative flex-1 h-4">
              {ticks.map((m, i) => (
                <span
                  key={m}
                  className={cn(
                    'absolute text-[10px] font-medium text-ink tabular-nums',
                    i === 0 ? '' : i === ticks.length - 1 ? '-translate-x-full' : '-translate-x-1/2'
                  )}
                  style={{ left: `${pct(m)}%` }}
                >
                  {clock(m)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {legend.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink">
          {legend.map((kind) => (
            <span key={kind} className="flex items-center gap-1.5">
              <span className={cn('w-2.5 h-2.5 rounded-sm border', kindClasses[kind])} />
              {legendLabels?.[kind] ?? t(`schedule.kind.${kind}`)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
