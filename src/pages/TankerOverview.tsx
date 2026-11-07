import React, { useMemo, useState } from 'react'
import { ChevronRight, Clock, Milk, TriangleAlert, Truck } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionPanel } from '../components/common/SectionPanel'
import { StatCard } from '../components/common/StatCard'
import { DataTable, type DataTableColumn } from '../components/common/DataTable'
import { EntityCell } from '../components/common/EntityCell'
import { Badge } from '../components/ui/Badge'
import { SegmentedFilter } from '../components/ui/SegmentedFilter'
import { SearchInput } from '../components/ui/SearchInput'
import { getStatusStyle } from '../lib/status'

interface TankerOverviewProps {
  onSelectTanker: (tankerId: string) => void
}

interface TankerRow {
  id: string
  farm: string
  eta: string
  volume: string
  status: string
  destination: string
}

const tankers: TankerRow[] = [
  { id: 'TRK-042', farm: 'Farm Cooperative A', eta: '09:20', volume: '8,200 L', status: 'Lab Test', destination: 'ST-04' },
  { id: 'TRK-043', farm: 'Farm Cooperative B', eta: '10:10', volume: '6,300 L', status: 'On The Way', destination: 'AT-02' },
  { id: 'TRK-044', farm: 'Farm Cooperative A', eta: '11:00', volume: '5,400 L', status: 'Sampling', destination: 'ST-02' },
  { id: 'TRK-045', farm: 'Farm Cooperative C', eta: '11:40', volume: '4,800 L', status: 'Delayed +35 min', destination: 'ST-07' }
]

type Filter = 'all' | 'en-route' | 'lab' | 'delayed'

const matchesFilter = (row: TankerRow, filter: Filter) => {
  const s = row.status.toLowerCase()
  if (filter === 'en-route') return s.startsWith('on the way')
  if (filter === 'lab') return s.startsWith('lab') || s.startsWith('sampling')
  if (filter === 'delayed') return s.startsWith('delayed')
  return true
}

export const TankerOverview: React.FC<TankerOverviewProps> = ({ onSelectTanker }) => {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const rows = useMemo(
    () =>
      tankers.filter(
        (t) =>
          matchesFilter(t, filter) &&
          (query === '' || `${t.id} ${t.farm} ${t.destination}`.toLowerCase().includes(query.toLowerCase()))
      ),
    [filter, query]
  )

  const columns: DataTableColumn<TankerRow>[] = [
    {
      key: 'id',
      header: 'Tanker',
      render: (row) => (
        <EntityCell
          icon={Truck}
          id={row.id}
          type={row.farm}
          tone={getStatusStyle(row.status).tone === 'danger' ? 'danger' : 'neutral'}
          mono
        />
      )
    },
    { key: 'eta', header: 'ETA', render: (row) => <span className="tabular-nums">{row.eta}</span> },
    { key: 'volume', header: 'Volume', align: 'right', render: (row) => <span className="tabular-nums font-semibold">{row.volume}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
    { key: 'destination', header: 'Destination', render: (row) => <span className="font-mono text-xs">{row.destination}</span> },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: () => <ChevronRight className="w-4 h-4 text-gray-300 inline" />
    }
  ]

  return (
    <>
      <PageHeader title="Incoming tanker monitoring" description="Monitor raw milk availability from farm through storage" />

      <div className="space-y-5">
        <SectionPanel title="Today" subtitle="Raw milk intake · 06:00–06:00 period">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={Milk} label="Incoming milk" value="31,600 L" caption="6 tankers scheduled" />
            <StatCard icon={Truck} label="Received" value="2" caption="Receiving active" captionStatus="Active" />
            <StatCard icon={Clock} label="In lab" value="2" caption="Release by QA team" captionStatus="Pending" />
            <StatCard icon={TriangleAlert} label="Delayed" value="1" caption="TRK-045 · +35 min" captionStatus="Delayed" />
          </div>
        </SectionPanel>

        <SectionPanel title="Tanker queue" subtitle="Select a tanker to follow it through lab and unloading">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            onRowClick={(row) => onSelectTanker(row.id)}
            toolbar={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                <SegmentedFilter
                  value={filter}
                  onChange={setFilter}
                  options={[
                    { value: 'all', label: 'All', count: tankers.length },
                    { value: 'en-route', label: 'On the way', count: tankers.filter((t) => matchesFilter(t, 'en-route')).length },
                    { value: 'lab', label: 'Sampling & lab', count: tankers.filter((t) => matchesFilter(t, 'lab')).length },
                    { value: 'delayed', label: 'Delayed', count: tankers.filter((t) => matchesFilter(t, 'delayed')).length }
                  ]}
                />
                <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tanker, farm, tank" size="sm" className="sm:w-64" />
              </div>
            }
            footer={`Showing ${rows.length} of ${tankers.length} tankers`}
            note="Synthetic Demo Data"
          />
        </SectionPanel>
      </div>
    </>
  )
}
