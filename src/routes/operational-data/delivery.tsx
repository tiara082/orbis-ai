import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2,
  Clock,
  Database,
  Milk,
  Plus,
  RefreshCw,
  Thermometer,
  TriangleAlert,
  Truck
} from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { DetailDrawer, DrawerSection } from '../../components/common/DetailDrawer'
import { Modal } from '../../components/common/Modal'
import { KeyValueList } from '../../components/common/KeyValueList'
import { StatCard } from '../../components/common/StatCard'
import { StepFlow, type FlowStep } from '../../components/common/StepFlow'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Select } from '../../components/ui/Select'
import { DELIVERIES, FARMS, type Delivery } from '../../data/scenario'
import { delayMin, deliveryStatus, labOf, unloadDurationMin, type DeliveryStatus } from '../../domain/receiving'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { ScenarioNote } from '../../components/common/SourceNote'
import {
  createTankerDelivery,
  fetchTankerDeliveries,
  updateTankerDelivery,
  type RemoteTankerDelivery
} from '../../services/supabaseService'

export const Route = createFileRoute('/operational-data/delivery')({ component: DeliveryPage })

const farmName = (farmId: string) => FARMS.find((farm) => farm.id === farmId)?.name ?? farmId

function DeliveryPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const [deliveries, setDeliveries] = useState<Delivery[]>(DELIVERIES)
  const [selected, setSelected] = useState<Delivery | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cloudSynced, setCloudSynced] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  // Form states for new tanker delivery
  const [tankerId, setTankerId] = useState('')
  const [plateNumber, setPlateNumber] = useState('N 8892 BC')
  const [farmId, setFarmId] = useState('FARM-A')
  const [volumeL, setVolumeL] = useState(15000)
  const [truckCapacityL, setTruckCapacityL] = useState(15000)
  const [tempC, setTempC] = useState(3.6)
  const [alcoholTest, setAlcoholTest] = useState<'negative_75' | 'positive'>('negative_75')
  const [bayId, setBayId] = useState('UB-01')
  const [destSilo, setDestSilo] = useState('RMT-01')
  const [deliveryState, setDeliveryState] = useState<DeliveryStatus>('arrived')

  // Load from Supabase on mount
  useEffect(() => {
    async function loadRemoteTankers() {
      try {
        const remote = await fetchTankerDeliveries()
        if (remote && remote.length > 0) {
          setCloudSynced(true)
          const mapped: Delivery[] = remote.map((r: RemoteTankerDelivery) => {
            const depTime = new Date(r.departure_time)
            const etaTime = new Date(r.eta)
            const arrTime = r.actual_arrival ? new Date(r.actual_arrival) : undefined

            const depMin = depTime.getHours() * 60 + depTime.getMinutes()
            const etaMin = etaTime.getHours() * 60 + etaTime.getMinutes()
            const arrMin = arrTime ? arrTime.getHours() * 60 + arrTime.getMinutes() : undefined

            return {
              id: r.tanker_id,
              farmId: r.farm_id,
              volumeL: Number(r.volume_l),
              truckCapacityL: Number(r.truck_capacity || 15000),
              departure: depMin || 180,
              eta: etaMin || 300,
              arrival: arrMin,
              bayId: r.bay_id || undefined,
              destinations: [{ tankId: 'RMT-01', volumeL: Number(r.volume_l) }]
            }
          })

          setDeliveries((current) => {
            const map = new Map(current.map((d) => [d.id, d]))
            mapped.forEach((m) => map.set(m.id, m))
            return Array.from(map.values())
          })
        }
      } catch (err) {
        console.warn('Could not load remote tanker deliveries:', err)
      }
    }
    loadRemoteTankers()
  }, [])

  const sum = (rows: Delivery[]) => rows.reduce((total, delivery) => total + delivery.volumeL, 0)
  const stored = deliveries.filter((d) => deliveryStatus(d) === 'stored')
  const pending = deliveries.filter((d) => deliveryStatus(d) === 'lab pending')
  const onTheWay = deliveries.filter((d) => deliveryStatus(d) === 'on the way')
  const late = deliveries.filter((d) => (delayMin(d) ?? 0) > 0)

  const handleCreateTanker = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const newId = tankerId.trim() || `TRK-A${(deliveries.length + 1).toString().padStart(2, '0')}`
    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()

    const newDelivery: Delivery = {
      id: newId,
      farmId,
      volumeL,
      truckCapacityL,
      departure: Math.max(0, nowMin - 120),
      eta: nowMin,
      arrival: deliveryState !== 'on the way' ? nowMin : undefined,
      bayId: bayId || undefined,
      destinations: [{ tankId: destSilo, volumeL }]
    }

    setDeliveries((prev) => [newDelivery, ...prev])
    setIsFormOpen(false)
    setFeedback(`Truk tangki ${newId} berhasil dicatat ke sistem.`)
    setTimeout(() => setFeedback(null), 6000)

    try {
      const depDate = new Date()
      depDate.setHours(depDate.getHours() - 2)
      const etaDate = new Date()

      let dbStatus = 'arrived'
      if (deliveryState === 'on the way') dbStatus = 'on_the_way'
      else if (deliveryState === 'stored') dbStatus = 'stored'
      else if (deliveryState === 'lab pending') dbStatus = 'lab_test'

      await createTankerDelivery({
        tanker_id: newId,
        farm_id: farmId,
        plate_number: plateNumber,
        volume_l: volumeL,
        truck_capacity: truckCapacityL,
        departure_time: depDate.toISOString(),
        eta: etaDate.toISOString(),
        actual_arrival: deliveryState !== 'on the way' ? now.toISOString() : null,
        bay_id: bayId,
        status: dbStatus
      })
      setCloudSynced(true)
    } catch (err) {
      console.warn('Failed to save tanker delivery to Supabase:', err)
    } finally {
      setIsSubmitting(false)
      setTankerId('')
    }
  }

  const handleUpdateStatus = async (deliveryId: string, newStatus: DeliveryStatus) => {
    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()

    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== deliveryId) return d
        if (newStatus === 'arrived') {
          return { ...d, arrival: nowMin }
        }
        if (newStatus === 'stored') {
          return { ...d, unloadStart: d.unloadStart ?? nowMin - 30, unloadEnd: nowMin }
        }
        return d
      })
    )

    if (selected && selected.id === deliveryId) {
      setSelected((prev) => {
        if (!prev) return null
        if (newStatus === 'arrived') return { ...prev, arrival: nowMin }
        if (newStatus === 'stored') return { ...prev, unloadStart: prev.unloadStart ?? nowMin - 30, unloadEnd: nowMin }
        return prev
      })
    }

    try {
      let dbStatus = 'arrived'
      if (newStatus === 'stored') dbStatus = 'stored'
      else if (newStatus === 'lab pending') dbStatus = 'lab_test'

      await updateTankerDelivery(deliveryId, {
        status: dbStatus,
        actual_arrival: now.toISOString()
      })
    } catch (err) {
      console.warn('Failed to update tanker status in Supabase:', err)
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <PageHeader />
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Catat Penerimaan Tangki
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Truck} label={t('ops.delivery.trucks')} value={deliveries.length} caption={t('ops.delivery.trucksCaption', { farms: FARMS.length })} />
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
          rows={deliveries}
          rowKey={(row) => row.id}
          onRowClick={setSelected}
          selectedKey={selected?.id}
          searchText={(row) => `${row.id} ${farmName(row.farmId)} ${row.bayId ?? ''}`}
          note={<ScenarioNote />}
        />
      </div>

      {/* DETAIL DRAWER WITH STATUS ACTIONS */}
      {selected && (
        <DeliveryDrawer
          delivery={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={(newStatus) => handleUpdateStatus(selected.id, newStatus)}
        />
      )}

      {isFormOpen && (
        <Modal
          open
          size="lg"
          onClose={() => setIsFormOpen(false)}
          eyebrow="Penerimaan Susu Segar"
          title="Catat Kedatangan Truk Tangki Baru"
          description="Formulir resmi penerimaan susu segar dari peternakan Greenfields (Palaan & Wlingi)."
        >
          <form onSubmit={handleCreateTanker} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-strong mb-1">
                Nomor Truk / Identitas Tangki
              </label>
              <input
                type="text"
                required
                value={tankerId}
                onChange={(e) => setTankerId(e.target.value)}
                placeholder="Contoh: TRK-A04"
                className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg bg-white text-ink-strong focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-strong mb-1">
                Nomor Polisi Kendaraan
              </label>
              <input
                type="text"
                required
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="Contoh: N 8892 BC"
                className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg bg-white text-ink-strong focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-strong mb-1">
                Peternakan Asal (Farm Origin)
              </label>
              <Select
                value={farmId}
                onChange={setFarmId}
                options={[
                  { value: 'FARM-A', label: 'Peternakan Greenfields A (Malang Barat)' },
                  { value: 'FARM-B', label: 'Peternakan Greenfields B (Malang Timur)' }
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-strong mb-1">
                  Volume Muatan Susu (Liter)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={500}
                  value={volumeL}
                  onChange={(e) => setVolumeL(Number(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg bg-white text-ink-strong focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-strong mb-1">
                  Kapasitas Tangki (Liter)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={500}
                  value={truckCapacityL}
                  onChange={(e) => setTruckCapacityL(Number(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg bg-white text-ink-strong focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                />
              </div>
            </div>

            {/* QUALITY CONTROL PARAMETERS */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-bold text-ink-strong uppercase tracking-wider mb-2">
                Pengujian Cepat Mutu & Rantai Dingin
              </p>

              <div className="space-y-3 bg-gray-50/70 p-3 rounded-lg border border-gray-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-ink-strong flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-brand" />
                      Suhu Susu Saat Tiba (°C)
                    </label>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        tempC <= 4.0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tempC <= 4.0 ? 'Suhu Sesuai Standar (<= 4.0°C)' : 'Peringatan: Di Atas Batas (> 4.0°C)'}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    step={0.1}
                    min={0}
                    max={15}
                    value={tempC}
                    onChange={(e) => setTempC(Number(e.target.value))}
                    className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg bg-white text-ink-strong focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-strong mb-1">
                    Uji Alkohol (75%)
                  </label>
                  <Select
                    value={alcoholTest}
                    onChange={(v) => setAlcoholTest(v as 'negative_75' | 'positive')}
                    options={[
                      { value: 'negative_75', label: 'Negatif Alkohol 75% (Lolos - Protein Stabil)' },
                      { value: 'positive', label: 'Positif Alkohol (Tidak Lolos - Ditolak)' }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* ROUTING & SILO DESTINATION */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-strong mb-1">
                  Bay Pembongkaran
                </label>
                <Select
                  value={bayId}
                  onChange={setBayId}
                  options={[
                    { value: 'UB-01', label: 'UB-01 (Unloading Bay 1)' },
                    { value: 'UB-02', label: 'UB-02 (Unloading Bay 2)' },
                    { value: 'UB-03', label: 'UB-03 (Unloading Bay 3)' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-strong mb-1">
                  Silo Tujuan (Raw Milk Silo)
                </label>
                <Select
                  value={destSilo}
                  onChange={setDestSilo}
                  options={[
                    { value: 'RMT-01', label: 'RMT-01 (Raw Milk Tank 1)' },
                    { value: 'RMT-02', label: 'RMT-02 (Raw Milk Tank 2)' },
                    { value: 'RMT-03', label: 'RMT-03 (Raw Milk Tank 3)' }
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-strong mb-1">
                Status Awal Penerimaan
              </label>
              <Select
                value={deliveryState}
                onChange={(v) => setDeliveryState(v as DeliveryStatus)}
                options={[
                  { value: 'arrived', label: 'Tiba di Pabrik (Siap Sampling Lab)' },
                  { value: 'on the way', label: 'Sedang Dalam Perjalanan (On the Way)' },
                  { value: 'lab pending', label: 'Menunggu Hasil Uji Laboratorium' },
                  { value: 'stored', label: 'Selesai Dibongkar ke Silo' }
                ]}
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Menyimpan data...
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    Simpan Penerimaan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

function DeliveryDrawer({
  delivery,
  onClose,
  onUpdateStatus
}: {
  delivery: Delivery
  onClose: () => void
  onUpdateStatus?: (status: DeliveryStatus) => void
}) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const lab = labOf(delivery.id)
  const status = deliveryStatus(delivery)

  const steps: FlowStep[] = [
    { label: t('ops.delivery.step.departure'), detail: fmt.time(delivery.departure), state: 'done' },
    {
      label: t('ops.delivery.step.arrival'),
      detail: delivery.arrival !== undefined ? fmt.time(delivery.arrival) : `ETA ${fmt.time(delivery.eta)}`,
      state: delivery.arrival !== undefined ? 'done' : 'current'
    },
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
    {
      label: t('ops.delivery.step.stored'),
      detail: delivery.destinations.map((d) => d.tankId).join(' + ') || undefined,
      state: status === 'stored' ? 'done' : 'upcoming'
    }
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
      <DrawerSection title="Tindakan Operasional">
        <div className="flex flex-wrap gap-2">
          {status === 'on the way' && onUpdateStatus && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus('arrived')}
              className="text-xs"
            >
              Konfirmasi Truk Tiba
            </Button>
          )}
          {status === 'arrived' && onUpdateStatus && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus('stored')}
              className="text-xs"
            >
              Mulai Bongkar & Simpan ke Silo
            </Button>
          )}
          {status === 'lab pending' && onUpdateStatus && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus('arrived')}
              className="text-xs"
            >
              Rilis Uji Lab (QC Passed)
            </Button>
          )}
          <span className="text-[11px] text-ink self-center ml-auto">
            Status: <span className="font-mono font-medium">{status}</span>
          </span>
        </div>
      </DrawerSection>

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
