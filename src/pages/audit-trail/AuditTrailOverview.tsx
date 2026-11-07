import React from 'react'
import { ChevronRight, Database, History, ShieldCheck, Link2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel } from '../../components/common/SectionPanel'
import { StatCard } from '../../components/common/StatCard'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { EntityCell } from '../../components/common/EntityCell'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

interface AuditTrailOverviewProps {
  onSelectEvent: (eventId: string) => void
  onOpenIntegrityCheck: () => void
}

interface EventRow {
  id: string
  type: string
  timestamp: string
  actor: string
  status: string
}

const events: EventRow[] = [
  { id: 'EVT-1030-882', type: 'Schedule approved', timestamp: '30 Oct 10:42', actor: 'Ana Putri', status: '8/8 verified' },
  { id: 'EVT-1030-881', type: 'Batch created', timestamp: '30 Oct 10:18', actor: 'System', status: '8/8 verified' },
  { id: 'EVT-1030-880', type: 'Tanker received', timestamp: '30 Oct 09:18', actor: 'R. Wijaya', status: '8/8 verified' }
]

export const AuditTrailOverview: React.FC<AuditTrailOverviewProps> = ({ onSelectEvent, onOpenIntegrityCheck }) => {
  const columns: DataTableColumn<EventRow>[] = [
    { key: 'id', header: 'Event', render: (row) => <EntityCell icon={History} id={row.id} type={row.type} mono /> },
    { key: 'timestamp', header: 'Timestamp', render: (row) => <span className="tabular-nums text-ink">{row.timestamp}</span> },
    { key: 'actor', header: 'Actor' },
    { key: 'status', header: 'Integrity', render: (row) => <Badge status="Verified">{row.status}</Badge> },
    { key: 'action', header: '', align: 'right', render: () => <ChevronRight className="w-4 h-4 text-gray-300 inline" /> }
  ]

  return (
    <>
      <PageHeader
        title="Audit trail"
        description="Supporting integrity evidence for operational records"
        actions={
          <Button icon={ShieldCheck} onClick={onOpenIntegrityCheck}>
            Run integrity check
          </Button>
        }
      />

      <div className="space-y-5">
        <SectionPanel title="Ledger health">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <StatCard icon={ShieldCheck} label="Verification indicator" value="8 / 8" valueClassName="text-success" caption="Latest event verified" captionStatus="Verified" />
            <StatCard icon={Database} label="Events recorded" value="1,248" caption="Since 01 Oct 2026" />
            <StatCard icon={Link2} label="Hash chain" value="Intact" caption="No broken references" captionStatus="Match" />
          </div>
        </SectionPanel>

        <SectionPanel title="Recent events">
          <DataTable
            columns={columns}
            rows={events}
            rowKey={(row) => row.id}
            onRowClick={(row) => onSelectEvent(row.id)}
            footer={`Showing ${events.length} of 1,248 events`}
            note="Hash-chained · append-only"
          />
        </SectionPanel>
      </div>
    </>
  )
}
