import { useMemo } from 'react'
import { Tractor } from 'lucide-react'
import { FARMS, type Batch } from '../../../data/scenario'
import type { TraceabilitySnapshot } from '../../../data/traceability'
import { ancestors, descendants, farmOfTanker } from '../../../domain/genealogy'
import { cn } from '../../../lib/cn'
import { useFormat } from '../../../lib/format'
import { useTranslation } from '../../../lib/i18n'

const NODE_W = 156
const NODE_H = 54
const COL_GAP = 60
const ROW_GAP = 14
const PAD = 8

interface GraphNode {
  id: string
  column: number
  row: number
  batch?: Batch
}

interface GraphEdge {
  id: string
  from: string
  to: string
  label: string
}

/** Columns follow genealogy depth: farm → tanker → raw tank → ... → finished goods */
function layout(snapshot: TraceabilitySnapshot) {
  const linked = snapshot.batches.filter((batch) => snapshot.transfers.some((t) => t.fromBatch === batch.id || t.toBatch === batch.id))
  const depth = new Map<string, number>()
  const depthOf = (id: string): number => {
    if (depth.has(id)) return depth.get(id) as number
    const parents = snapshot.transfers.filter((t) => t.toBatch === id).map((t) => t.fromBatch)
    const value = parents.length ? Math.max(...parents.map(depthOf)) + 1 : 1
    depth.set(id, value)
    return value
  }
  linked.forEach((batch) => depthOf(batch.id))

  const nodes: GraphNode[] = []
  const rowsPerColumn = new Map<number, number>()
  const place = (id: string, column: number, batch?: Batch) => {
    const row = rowsPerColumn.get(column) ?? 0
    rowsPerColumn.set(column, row + 1)
    nodes.push({ id, column, row, batch })
  }
  FARMS.forEach((farm) => place(farm.id, 0))
  linked
    .sort((a, b) => (depth.get(a.id) ?? 0) - (depth.get(b.id) ?? 0))
    .forEach((batch) => place(batch.id, depth.get(batch.id) ?? 1, batch))

  const edges: GraphEdge[] = [
    ...linked
      .filter((batch) => batch.kind === 'tanker')
      .map((batch) => ({ id: `farm-${batch.id}`, from: farmOfTanker(batch, snapshot) ?? '', to: batch.id, label: batch.deliveryId ?? '' })),
    ...snapshot.transfers.map((t) => ({ id: t.id, from: t.fromBatch, to: t.toBatch, label: t.id }))
  ]

  const columns = Math.max(...nodes.map((n) => n.column)) + 1
  const rows = Math.max(...rowsPerColumn.values())
  return { nodes, edges, columns, rows }
}


const KIND_STYLE: Record<string, string> = {
  farm: 'border-success-subtle bg-success-muted',
  tanker: 'border-info-subtle bg-info-muted',
  raw: 'border-info-subtle bg-white',
  process: 'border-gray-200 bg-white',
  storage: 'border-gray-200 bg-white',
  cream: 'border-warning-subtle bg-warning-muted',
  mix: 'border-brand-subtle bg-brand-muted',
  aseptic: 'border-brand-subtle bg-white',
  finished: 'border-success-subtle bg-white'
}

interface GenealogyGraphProps {
  selectedId?: string
  snapshot: TraceabilitySnapshot
  onSelect: (id: string) => void
}

export function GenealogyGraph({ selectedId, snapshot, onSelect }: GenealogyGraphProps) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { nodes, edges, columns, rows } = useMemo(() => layout(snapshot), [snapshot])

  const highlighted = useMemo(() => {
    if (!selectedId) return undefined
    const batch = snapshot.batches.find((b) => b.id === selectedId)
    if (!batch) {
      // Farm: highlight its tankers and everything downstream
      const ids = new Set<string>([selectedId])
      snapshot.batches.filter((b) => b.kind === 'tanker' && farmOfTanker(b, snapshot) === selectedId).forEach((tanker) =>
        descendants(tanker.id, snapshot).batches.forEach((b) => ids.add(b.id))
      )
      return ids
    }
    const ids = new Set<string>([...ancestors(selectedId, snapshot).batches, ...descendants(selectedId, snapshot).batches].map((b) => b.id))
    ancestors(selectedId, snapshot)
      .batches.filter((b) => b.kind === 'tanker')
      .forEach((tanker) => ids.add(farmOfTanker(tanker, snapshot) ?? ''))
    return ids
  }, [selectedId, snapshot])

  const position = new Map(nodes.map((node) => [node.id, { x: PAD + node.column * (NODE_W + COL_GAP), y: PAD + node.row * (NODE_H + ROW_GAP) }]))
  const width = PAD * 2 + columns * NODE_W + (columns - 1) * COL_GAP
  const height = PAD * 2 + rows * NODE_H + (rows - 1) * ROW_GAP

  return (
    <div className="overflow-auto thin-scrollbar">
      <div className="relative" style={{ width, height }}>
        <svg className="absolute inset-0" width={width} height={height}>
          {edges.map((edge) => {
            const from = position.get(edge.from)
            const to = position.get(edge.to)
            if (!from || !to) return null
            const x1 = from.x + NODE_W
            const y1 = from.y + NODE_H / 2
            const x2 = to.x
            const y2 = to.y + NODE_H / 2
            const active = !highlighted || (highlighted.has(edge.from) && highlighted.has(edge.to))
            return (
              <path
                key={edge.id}
                d={`M${x1},${y1} C${x1 + COL_GAP / 2},${y1} ${x2 - COL_GAP / 2},${y2} ${x2},${y2}`}
                fill="none"
                stroke={active && highlighted ? 'var(--color-brand)' : 'var(--color-gray-300)'}
                strokeWidth={active && highlighted ? 2 : 1.25}
                opacity={active ? 1 : 0.25}
              >
                <title>{edge.label}</title>
              </path>
            )
          })}
        </svg>

        {nodes.map((node) => {
          const pos = position.get(node.id)!
          const dimmed = highlighted && !highlighted.has(node.id)
          const kind = node.batch?.kind ?? 'farm'
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelect(node.id)}
              className={cn(
                'absolute rounded-lg border px-2.5 py-1.5 text-left transition-opacity shadow-xs hover:shadow-sm',
                KIND_STYLE[kind],
                selectedId === node.id && 'ring-2 ring-brand',
                dimmed && 'opacity-30'
              )}
              style={{ left: pos.x, top: pos.y, width: NODE_W, height: NODE_H }}
            >
              <p className="flex items-center gap-1 font-mono text-[11px] font-semibold text-ink-strong truncate">
                {!node.batch && <Tractor className="w-3 h-3 text-success shrink-0" />}
                {node.batch ? node.id : FARMS.find((f) => f.id === node.id)?.name}
              </p>
              <p className="text-[10px] text-ink truncate">
                {node.batch ? `${t(`trace.kind.${kind}`)} · ${node.batch.assetId}` : t('trace.kind.farm')}
              </p>
              {node.batch && <p className="text-[10px] text-ink tabular-nums">{fmt.liters(node.batch.volumeL)}</p>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
