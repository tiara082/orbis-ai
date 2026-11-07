import React from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionPanel } from '../components/common/SectionPanel'
import { DataTable, type DataTableColumn } from '../components/common/DataTable'
import { EntityCell } from '../components/common/EntityCell'
import { Callout } from '../components/common/Callout'
import { Badge } from '../components/ui/Badge'
import { ENTITY_META, type EntityKind } from '../lib/entities'

interface AffectedBatchAnalysisProps {
  onOpenAffectedProducts?: () => void
}

interface AnalysisRow {
  kind: EntityKind
  entity: string
  direction: string
  impact: string
  review: string
  clickable?: boolean
}

const rows: AnalysisRow[] = [
  { kind: 'tanker', entity: 'TRK-042', direction: 'Source → batch', impact: 'Confirmed relationship', review: 'Open' },
  { kind: 'tank', entity: 'ST-04', direction: 'Source → batch', impact: 'Confirmed relationship', review: 'Open' },
  { kind: 'batch', entity: 'B-2026-1030-01', direction: 'Source → finished lot', impact: 'Potentially affected', review: 'Review', clickable: true },
  { kind: 'finished', entity: 'FG-1030-01', direction: 'Forward result', impact: 'Potentially affected', review: 'Hold review' }
]

const columns: DataTableColumn<AnalysisRow>[] = [
  {
    key: 'entity',
    header: 'Entity',
    render: (row) => <EntityCell icon={ENTITY_META[row.kind].icon} id={row.entity} type={ENTITY_META[row.kind].label} mono />
  },
  { key: 'direction', header: 'Trace direction', render: (row) => <span className="font-mono text-xs text-ink">{row.direction}</span> },
  { key: 'impact', header: 'Impact classification', render: (row) => <Badge status={row.impact} variant="outline" /> },
  { key: 'review', header: 'Review', render: (row) => <Badge status={row.review} /> }
]

export const AffectedBatchAnalysis: React.FC<AffectedBatchAnalysisProps> = ({ onOpenAffectedProducts }) => (
  <>
    <PageHeader title="Affected batch analysis" description="Forward and backward trace results for human review" />

    <div className="space-y-5">
      <SectionPanel title="Trace results" subtitle="QI-2026-014 · 4 linked entities">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.entity}
          onRowClick={(row) => row.clickable && onOpenAffectedProducts?.()}
          footer="Select the batch row to review affected products"
        />
      </SectionPanel>

      <Callout
        tone="neutral"
        title="Investigation summary"
        description="Trace relationships are recorded; impact classification remains subject to quality review."
      />
    </div>
  </>
)
