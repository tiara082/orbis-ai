import React from 'react'
import { DataTable, type DataTableColumn } from '../common/DataTable'
import { EntityCell } from '../common/EntityCell'
import { Badge } from '../ui/Badge'
import { ENTITY_META, type EntityKind } from '../../lib/entities'

export interface TraceStep {
  kind: EntityKind
  entity: string
  quantity: string
  timestamp: string
  relationship: string
  integrity: string
}

interface TraceStepsTableProps {
  steps: TraceStep[]
  onRowClick?: (step: TraceStep) => void
}

export const TraceStepsTable: React.FC<TraceStepsTableProps> = ({ steps, onRowClick }) => {
  const columns: DataTableColumn<TraceStep>[] = [
    {
      key: 'step',
      header: 'Step',
      className: 'w-14',
      render: (_, i) => (
        <span className="inline-flex w-6 h-6 rounded-full bg-brand-muted text-brand text-xs font-bold items-center justify-center">
          {i + 1}
        </span>
      )
    },
    {
      key: 'entity',
      header: 'Entity',
      render: (row) => <EntityCell icon={ENTITY_META[row.kind].icon} id={row.entity} type={ENTITY_META[row.kind].label} />
    },
    { key: 'quantity', header: 'Quantity', render: (row) => <span className="tabular-nums">{row.quantity}</span> },
    { key: 'timestamp', header: 'Timestamp', render: (row) => <span className="text-ink">{row.timestamp}</span> },
    { key: 'relationship', header: 'Relationship', render: (row) => <span className="font-mono text-xs">{row.relationship}</span> },
    { key: 'integrity', header: 'Integrity', render: (row) => <Badge status={row.integrity} /> }
  ]

  return (
    <DataTable
      columns={columns}
      rows={steps}
      rowKey={(row) => row.entity}
      onRowClick={onRowClick}
      footer={`${steps.length} hops recorded`}
    />
  )
}
