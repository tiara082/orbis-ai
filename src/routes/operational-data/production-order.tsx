import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, RefreshCw, CloudCheck, Trash2 } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { DrawerSection } from '../../components/common/DetailDrawer'
import { Modal } from '../../components/common/Modal'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { FINISHED_SKUS, LINE_FINISHED_SKU_COMPATIBILITY, describeFinishedSku } from '../../data/reference'
import { PRODUCTION_ORDERS, type Priority, type ProductionOrder } from '../../data/scenario'
import { isFlavoured, milkRequirement, packsToLiters } from '../../domain/products'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { ScenarioNote } from '../../components/common/SourceNote'
import {
  createProductionOrder,
  deleteProductionOrder,
  fetchProductionOrders
} from '../../services/supabaseService'

export const Route = createFileRoute('/operational-data/production-order')({ component: ProductionOrderPage })

const eligibleLines = (finishedSkuId: string) =>
  LINE_FINISHED_SKU_COMPATIBILITY.filter((row) => row.finishedSkuId === finishedSkuId && row.eligible).map((row) => row.lineId)

function ProductionOrderPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const [orders, setOrders] = useState<ProductionOrder[]>(PRODUCTION_ORDERS)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  // Form state
  const [skuId, setSkuId] = useState(FINISHED_SKUS[0]?.finishedSkuId ?? 'ESL-FC-1000-LOCAL')
  const [packs, setPacks] = useState<number>(10000)
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueHour, setDueHour] = useState<number>(14)

  // Try fetching orders from Supabase on mount
  useEffect(() => {
    async function loadRemoteOrders() {
      try {
        const remoteOrders = await fetchProductionOrders()
        if (remoteOrders && remoteOrders.length > 0) {
          const mapped: ProductionOrder[] = remoteOrders.map((r) => {
            const date = new Date(r.deadline)
            const dueMinutes = date.getHours() * 60 + date.getMinutes()
            const prioMap: Record<number, Priority> = { 1: 'high', 2: 'medium', 3: 'low' }
            return {
              id: r.order_id,
              finishedSkuId: r.finished_sku_id,
              packs: r.pack_count_target || Math.round((r.volume_target_l * 1000) / 1000),
              priority: prioMap[r.priority] || 'medium',
              dayOffset: 0,
              due: dueMinutes || 720
            }
          })
          setOrders((current) => {
            const map = new Map(current.map((o) => [o.id, o]))
            mapped.forEach((m) => map.set(m.id, m))
            return Array.from(map.values())
          })
        }
      } catch (err) {
        console.warn('Could not load remote orders:', err)
      }
    }
    loadRemoteOrders()
  }, [])

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`
    const liters = packsToLiters(skuId, packs)

    const newOrder: ProductionOrder = {
      id: newOrderId,
      finishedSkuId: skuId,
      packs,
      priority,
      dayOffset: 0,
      due: dueHour * 60
    }

    setOrders((prev) => [newOrder, ...prev])
    setIsFormOpen(false)

    try {
      const prioNum = priority === 'high' ? 1 : priority === 'medium' ? 2 : 3
      const deadlineDate = new Date()
      deadlineDate.setHours(dueHour, 0, 0, 0)

      await createProductionOrder({
        order_id: newOrderId,
        finished_sku_id: skuId,
        volume_target_l: liters,
        pack_count_target: packs,
        deadline: deadlineDate.toISOString(),
        priority: prioNum,
        status: 'pending'
      })
      setFeedback(`Order ${newOrderId} berhasil disimpan ke sistem.`)
      setTimeout(() => setFeedback(null), 4000)
    } catch (err) {
      console.warn('Gagal menyimpan order ke database:', err)
      setFeedback(`Order tersimpan di memori sistem.`)
      setTimeout(() => setFeedback(null), 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
    try {
      await deleteProductionOrder(orderId)
    } catch (err) {
      console.warn('Failed to delete order from Supabase:', err)
    }
  }

  const today = orders.filter((order) => order.dayOffset === 0)
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
    { key: 'lines', header: t('col.eligibleLines'), render: (row) => eligibleLines(row.finishedSkuId).join(', ') },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(row.id)
          }}
          className="text-gray-400 hover:text-danger p-1 rounded-md transition-colors cursor-pointer"
          title="Hapus Order"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )
    }
  ]

  return (
    <>
      <PageHeader
        actions={
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Tambah Production Order
          </Button>
        }
      />

      {feedback && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-2.5 text-xs font-medium text-success">
          <CloudCheck className="h-4 w-4" />
          {feedback}
        </div>
      )}

      <DataTable
        title={t('ops.orders.table')}
        subtitle={t('ops.orders.tableHint')}
        columns={columns}
        rows={orders}
        rowKey={(row) => row.id}
        rowClassName={(row) => (row.dayOffset > 0 ? 'text-ink' : undefined)}
        footer={t('ops.orders.footer', { count: today.length, liters: fmt.liters(totalLiters), milk: fmt.liters(totalMilk) })}
        note={<ScenarioNote />}
      />

      <Modal
        title="Tambah Production Order Baru"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      >
        <DrawerSection title="Detail Pesanan">
          <form className="space-y-4" onSubmit={handleCreateOrder}>
            <div>
              <label className="block text-xs font-semibold text-ink-strong mb-1">Pilih Finished SKU</label>
              <Select
                value={skuId}
                onChange={(val) => setSkuId(val)}
                options={FINISHED_SKUS.map((f) => ({
                  value: f.finishedSkuId,
                  label: `${f.finishedSkuId} (${describeFinishedSku(f.finishedSkuId).liquid?.productName || ''})`
                }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-strong mb-1">Target Jumlah Pack</label>
              <input
                type="number"
                min={500}
                step={500}
                value={packs}
                onChange={(e) => setPacks(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-strong focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                required
              />
              <p className="mt-1 text-[11px] text-ink-muted">
                Estimasi volume: <strong>{fmt.liters(packsToLiters(skuId, packs))}</strong> | Kebutuhan susu:{' '}
                <strong>{fmt.liters(milkRequirement(skuId, packs))}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-strong mb-1">Prioritas</label>
              <Select
                value={priority}
                onChange={(val) => setPriority(val as Priority)}
                options={[
                  { value: 'high', label: 'High (Urgent)' },
                  { value: 'medium', label: 'Medium (Normal)' },
                  { value: 'low', label: 'Low (Buffer)' }
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-strong mb-1">Batas Waktu (Due Hour)</label>
              <input
                type="number"
                min={0}
                max={23}
                value={dueHour}
                onChange={(e) => setDueHour(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-strong focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                required
              />
              <p className="mt-1 text-[11px] text-ink-muted">Contoh: 14 = Pukul 14:00 WIB</p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" /> : <Plus className="mr-1.5 h-4 w-4" />}
                Simpan Pesanan
              </Button>
            </div>
          </form>
        </DrawerSection>
      </Modal>
    </>
  )
}
