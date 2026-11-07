import React, { useState } from 'react'
import { Download, Factory } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel } from '../../components/common/SectionPanel'
import { KeyValueList } from '../../components/common/KeyValueList'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { IconTile } from '../../components/ui/IconTile'
import { ENTITY_META, type EntityKind } from '../../lib/entities'
import { useTranslation } from '../../lib/i18n'

interface MaterialGraphProps {
  onOpenBatchDetail?: () => void
}

interface GraphNode {
  id: string
  kind: EntityKind
  cx: number
  cy: number
  volume: string
  timestamp: string
  source: string
  destination: string
  integrity: string
}

const nodes: GraphNode[] = [
  { id: 'FARM A', kind: 'farm', cx: 80, cy: 110, volume: '8,200 L', timestamp: '30 Oct · 05:40', source: '—', destination: 'TRK-042', integrity: 'Verified' },
  { id: 'TRK-042', kind: 'tanker', cx: 230, cy: 175, volume: '8,200 L', timestamp: '30 Oct · 09:18', source: 'FARM A', destination: 'ST-04', integrity: 'Verified' },
  { id: 'ST-04', kind: 'tank', cx: 410, cy: 110, volume: '8,200 L', timestamp: '30 Oct · 10:18', source: 'TRK-042', destination: 'B-2026-1030-01', integrity: 'Verified' },
  { id: 'B-2026-1030-01', kind: 'batch', cx: 540, cy: 240, volume: '8,200 L input', timestamp: '30 Oct · 11:00', source: 'ST-04', destination: 'FG-1030-01', integrity: 'Pending' },
  { id: 'FG-1030-01', kind: 'finished', cx: 680, cy: 150, volume: 'Derived lot', timestamp: '30 Oct · 14:00', source: 'B-2026-1030-01', destination: '—', integrity: 'Mismatch' }
]

const edges: [string, string, string][] = [
  ['FARM A', 'TRK-042', 'COLLECTED'],
  ['TRK-042', 'ST-04', 'SUPPLIED_TO'],
  ['ST-04', 'B-2026-1030-01', 'PRODUCED'],
  ['B-2026-1030-01', 'FG-1030-01', 'FINISHED']
]

export const MaterialGraph: React.FC<MaterialGraphProps> = ({ onOpenBatchDetail }) => {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState('ST-04')
  const selected = nodes.find((n) => n.id === selectedId) ?? nodes[0]
  const byId = (id: string) => nodes.find((n) => n.id === id)!

  return (
    <>
      <PageHeader
        title={t('pages.traceability-graph.title')}
        description={t('pages.traceability-graph.description')}
        actions={
          <Button variant="secondary" icon={Download}>
            {t('common.export')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <SectionPanel
          title="Graph"
          subtitle="Click a node to inspect it"
          className="lg:col-span-8"
          actions={
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-ink">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand" /> Selected</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> Node</span>
            </div>
          }
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 flex items-center justify-center min-h-[360px] overflow-hidden">
            <svg viewBox="0 0 760 320" className="w-full h-auto max-h-[360px] select-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-300" />
                </marker>
              </defs>

              {edges.map(([from, to, label]) => {
                const a = byId(from)
                const b = byId(to)
                const dx = b.cx - a.cx
                const dy = b.cy - a.cy
                const len = Math.hypot(dx, dy)
                const pad = 16
                return (
                  <g key={`${from}-${to}`}>
                    <line
                      x1={a.cx + (dx / len) * pad}
                      y1={a.cy + (dy / len) * pad}
                      x2={b.cx - (dx / len) * pad}
                      y2={b.cy - (dy / len) * pad}
                      className="stroke-gray-300"
                      strokeWidth="1.5"
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={(a.cx + b.cx) / 2}
                      y={(a.cy + b.cy) / 2 - 8}
                      textAnchor="middle"
                      className="fill-gray-400 text-[10px] font-mono"
                    >
                      {label}
                    </text>
                  </g>
                )
              })}

              {nodes.map((node) => {
                const isSelected = node.id === selectedId
                return (
                  <g key={node.id} onClick={() => setSelectedId(node.id)} className="cursor-pointer">
                    {isSelected && <circle cx={node.cx} cy={node.cy} r="18" className="fill-brand/15" />}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isSelected ? 10 : 8}
                      className={isSelected ? 'fill-brand' : 'fill-gray-300 hover:fill-brand-subtle'}
                    />
                    <text
                      x={node.cx}
                      y={node.cy + 30}
                      textAnchor="middle"
                      className={isSelected ? 'fill-gray-900 text-[12px] font-bold' : 'fill-gray-600 text-[12px] font-semibold'}
                    >
                      {node.id}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </SectionPanel>

        <SectionPanel title={t('pages.traceability-graph.selected')} className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col h-full">
            <div className="flex items-center gap-3">
              <IconTile icon={ENTITY_META[selected.kind].icon} tone="brand" shape="circle" />
              <div className="min-w-0">
                <p className="text-base font-bold text-ink-strong truncate">{selected.id}</p>
                <p className="text-xs text-ink">{ENTITY_META[selected.kind].label}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              <Badge status="Recorded" variant="outline" />
              <Badge status={selected.integrity} />
            </div>

            <KeyValueList
              className="mt-4"
              items={[
                { label: 'Volume', value: selected.volume },
                { label: 'Timestamp', value: selected.timestamp },
                { label: 'Source', value: selected.source, mono: true },
                { label: 'Destination', value: selected.destination, mono: true }
              ]}
            />

            <Button className="mt-6 w-full" icon={Factory} onClick={onOpenBatchDetail}>
              {t('pages.traceability-graph.openBatch')}
            </Button>
          </div>
        </SectionPanel>
      </div>
    </>
  )
}
