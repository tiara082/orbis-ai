import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { SegmentedFilter } from '../../components/ui/SegmentedFilter'
import { TRANSFERS, type Transfer, type TransferType } from '../../data/scenario'
import { validatePath } from '../../domain/routing'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { ScenarioNote } from '../../components/common/SourceNote'

export const Route = createFileRoute('/milk-traceability/transfers')({ component: TransfersPage })

function PathChips({ path }: { path: string[] }) {
  const { hops } = validatePath(path)
  return (
    <span className="inline-flex flex-wrap items-center gap-0.5">
      {path.map((asset, i) => (
        <span key={`${asset}-${i}`} className="inline-flex items-center gap-0.5">
          {i > 0 && <ChevronRight className={hops[i - 1]?.connection ? 'w-3 h-3 text-gray-300' : 'w-3 h-3 text-danger'} />}
          <span
            title={i > 0 ? hops[i - 1]?.connection?.id : undefined}
            className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-ink-strong"
          >
            {asset}
          </span>
        </span>
      ))}
    </span>
  )
}

function TransfersPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const types = [...new Set(TRANSFERS.map((transfer) => transfer.type))]
  const [type, setType] = useState<'all' | TransferType>('all')
  const rows = type === 'all' ? TRANSFERS : TRANSFERS.filter((transfer) => transfer.type === type)

  const columns: DataTableColumn<Transfer>[] = [
    { key: 'id', header: t('col.transfer'), type: 'mono', sortable: true },
    { key: 'time', header: t('col.time'), type: 'number', sortable: true, render: (row) => fmt.time(row.time) },
    { key: 'fromBatch', header: t('col.fromBatch'), type: 'mono', sortable: true },
    { key: 'toBatch', header: t('col.toBatch'), type: 'mono', sortable: true },
    { key: 'volumeL', header: t('col.volume'), type: 'number', sortable: true, render: (row) => fmt.liters(row.volumeL) },
    { key: 'type', header: t('col.transferType'), sortable: true, render: (row) => <Badge tone="info" icon={null}>{t(`trace.transferType.${row.type}`)}</Badge> },
    { key: 'path', header: t('col.route'), className: 'min-w-[280px]', render: (row) => <PathChips path={row.path} /> },
    {
      key: 'valid',
      header: t('col.routeCheck'),
      hint: 'CONNECTION',
      value: (row) => (validatePath(row.path).valid ? 'valid' : 'invalid'),
      type: 'status'
    }
  ]

  return (
    <>
      <PageHeader />
      <DataTable
        title={t('trace.transfers.table')}
        subtitle={t('trace.transfers.tableHint')}
        toolbar={
          <SegmentedFilter
            value={type}
            onChange={setType}
            options={[
              { value: 'all', label: t('common.all'), count: TRANSFERS.length },
              ...types.map((value) => ({ value, label: t(`trace.transferType.${value}`), count: TRANSFERS.filter((tr) => tr.type === value).length }))
            ]}
          />
        }
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        searchText={(row) => `${row.id} ${row.fromBatch} ${row.toBatch} ${row.path.join(' ')}`}
        note={<ScenarioNote />}
      />
    </>
  )
}
