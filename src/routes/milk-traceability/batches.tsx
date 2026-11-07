import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Select'
import { BATCHES, type Batch, type BatchKind } from '../../data/scenario'
import { farmOfTanker, massBalance } from '../../domain/genealogy'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { ScenarioNote } from '../../components/common/SourceNote'
import { BatchDrawer } from './-components/BatchDrawer'

export const Route = createFileRoute('/milk-traceability/batches')({ component: BatchesPage })

const KINDS: BatchKind[] = ['tanker', 'raw', 'process', 'storage', 'cream', 'mix', 'aseptic', 'finished']

function BatchesPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const [kind, setKind] = useState<'all' | BatchKind>('all')
  const [selected, setSelected] = useState<Batch | null>(null)

  const rows = kind === 'all' ? BATCHES : BATCHES.filter((batch) => batch.kind === kind)

  const columns: DataTableColumn<Batch>[] = [
    { key: 'id', header: t('col.batch'), type: 'mono', sortable: true },
    { key: 'kind', header: t('col.stage'), sortable: true, render: (row) => t(`trace.kind.${row.kind}`) },
    { key: 'assetId', header: t('col.asset'), type: 'mono', sortable: true },
    { key: 'material', header: t('col.material'), sortable: true },
    { key: 'volumeL', header: t('col.volume'), type: 'number', sortable: true, render: (row) => fmt.liters(row.volumeL) },
    { key: 'date', header: t('col.productionDate'), value: (row) => row.dayOffset, render: (row) => fmt.shortDate(row.dayOffset) },
    { key: 'source', header: t('col.source'), render: (row) => (row.kind === 'tanker' ? `${row.deliveryId} · ${farmOfTanker(row)}` : row.finishedSkuId ?? '—') },
    {
      key: 'balance',
      header: t('col.massBalance'),
      hint: 'MASS_BALANCE',
      value: (row) => Math.abs(massBalance(row.id).variance),
      render: (row) => <Badge status={Math.abs(massBalance(row.id).variance) < 1 ? 'pass' : 'warning'} />
    },
    { key: 'status', header: t('col.status'), type: 'status', sortable: true }
  ]

  return (
    <>
      <PageHeader />
      <DataTable
        title={t('trace.batches.table')}
        subtitle={t('trace.batches.tableHint')}
        toolbar={
          <Select
            className="w-44"
            value={kind}
            onChange={(value) => setKind(value as 'all' | BatchKind)}
            aria-label={t('col.stage')}
            options={[
              { value: 'all', label: t('trace.allStages', { count: BATCHES.length }) },
              ...KINDS.map((k) => ({ value: k, label: `${t(`trace.kind.${k}`)} (${BATCHES.filter((b) => b.kind === k).length})` }))
            ]}
          />
        }
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        onRowClick={setSelected}
        selectedKey={selected?.id}
        searchText={(row) => `${row.id} ${row.assetId} ${row.material} ${row.deliveryId ?? ''}`}
        note={<ScenarioNote />}
      />
      {selected && <BatchDrawer batch={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
