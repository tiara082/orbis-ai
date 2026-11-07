import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { describeFinishedSku } from '../../data/reference'
import { ASSET_STATES, PRODUCTION_ACTUALS, PRODUCTION_ORDERS, SCENARIO, type AssetState, type ProductionActual } from '../../data/scenario'
import { packsToLiters } from '../../domain/products'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { MachineTable } from './-components/AssetTables'
import { ScenarioNote } from '../../components/common/SourceNote'

export const Route = createFileRoute('/operational-data/production-actual')({ component: ProductionActualPage })

const orderOf = (orderId: string) => PRODUCTION_ORDERS.find((order) => order.id === orderId)

function ProductionActualPage() {
  const { t } = useTranslation()
  const fmt = useFormat()

  const yieldPct = (row: ProductionActual) => (row.goodPacks / (row.goodPacks + row.rejectPacks)) * 100
  const sku = (row: ProductionActual) => orderOf(row.orderId)?.finishedSkuId ?? ''

  const columns: DataTableColumn<ProductionActual>[] = [
    { key: 'orderId', header: t('col.order'), type: 'mono', sortable: true },
    { key: 'lineId', header: t('col.line'), type: 'mono', sortable: true },
    { key: 'sku', header: t('col.finishedSku'), type: 'mono', value: sku },
    { key: 'start', header: t('col.start'), type: 'number', sortable: true, render: (row) => fmt.time(row.start) },
    { key: 'end', header: t('col.end'), type: 'number', render: (row) => (row.end !== undefined ? fmt.time(row.end) : t('ops.actual.runningSince')) },
    { key: 'goodPacks', header: t('col.goodPacks'), type: 'number', sortable: true, render: (row) => fmt.num(row.goodPacks) },
    { key: 'rejectPacks', header: t('col.rejectPacks'), type: 'number', render: (row) => fmt.num(row.rejectPacks) },
    { key: 'yield', header: t('col.yield'), type: 'number', value: yieldPct, render: (row) => fmt.pct(Math.round(yieldPct(row) * 10) / 10) },
    { key: 'liters', header: t('col.liters'), type: 'number', value: (row) => packsToLiters(sku(row), row.goodPacks), render: (row) => fmt.liters(packsToLiters(sku(row), row.goodPacks)) },
    {
      key: 'progress',
      header: t('col.progress'),
      type: 'number',
      value: (row) => row.goodPacks / (orderOf(row.orderId)?.packs ?? 1),
      render: (row) => fmt.pct(Math.round((row.goodPacks / (orderOf(row.orderId)?.packs ?? 1)) * 100))
    },
    { key: 'status', header: t('col.status'), type: 'status', value: (row) => (row.end !== undefined ? 'completed' : 'running') },
    { key: 'note', header: t('col.note'), render: (row) => (row.note ? <Badge status="warning">{t(`ops.actual.note.${row.note}`)}</Badge> : '—') }
  ]

  const lines = ASSET_STATES.filter((state) => state.assetId.startsWith('FL-'))
  const drawLph = (row: AssetState) => {
    const ml = row.runningSku ? describeFinishedSku(row.runningSku).pack?.sizeMl : undefined
    return ml && row.speedPackph ? (row.speedPackph * ml) / 1000 : undefined
  }

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <DataTable
          title={t('ops.actual.table')}
          subtitle={t('ops.snapshotAt', { time: fmt.time(SCENARIO.snapshot) })}
          columns={columns}
          rows={PRODUCTION_ACTUALS}
          rowKey={(row) => `${row.orderId}-${row.lineId}`}
          note={<ScenarioNote />}
        />
        <MachineTable
          title={t('ops.actual.lines')}
          subtitle={t('ops.actual.linesHint')}
          rows={lines}
          extra={[
            {
              key: 'draw',
              header: t('col.liquidDraw'),
              hint: 'FILLING_SPEED_UNIT',
              type: 'number',
              value: drawLph,
              render: (row) => {
                const value = drawLph(row)
                return value ? fmt.lph(value) : '—'
              }
            }
          ]}
        />
      </div>
    </>
  )
}
