import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { getLineFinishedSkuCompatibility, describeFinishedSku } from '../../data/reference'
import { PRODUCTION_ORDERS, type ProductionOrder } from '../../data/scenario'
import { isFlavoured, milkRequirement, packsToLiters } from '../../domain/products'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { ScenarioNote } from '../../components/common/SourceNote'

export const Route = createFileRoute('/operational-data/production-order')({ component: ProductionOrderPage })

const eligibleLines = (finishedSkuId: string) =>
  getLineFinishedSkuCompatibility()
    .filter((row) => row.finishedSkuId === finishedSkuId && row.eligible)
    .map((row) => row.lineId)

function ProductionOrderPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const today = PRODUCTION_ORDERS.filter((order) => order.dayOffset === 0)
  const totalLiters = today.reduce((sum, order) => sum + packsToLiters(order.finishedSkuId, order.packs), 0)
  const totalMilk = today.reduce((sum, order) => sum + milkRequirement(order.finishedSkuId, order.packs), 0)

  const columns: DataTableColumn<ProductionOrder>[] = [
    { key: 'id', header: t('col.order'), type: 'mono', sortable: true },
    { key: 'finishedSkuId', header: t('col.finishedSku'), type: 'mono', sortable: true },
    { key: 'product', header: t('col.product'), value: (row) => describeFinishedSku(row.finishedSkuId).liquid?.productName },
    { key: 'pack', header: t('col.sizeMl'), type: 'number', value: (row) => describeFinishedSku(row.finishedSkuId).pack?.sizeMl },
    { key: 'market', header: t('col.market'), value: (row) => describeFinishedSku(row.finishedSkuId).finished?.marketVariant },
    { key: 'packs', header: t('col.packs'), type: 'number', sortable: true, render: (row) => fmt.num(row.packs) },
    {
      key: 'liters',
      header: t('col.liters'),
      type: 'number',
      sortable: true,
      value: (row) => packsToLiters(row.finishedSkuId, row.packs),
      render: (row) => fmt.liters(packsToLiters(row.finishedSkuId, row.packs))
    },
    {
      key: 'milk',
      header: t('col.milkNeed'),
      hint: t('ops.orders.milkHint'),
      type: 'number',
      value: (row) => milkRequirement(row.finishedSkuId, row.packs),
      render: (row) => {
        const liquid = describeFinishedSku(row.finishedSkuId).finished?.liquidSkuId ?? ''
        return (
          <span className="inline-flex items-center gap-1.5">
            {fmt.liters(milkRequirement(row.finishedSkuId, row.packs))}
            <Badge tone={isFlavoured(liquid) ? 'brand' : 'info'} icon={null}>
              {isFlavoured(liquid) ? '90%' : '100%'}
            </Badge>
          </span>
        )
      }
    },
    { key: 'priority', header: t('col.priority'), type: 'status', sortable: true },
    { key: 'due', header: t('col.due'), type: 'number', sortable: true, render: (row) => fmt.time(row.due) },
    { key: 'lines', header: t('col.eligibleLines'), render: (row) => eligibleLines(row.finishedSkuId).join(', ') }
  ]

  return (
    <>
      <PageHeader />
      <DataTable
        title={t('ops.orders.table')}
        subtitle={t('ops.orders.tableHint')}
        columns={columns}
        rows={PRODUCTION_ORDERS}
        rowKey={(row) => row.id}
        rowClassName={(row) => (row.dayOffset > 0 ? 'text-ink' : undefined)}
        footer={t('ops.orders.footer', { count: today.length, liters: fmt.liters(totalLiters), milk: fmt.liters(totalMilk) })}
        note={<ScenarioNote />}
      />
    </>
  )
}
