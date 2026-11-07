import React from 'react'
import { describeFinishedSku } from '../../data/reference'
import type { OrderOutcome, Plan, PlanBlock } from '../../domain/plan'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { DataTable, type DataTableColumn } from '../common/DataTable'
import { Badge } from '../ui/Badge'

interface PlanTableProps {
  plan: Plan
  title?: string
  subtitle?: string
  note?: React.ReactNode
  toolbar?: React.ReactNode
}

const ACTIVITY_TONE = { production: 'info', VARIANT: 'warning', SIZE: 'warning', PAPER: 'warning', CIP: 'neutral', wait: 'neutral' } as const

/** Production schedule rows: one row per production, changeover, CIP, or wait block */
export function PlanBlocksTable({ plan, title, subtitle, note, toolbar }: PlanTableProps) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const rows = [...plan.blocks].sort((a, b) => a.lineId.localeCompare(b.lineId) || a.start - b.start)

  const columns: DataTableColumn<PlanBlock>[] = [
    { key: 'lineId', header: t('col.line'), type: 'mono', sortable: true },
    { key: 'start', header: t('col.start'), type: 'number', sortable: true, render: (row) => fmt.time(row.start) },
    { key: 'end', header: t('col.end'), type: 'number', render: (row) => fmt.time(row.end) },
    { key: 'duration', header: t('col.duration'), type: 'number', value: (row) => row.end - row.start, render: (row) => fmt.duration(row.end - row.start) },
    {
      key: 'activity',
      header: t('col.activity'),
      value: (row) => row.kind,
      render: (row) => (
        <Badge tone={ACTIVITY_TONE[row.kind]} icon={null}>
          {t(`schedule.block.${row.kind}`)}
        </Badge>
      )
    },
    {
      key: 'product',
      header: t('col.product'),
      render: (row) => (row.finishedSkuId ? describeFinishedSku(row.finishedSkuId).liquid?.productName : '—')
    },
    { key: 'orderId', header: t('col.order'), type: 'mono' },
    { key: 'finishedSkuId', header: t('col.finishedSku'), type: 'mono' },
    { key: 'packs', header: t('col.packs'), type: 'number', render: (row) => (row.packs ? fmt.num(Math.round(row.packs)) : '—') },
    { key: 'liters', header: t('col.liters'), type: 'number', render: (row) => (row.liters ? fmt.liters(Math.round(row.liters)) : '—') },
    { key: 'ruleId', header: t('col.rule'), type: 'mono', render: (row) => (row.kind === 'production' ? '—' : row.ruleId) }
  ]

  return (
    <DataTable
      title={title}
      subtitle={subtitle}
      toolbar={toolbar}
      columns={columns}
      rows={rows}
      rowKey={(row) => `${row.lineId}-${row.kind}-${row.start}`}
      rowClassName={(row) => (row.kind === 'production' ? undefined : 'bg-gray-50/60')}
      dense
      note={note}
    />
  )
}

/** One row per production order: when it finishes against its due time */
export function OrderOutcomeTable({ plan, title, subtitle, note }: PlanTableProps) {
  const { t } = useTranslation()
  const fmt = useFormat()

  const columns: DataTableColumn<OrderOutcome>[] = [
    { key: 'orderId', header: t('col.order'), type: 'mono', sortable: true },
    { key: 'finishedSkuId', header: t('col.finishedSku'), type: 'mono' },
    { key: 'lineIds', header: t('col.line'), render: (row) => row.lineIds.join(' + ') },
    { key: 'packs', header: t('col.packs'), type: 'number', render: (row) => fmt.num(Math.round(row.packs)) },
    { key: 'liters', header: t('col.liters'), type: 'number', render: (row) => fmt.liters(Math.round(row.liters)) },
    { key: 'milkL', header: t('col.milkNeed'), type: 'number', render: (row) => fmt.liters(Math.round(row.milkL)) },
    { key: 'start', header: t('col.start'), type: 'number', render: (row) => fmt.time(row.start) },
    { key: 'finish', header: t('col.finish'), type: 'number', sortable: true, render: (row) => fmt.time(row.finish) },
    { key: 'due', header: t('col.due'), type: 'number', render: (row) => fmt.time(row.due) },
    {
      key: 'status',
      header: t('col.status'),
      value: (row) => (row.lateMin > 0 ? 'late' : 'on time'),
      render: (row) =>
        row.lateMin > 0 ? <Badge status="late">{t('schedule.lateBy', { time: fmt.duration(row.lateMin) })}</Badge> : <Badge status="on time" />
    }
  ]

  return (
    <DataTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      rows={plan.orders}
      rowKey={(row) => row.orderId}
      footer={t('schedule.ordersFooter', { count: plan.orders.length, milk: fmt.liters(Math.round(plan.milkRequiredL)), end: fmt.time(plan.end) })}
      dense
      note={note}
    />
  )
}
