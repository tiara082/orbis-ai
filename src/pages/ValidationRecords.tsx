import React from 'react'
import { CircleCheck, CircleX, Clock, Rows3, ArrowRight } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionPanel } from '../components/common/SectionPanel'
import { StatCard } from '../components/common/StatCard'
import { DataTable, type DataTableColumn } from '../components/common/DataTable'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

interface ValidationRecordsProps {
  onOpenPreview: () => void
}

interface IssueRow {
  row: string
  field: string
  issue: string
  resolution: string
  status: string
}

const records: IssueRow[] = [
  { row: '#044', field: 'batch_id', issue: 'Missing value', resolution: 'Manual correction', status: 'Review' },
  { row: '#218', field: 'volume_liter', issue: 'Unit ambiguous', resolution: 'Confirm liter', status: 'Review' },
  { row: '#782', field: 'production_date', issue: 'Date format', resolution: 'Parsed automatically', status: 'Validated' }
]

const columns: DataTableColumn<IssueRow>[] = [
  { key: 'row', header: 'Row', render: (row) => <span className="font-mono text-xs font-semibold">{row.row}</span> },
  { key: 'field', header: 'Field', render: (row) => <span className="font-mono text-xs">{row.field}</span> },
  { key: 'issue', header: 'Issue' },
  { key: 'resolution', header: 'Resolution', render: (row) => <span className="text-ink">{row.resolution}</span> },
  { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> }
]

export const ValidationRecords: React.FC<ValidationRecordsProps> = ({ onOpenPreview }) => (
  <>
    <PageHeader
      title="Validate records"
      description="Validation separates structural errors from records needing review"
      actions={
        <Button iconRight={ArrowRight} onClick={onOpenPreview}>
          Open import preview
        </Button>
      }
    />

    <div className="space-y-5">
      <SectionPanel title="Validation summary">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Rows3} label="Records analyzed" value="1,248" caption="production_shift_A.xlsx" />
          <StatCard icon={CircleCheck} label="Valid records" value="1,228" caption="98.4% of total" captionStatus="Valid" />
          <StatCard icon={Clock} label="Need review" value="20" caption="Non-blocking" captionStatus="Review" />
          <StatCard icon={CircleX} label="Blocking errors" value="0" caption="Import allowed" captionTone="success" />
        </div>
      </SectionPanel>

      <SectionPanel title="Issues" subtitle="Records flagged during schema and business-rule checks">
        <DataTable columns={columns} rows={records} rowKey={(row) => row.row} footer={`Showing ${records.length} of 20 issues`} />
      </SectionPanel>
    </div>
  </>
)
