import React, { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookCheck,
  Clock,
  Download,
  FlaskConical,
  Layers,
  MoreHorizontal,
  Network,
  Search,
  ShieldCheck,
  TriangleAlert,
  Waypoints
} from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { SectionPanel } from '../../components/common/SectionPanel'
import { StatCard } from '../../components/common/StatCard'
import { ToolCard } from '../../components/common/ToolCard'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { EntityCell } from '../../components/common/EntityCell'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { SearchInput } from '../../components/ui/SearchInput'
import { SegmentedFilter } from '../../components/ui/SegmentedFilter'
import { ENTITY_META, type EntityKind } from '../../lib/entities'

interface TraceabilityOverviewProps {
  onOpenGraph: () => void
  onOpenForward?: () => void
  onOpenBackward?: () => void
  onOpenBatch?: () => void
}

type Integrity = 'Verified' | 'Pending' | 'Mismatch' | 'Not Recorded'

interface RelationshipRow {
  kind: EntityKind
  id: string
  relationship: string
  status: string
  integrity: Integrity
  eventId: string
  eventTime: string
}

const relationships: RelationshipRow[] = [
  { kind: 'tanker', id: 'TRK-042', relationship: 'SUPPLIED_TO ST-04', status: 'Recorded', integrity: 'Verified', eventId: 'EVT-1030-0918', eventTime: '30 Oct 09:18' },
  { kind: 'tank', id: 'ST-04', relationship: 'BLENDED_FROM TRK-042', status: 'Recorded', integrity: 'Verified', eventId: 'EVT-1030-1018', eventTime: '30 Oct 10:18' },
  { kind: 'batch', id: 'B-2026-1030-01', relationship: 'PRODUCED', status: 'Recorded', integrity: 'Pending', eventId: 'EVT-1030-1100', eventTime: '30 Oct 11:00' },
  { kind: 'finished', id: 'FG-1030-01', relationship: 'Derived from batch', status: 'Recorded', integrity: 'Mismatch', eventId: 'EVT-1030-1400', eventTime: '30 Oct 14:00' }
]

type Filter = 'all' | Integrity

export const TraceabilityOverview: React.FC<TraceabilityOverviewProps> = ({
  onOpenGraph,
  onOpenForward,
  onOpenBackward,
  onOpenBatch
}) => {
  const { navigate } = useNavigation()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const countOf = (integrity: Integrity) => relationships.filter((r) => r.integrity === integrity).length
  const rows = filter === 'all' ? relationships : relationships.filter((r) => r.integrity === filter)

  const columns: DataTableColumn<RelationshipRow>[] = [
    {
      key: 'entity',
      header: 'Entity',
      render: (row) => <EntityCell icon={ENTITY_META[row.kind].icon} id={row.id} type={ENTITY_META[row.kind].label} />
    },
    { key: 'relationship', header: 'Relationship', render: (row) => <span className="text-[13px]">{row.relationship}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} variant="outline" /> },
    { key: 'integrity', header: 'Integrity Status', render: (row) => <Badge status={row.integrity} /> },
    {
      key: 'event',
      header: 'Event',
      render: (row) => (
        <div className="leading-tight">
          <p className="font-mono text-xs text-ink-strong">{row.eventId}</p>
          <p className="text-xs text-ink mt-0.5">{row.eventTime}</p>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: () => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="link" size="sm" onClick={() => navigate('audit-integrity-check')}>
            View verification
          </Button>
          <button type="button" className="p-1.5 rounded-md text-ink hover:bg-gray-100" aria-label="More actions">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <>
      <PageHeader
        title="Traceability overview"
        actions={
          <>
            <Button variant="secondary" icon={Download}>
              Export
            </Button>
            <Button icon={Network} onClick={onOpenGraph}>
              Relationship graph
            </Button>
          </>
        }
      />

      <div className="space-y-5">
        <SectionPanel title="Quick stats" subtitle="Graph-based material relationships from farm to finished goods">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatCard icon={Waypoints} label="Relationships" value="04" caption="TRK-042 → FG-1030-01" />
            <StatCard icon={ShieldCheck} label="Verified" value="02" caption="matches blockchain proof" captionStatus="Verified" />
            <StatCard icon={Clock} label="Pending" value="01" caption="awaiting confirmation" captionStatus="Pending" />
            <StatCard icon={TriangleAlert} label="Mismatch" value="01" caption="needs QA review" captionStatus="Failed" />
            <StatCard icon={Layers} label="Traced volume" value="8,200 L" caption="via ST-04" />
            <StatCard icon={BookCheck} label="Ledger check" value="15:02" caption="30 Oct 2026 · Shift A" />
          </div>
        </SectionPanel>

        <SectionPanel title="Trace tools">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ToolCard
              icon={Search}
              title="Search relationship"
              description="Batch, tank, tanker, or lot ID"
              badge={<Badge tone="success" shape="pill">Ready</Badge>}
              showArrow={false}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (query.trim()) onOpenGraph()
                }}
              >
                <SearchInput placeholder="e.g. TRK-042" value={query} onChange={(e) => setQuery(e.target.value)} />
              </form>
            </ToolCard>
            <ToolCard
              icon={ArrowUpRight}
              title="Forward trace"
              description="Raw material → finished goods"
              badge={<Badge tone="success" shape="pill">Ready</Badge>}
              onClick={onOpenForward ?? onOpenGraph}
            />
            <ToolCard
              icon={ArrowDownLeft}
              title="Backward trace"
              description="Finished goods → source material"
              badge={<Badge tone="success" shape="pill">Ready</Badge>}
              onClick={onOpenBackward ?? onOpenGraph}
            />
          </div>
        </SectionPanel>

        <SectionPanel
          title="Material relationships"
          actions={
            <SegmentedFilter<Filter>
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'Verified', label: 'Verified', count: countOf('Verified') },
                { value: 'Pending', label: 'Pending', count: countOf('Pending') },
                { value: 'Mismatch', label: 'Mismatch', count: countOf('Mismatch') },
                { value: 'Not Recorded', label: 'Not Recorded', count: countOf('Not Recorded') }
              ]}
            />
          }
        >
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            onRowClick={(row) => (row.kind === 'batch' && onOpenBatch ? onOpenBatch() : onOpenGraph())}
            footer={`Showing ${rows.length} of ${relationships.length} relationships`}
            note={
              <>
                <FlaskConical className="w-3.5 h-3.5" />
                Blockchain proof data on this screen is simulated for design illustration.
              </>
            }
          />
        </SectionPanel>

        <p className="text-xs text-ink">
          <span className="font-semibold text-ink-strong">Recorded</span> means the record is stored in ORBIS.{' '}
          <span className="font-semibold text-ink-strong">Integrity Status</span> shows whether it still matches its
          blockchain proof.
        </p>
      </div>
    </>
  )
}
