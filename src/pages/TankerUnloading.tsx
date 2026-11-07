import React from 'react'
import { ArrowRight, Cylinder, Truck } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionPanel, Card } from '../components/common/SectionPanel'
import { DataTable, type DataTableColumn } from '../components/common/DataTable'
import { Badge } from '../components/ui/Badge'
import { IconTile } from '../components/ui/IconTile'
import { ProgressBar } from '../components/ui/ProgressBar'

interface UnloadEvent {
  event: string
  timestamp: string
  actor: string
  status: string
}

const events: UnloadEvent[] = [
  { event: 'Unloading started', timestamp: '10:02', actor: 'Receiving operator', status: 'Recorded' },
  { event: 'Transfer checkpoint', timestamp: '10:18', actor: 'System', status: 'Recorded' },
  { event: 'Storage confirmation', timestamp: 'Pending', actor: '—', status: 'Open' }
]

const columns: DataTableColumn<UnloadEvent>[] = [
  { key: 'event', header: 'Event', render: (row) => <span className="font-semibold">{row.event}</span> },
  { key: 'timestamp', header: 'Timestamp', render: (row) => <span className="tabular-nums text-ink">{row.timestamp}</span> },
  { key: 'actor', header: 'Actor' },
  { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} variant="outline" /> }
]

export const TankerUnloading: React.FC = () => (
  <>
    <PageHeader title="Unloading detail" description="Track transfer into destination storage tank" />

    <div className="space-y-5">
      <SectionPanel title="Transfer progress" actions={<Badge status="Unloading">60% complete</Badge>}>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <IconTile icon={Truck} />
            <span className="font-mono text-sm font-semibold text-ink-strong">TRK-042</span>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <IconTile icon={Cylinder} tone="brand" />
            <span className="font-mono text-sm font-semibold text-ink-strong">ST-04</span>
          </div>
          <ProgressBar value={60} tone="info" className="mt-5 h-2.5" />
          <div className="mt-2 flex justify-between text-xs text-ink tabular-nums">
            <span>4,920 L transferred</span>
            <span>8,200 L planned</span>
          </div>
        </Card>
      </SectionPanel>

      <SectionPanel title="Unloading events" subtitle="Each event is hashed into the audit ledger">
        <DataTable columns={columns} rows={events} rowKey={(row) => row.event} />
      </SectionPanel>
    </div>
  </>
)
