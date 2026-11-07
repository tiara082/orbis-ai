import React, { useMemo, useState } from 'react'
import { ChevronRight, CircleCheck, Plus, SearchCheck, TriangleAlert } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionPanel } from '../components/common/SectionPanel'
import { StatCard } from '../components/common/StatCard'
import { DataTable, type DataTableColumn } from '../components/common/DataTable'
import { EntityCell } from '../components/common/EntityCell'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { SegmentedFilter } from '../components/ui/SegmentedFilter'

interface QualityInvestigationOverviewProps {
  onSelectInvestigation: (id: string) => void
}

interface InvestigationRow {
  id: string
  category: string
  entity: string
  opened: string
  status: string
}

const investigations: InvestigationRow[] = [
  { id: 'QI-2026-014', category: 'Lab result review', entity: 'TRK-042 / ST-04', opened: '30 Oct 2026', status: 'Under Investigation' },
  { id: 'QI-2026-013', category: 'Process deviation', entity: 'B-2026-1029-06', opened: '29 Oct 2026', status: 'Closed' },
  { id: 'QI-2026-012', category: 'Packaging observation', entity: 'FG-1029-04', opened: '29 Oct 2026', status: 'Potentially Affected' }
]

type Filter = 'all' | 'open' | 'closed'

export const QualityInvestigationOverview: React.FC<QualityInvestigationOverviewProps> = ({ onSelectInvestigation }) => {
  const [filter, setFilter] = useState<Filter>('all')

  const rows = useMemo(
    () =>
      investigations.filter((row) =>
        filter === 'all' ? true : filter === 'closed' ? row.status === 'Closed' : row.status !== 'Closed'
      ),
    [filter]
  )

  const columns: DataTableColumn<InvestigationRow>[] = [
    {
      key: 'id',
      header: 'Investigation',
      render: (row) => <EntityCell icon={SearchCheck} id={row.id} type={row.category} mono />
    },
    { key: 'entity', header: 'Affected entity', render: (row) => <span className="font-mono text-xs">{row.entity}</span> },
    { key: 'opened', header: 'Opened', render: (row) => <span className="text-ink">{row.opened}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
    { key: 'action', header: '', align: 'right', render: () => <ChevronRight className="w-4 h-4 text-gray-300 inline" /> }
  ]

  return (
    <>
      <PageHeader
        title="Quality investigation"
        description="Use traceability to separate confirmed and potential impact"
        actions={
          <Button icon={Plus} onClick={() => onSelectInvestigation('QI-2026-014')}>
            Create investigation
          </Button>
        }
      />

      <div className="space-y-5">
        <SectionPanel title="Summary">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <StatCard icon={SearchCheck} label="Open investigations" value="2" caption="Start from material, batch or lot" captionTone="brand" />
            <StatCard icon={TriangleAlert} label="Potentially affected lots" value="1" caption="Hold review required" captionStatus="Warning" />
            <StatCard icon={CircleCheck} label="Closed this week" value="1" caption="QI-2026-013" captionStatus="Closed" />
          </div>
        </SectionPanel>

        <SectionPanel title="Investigations">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            onRowClick={(row) => onSelectInvestigation(row.id)}
            toolbar={
              <SegmentedFilter
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'all', label: 'All', count: investigations.length },
                  { value: 'open', label: 'Open', count: investigations.filter((r) => r.status !== 'Closed').length },
                  { value: 'closed', label: 'Closed', count: investigations.filter((r) => r.status === 'Closed').length }
                ]}
              />
            }
            footer={`Showing ${rows.length} of ${investigations.length} investigations`}
          />
        </SectionPanel>
      </div>
    </>
  )
}
