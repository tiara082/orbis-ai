import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Clock, Milk, Truck, TriangleAlert } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { DetailDrawer, DrawerSection } from '../../components/common/DetailDrawer'
import { KeyValueList } from '../../components/common/KeyValueList'
import { StatCard } from '../../components/common/StatCard'
import { StepFlow, type FlowStep } from '../../components/common/StepFlow'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { DELIVERIES, FARMS, type Delivery } from '../../data/scenario'
import { delayMin, deliveryStatus, labOf, unloadDurationMin } from '../../domain/receiving'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { ScenarioNote } from '../../components/common/SourceNote'

export const Route = createFileRoute('/operational-data/delivery')({ component: DeliveryPage })

const farmName = (farmId: string) => FARMS.find((farm) => farm.id === farmId)?.name ?? farmId

function DeliveryPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const [selected, setSelected] = useState<Delivery | null>(null)

  const sum = (rows: Delivery[]) => rows.reduce((total, delivery) => total + delivery.volumeL, 0)
  const stored = DELIVERIES.filter((d) => deliveryStatus(d) === 'stored')
  const pending = DELIVERIES.filter((d) => deliveryStatus(d) === 'lab pending')
  const onTheWay = DELIVERIES.filter((d) => deliveryStatus(d) === 'on the way')
  const late = DELIVERIES.filter((d) => (delayMin(d) ?? 0) > 0)

  const delayCell = (delivery: Delivery) => {
    const delay = delayMin(delivery)
    if (delay === undefined) return '—'
    if (delay <= 0) return <span className="text-success tabular-nums">{fmt.duration(delay)}</span>
    return <span className="text-danger font-semibold tabular-nums">+{fmt.duration(delay)}</span>
  }

  const columns: DataTableColumn<Delivery>[] = [
    { key: 'id', header: t('col.truck'), type: 'mono', sortable: true },
    { key: 'farm', header: t('col.farm'), sortable: true, value: (row) => farmName(row.farmId) },
    { key: 'volumeL', header: t('col.volume'), type: 'number', sortable: true, render: (row) => fmt.liters(row.volumeL) },
    {
      key: 'fill',
      header: t('col.truckCapacity'),
      className: 'min-w-[150px]',
      value: (row) => row.volumeL / row.truckCapacityL,
      render: (row) => (
        <div>
          <p className="text-xs tabular-nums">
            {fmt.liters(row.truckCapacityL)} · {fmt.pct(Math.round((row.volumeL / row.truckCapacityL) * 100))}
          </p>
          <ProgressBar value={(row.volumeL / row.truckCapacityL) * 100} className="mt-1" />
        </div>
      )
    },
    { key: 'departure', header: t('col.departure'), type: 'number', sortable: true, render: (row) => fmt.time(row.departure) },
    { key: 'eta', header: t('col.eta'), type: 'number', sortable: true, render: (row) => fmt.time(row.eta) },
    { key: 'arrival', header: t('col.arrival'), type: 'number', sortable: true, render: (row) => (row.arrival !== undefined ? fmt.time(row.arrival) : '—') },
    { key: 'delay', header: t('col.delay'), type: 'number', sortable: true, value: (row) => delayMin(row), render: delayCell },
    { key: 'bayId', header: t('col.bay'), type: 'mono' },
    {
      key: 'unload',
      header: t('col.unloading'),
      type: 'number',
      render: (row) => (row.unloadStart !== undefined && row.unloadEnd !== undefined ? fmt.range(row.unloadStart, row.unloadEnd) : '—')
    },
    {
      key: 'duration',
      header: t('col.duration'),
      type: 'number',
      value: (row) => unloadDurationMin(row),
      render: (row) => {
        const duration = unloadDurationMin(row)
        return duration !== undefined ? fmt.duration(duration) : '—'
      }
    },
    { key: 'status', header: t('col.status'), type: 'status', sortable: true, value: (row) => deliveryStatus(row) }
  ]

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Truck} label={t('ops.delivery.trucks')} value={DELIVERIES.length} caption={t('ops.delivery.trucksCaption', { farms: FARMS.length })} />
          <StatCard icon={Milk} label={t('ops.delivery.received')} value={fmt.liters(sum(stored))} caption={t('ops.delivery.receivedCaption', { count: stored.length })} captionStatus="stored" />
          <StatCard
            icon={Clock}
            label={t('ops.delivery.waiting')}
            value={fmt.liters(sum(pending) + sum(onTheWay))}
            caption={t('ops.delivery.waitingCaption', { pending: pending.length, incoming: onTheWay.length })}
            captionStatus="lab pending"
          />
          <StatCard
            icon={TriangleAlert}
            label={t('ops.delivery.late')}
            value={late.length}
            caption={t('ops.delivery.lateCaption')}
            captionTone={late.length ? 'danger' : 'success'}
          />
        </div>

        <DataTable
          title={t('ops.delivery.table')}
          subtitle={t('ops.delivery.tableHint')}
          columns={columns}
          rows={DELIVERIES}
          rowKey={(row) => row.id}
          onRowClick={setSelected}
          selectedKey={selected?.id}
          searchText={(row) => `${row.id} ${farmName(row.farmId)} ${row.bayId ?? ''}`}
          note={<ScenarioNote />}
        />
      </div>

      {selected && <DeliveryDrawer delivery={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function DeliveryDrawer({ delivery, onClose }: { delivery: Delivery; onClose: () => void }) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const lab = labOf(delivery.id)
  const status = deliveryStatus(delivery)

  const steps: FlowStep[] = [
    { label: t('ops.delivery.step.departure'), detail: fmt.time(delivery.departure), state: 'done' },
    { label: t('ops.delivery.step.arrival'), detail: delivery.arrival !== undefined ? fmt.time(delivery.arrival) : `ETA ${fmt.time(delivery.eta)}`, state: delivery.arrival !== undefined ? 'done' : 'current' },
    {
      label: t('ops.delivery.step.lab'),
      detail: lab?.releaseTime !== undefined ? fmt.time(lab.releaseTime) : lab ? t('status.awaiting result') : undefined,
      state: lab?.qcStatus === 'Passed' ? 'done' : lab ? 'current' : 'upcoming'
    },
    {
      label: t('ops.delivery.step.unload'),
      detail: delivery.unloadStart !== undefined && delivery.unloadEnd !== undefined ? fmt.range(delivery.unloadStart, delivery.unloadEnd) : undefined,
      state: delivery.unloadEnd !== undefined ? 'done' : 'upcoming'
    },
    { label: t('ops.delivery.step.stored'), detail: delivery.destinations.map((d) => d.tankId).join(' + ') || undefined, state: status === 'stored' ? 'done' : 'upcoming' }
  ]

  return (
    <DetailDrawer
      open
      onClose={onClose}
      eyebrow={t('ops.delivery.drawerEyebrow')}
      title={
        <span className="flex items-center gap-2">
          {delivery.id} <Badge status={status} />
        </span>
      }
      description={`${farmName(delivery.farmId)} · ${fmt.liters(delivery.volumeL)}`}
    >
      <DrawerSection title={t('ops.delivery.progress')}>
        <StepFlow variant="progress" steps={steps} />
      </DrawerSection>
      <DrawerSection title={t('ops.delivery.details')}>
        <KeyValueList
          items={[
            { label: t('col.truckCapacity'), value: fmt.liters(delivery.truckCapacityL) },
            { label: t('col.departure'), value: fmt.time(delivery.departure) },
            { label: t('col.eta'), value: fmt.time(delivery.eta) },
            { label: t('col.arrival'), value: delivery.arrival !== undefined ? fmt.time(delivery.arrival) : '—' },
            { label: t('col.bay'), value: delivery.bayId ?? '—', mono: true },
            { label: t('col.sample'), value: lab?.sampleId ?? '—', mono: true },
            { label: t('col.qcStatus'), value: lab ? <Badge status={lab.qcStatus} /> : '—' }
          ]}
        />
      </DrawerSection>
      <DrawerSection title={t('ops.delivery.destinations')}>
        {delivery.destinations.length === 0 ? (
          <p className="text-sm text-ink">{t('ops.delivery.noDestination')}</p>
        ) : (
          <KeyValueList items={delivery.destinations.map((d) => ({ label: d.tankId, value: fmt.liters(d.volumeL) }))} />
        )}
        {delivery.destinations.length > 1 && <p className="text-xs text-ink mt-2">{t('ops.delivery.splitNote')}</p>}
      </DrawerSection>
    </DetailDrawer>
  )
}
