import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Download,
  Factory,
  GitFork,
  RotateCcw,
  ShieldAlert,
  Tractor
} from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../../components/common/DataTable'
import { ScenarioNote } from '../../../components/common/SourceNote'
import { StatCard } from '../../../components/common/StatCard'
import { StepFlow } from '../../../components/common/StepFlow'
import { SectionPanel, Card } from '../../../components/common/SectionPanel'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { ProgressBar } from '../../../components/ui/ProgressBar'
import { Select } from '../../../components/ui/Select'
import { BATCHES, FARMS, type Batch, type Transfer } from '../../../data/scenario'
import { ancestors, contributionShares, descendants, farmOfTanker } from '../../../domain/genealogy'
import { useFormat } from '../../../lib/format'
import { useTranslation } from '../../../lib/i18n'

interface TraceRow {
  batch: Batch
  /** Share of the target made from this batch (backward), or share of this batch made from the source (forward) */
  share: number
  liters: number
}

const STAGE_ORDER = ['farm', 'tanker', 'raw', 'process', 'storage', 'cream', 'mix', 'aseptic', 'finished']

interface TraceViewProps {
  direction: 'backward' | 'forward'
  batchId?: string
  /** Used when the URL has no batch or an unknown one */
  defaultId: string
}

export function TraceView({ direction, batchId, defaultId }: TraceViewProps) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const navigate = useNavigate()
  const [mockRecallActive, setMockRecallActive] = useState(false)
  const target = BATCHES.find((batch) => batch.id === batchId) ?? BATCHES.find((batch) => batch.id === defaultId)

  const options = BATCHES.filter((batch) =>
    direction === 'backward' ? batch.kind !== 'tanker' && ancestors(batch.id).transfers.length > 0 : descendants(batch.id).transfers.length > 0
  )

  if (!target) return null

  const lineage = direction === 'backward' ? ancestors(target.id) : descendants(target.id)
  const others = lineage.batches.filter((batch) => batch.id !== target.id)
  const forwardShares = direction === 'forward' ? contributionShares(target.id) : undefined

  const rows: TraceRow[] = others.map((batch) => {
    const share = direction === 'backward' ? contributionShares(batch.id).get(target.id) ?? 0 : forwardShares?.get(batch.id) ?? 0
    const liters = direction === 'backward' ? share * target.volumeL : share * batch.volumeL
    return { batch, share, liters }
  })
  rows.sort((a, b) => STAGE_ORDER.indexOf(a.batch.kind) - STAGE_ORDER.indexOf(b.batch.kind))

  const tankers = (direction === 'backward' ? others : [target, ...others]).filter((batch) => batch.kind === 'tanker')
  const farms = [...new Set(tankers.map((batch) => farmOfTanker(batch)))].filter(Boolean) as string[]
  const finished = (direction === 'forward' ? others : [target]).filter((batch) => batch.kind === 'finished')
  const stages = [...new Set([target, ...others].map((batch) => batch.kind))].sort((a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b))
  const flow = direction === 'backward' ? ['farm', ...stages] : stages

  const exportRecallReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Kategori,Batch ID,Aset Pabrik,Material / SKU,Volume (Liter),Porsi Dampak (%),Status Karantina\n' +
      `SUMBER INSIDEN,${target.id},${target.assetId},${target.material},${target.volumeL},100.0%,KONTAMINASI TERDETEKSI\n` +
      rows
        .map(
          (r) =>
            `HILIR TERDAMPAK,${r.batch.id},${r.batch.assetId},${r.batch.material},${Math.round(r.liters)},${(r.share * 100).toFixed(1)}%,QUARANTINE_RECALL`
        )
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Berita_Acara_Mock_Recall_${target.id}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns: DataTableColumn<TraceRow>[] = [
    { key: 'batch', header: t('col.batch'), type: 'mono', value: (row) => row.batch.id, sortable: true },
    { key: 'stage', header: t('col.stage'), value: (row) => STAGE_ORDER.indexOf(row.batch.kind), render: (row) => t(`trace.kind.${row.batch.kind}`), sortable: true },
    { key: 'asset', header: t('col.asset'), type: 'mono', value: (row) => row.batch.assetId },
    { key: 'material', header: t('col.material'), value: (row) => row.batch.material },
    { key: 'volume', header: t('col.batchVolume'), type: 'number', value: (row) => row.batch.volumeL, render: (row) => fmt.liters(row.batch.volumeL) },
    {
      key: 'share',
      header: direction === 'backward' ? t('col.shareOfTarget') : t('col.shareFromSource'),
      hint: t('trace.shareHint'),
      className: 'min-w-[140px]',
      value: (row) => row.share,
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-xs tabular-nums">{fmt.pct(Math.round(row.share * 1000) / 10)}</p>
          <ProgressBar value={row.share * 100} className="mt-1" />
        </div>
      )
    },
    {
      key: 'liters',
      header: direction === 'backward' ? t('col.litersInTarget') : t('col.litersFromSource'),
      type: 'number',
      value: (row) => row.liters,
      sortable: true,
      render: (row) => fmt.liters(Math.round(row.liters))
    },
    {
      key: 'origin',
      header: t('col.source'),
      render: (row) => (row.batch.kind === 'tanker' ? `${row.batch.deliveryId} · ${FARMS.find((f) => f.id === farmOfTanker(row.batch))?.name}` : row.batch.finishedSkuId ?? '—')
    },
    {
      key: 'status',
      header: t('col.status'),
      type: 'status',
      value: (row) => (mockRecallActive ? 'rejected' : row.batch.status),
      render: (row) =>
        mockRecallActive ? (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
            QUARANTINE / RECALL
          </span>
        ) : (
          <Badge status={row.batch.status} />
        )
    }
  ]

  const transferColumns: DataTableColumn<Transfer>[] = [
    { key: 'id', header: t('col.transfer'), type: 'mono' },
    { key: 'time', header: t('col.time'), type: 'number', sortable: true, render: (row) => fmt.time(row.time) },
    { key: 'fromBatch', header: t('col.fromBatch'), type: 'mono' },
    { key: 'toBatch', header: t('col.toBatch'), type: 'mono' },
    { key: 'volumeL', header: t('col.volume'), type: 'number', render: (row) => fmt.liters(row.volumeL) },
    { key: 'type', header: t('col.transferType'), render: (row) => t(`trace.transferType.${row.type}`) },
    { key: 'path', header: t('col.route'), className: 'min-w-[280px]', render: (row) => <span className="font-mono text-[11px]">{row.path.join(' → ')}</span> }
  ]

  const setBatch = (id: string) => {
    setMockRecallActive(false)
    void navigate({ to: direction === 'backward' ? '/milk-traceability/backward' : '/milk-traceability/forward', search: { batch: id } })
  }

  return (
    <div className="space-y-5">
      {/* SELECTION & MOCK RECALL TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-ink-strong">{direction === 'backward' ? t('trace.pickTarget') : t('trace.pickSource')}</p>
          <Select
            className="w-72"
            value={target.id}
            onChange={setBatch}
            aria-label={t('col.batch')}
            options={options.map((batch) => ({ value: batch.id, label: `${batch.id} · ${t(`trace.kind.${batch.kind}`)} · ${fmt.liters(batch.volumeL)}` }))}
          />
        </div>

        {direction === 'forward' && (
          <div className="flex items-center gap-2">
            {!mockRecallActive ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setMockRecallActive(true)}
                className="inline-flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                Simulasi 1-Click Mock Recall
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMockRecallActive(false)}
                className="inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Simulasi Karantina
              </Button>
            )}
          </div>
        )}
      </div>

      {/* EMERGENCY MOCK RECALL BANNER */}
      {mockRecallActive && (
        <div className="p-4 rounded-xl border-2 border-red-500 bg-red-50/90 text-red-950 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-200 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-800">
                  Protokol Karantina Pangan & Mock Recall Aktif (Standar BPOM / ISO 22000)
                </p>
                <p className="text-sm font-semibold text-red-950">
                  Simulasi Kontaminasi Terdeteksi pada Batch Sumber: {target.id} ({target.material})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-red-600 text-white shadow-xs">
                QUARANTINE LOCKED
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={exportRecallReport}
                className="bg-white text-red-900 border-red-300 hover:bg-red-100 text-xs inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Berita Acara Karantina (CSV)
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white/80 border border-red-200">
              <span className="text-red-700 block text-[11px]">Batch Hilir Terpapar:</span>
              <span className="text-base font-bold font-mono text-red-950">{rows.length} Batch</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/80 border border-red-200">
              <span className="text-red-700 block text-[11px]">Volume Susu Terisolasi:</span>
              <span className="text-base font-bold font-mono text-red-950">{fmt.liters(target.volumeL)}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/80 border border-red-200">
              <span className="text-red-700 block text-[11px]">SKU Kemasan Terblokir:</span>
              <span className="text-base font-bold font-mono text-red-950">{finished.length} SKU Jadi</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/80 border border-red-200">
              <span className="text-red-700 block text-[11px]">Waktu Respon Isolasi:</span>
              <span className="text-base font-bold font-mono text-emerald-800">0.4 Detik (&lt; 4 Jam)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-red-800 border-t border-red-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              Integritas Audit Trail Terverifikasi · Algoritma DAG Traceability mengunci seluruh rute distribusi hilir secara instan.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Tractor} label={t('trace.summary.farms')} value={farms.length} caption={farms.map((id) => FARMS.find((f) => f.id === id)?.name).join(', ') || '—'} />
        <StatCard icon={GitFork} label={t('trace.summary.tankers')} value={tankers.length} caption={tankers.map((b) => b.deliveryId).join(', ') || '—'} />
        <StatCard icon={Boxes} label={t('trace.summary.batches')} value={others.length} caption={t('trace.summary.transfers', { count: lineage.transfers.length })} />
        <StatCard
          icon={Factory}
          label={t('trace.summary.finished')}
          value={finished.length}
          caption={finished.map((b) => b.id).join(', ') || '—'}
          captionTone={direction === 'forward' && finished.length > 0 ? (mockRecallActive ? 'danger' : 'warning') : 'neutral'}
        />
      </div>

      <SectionPanel title={t('trace.path')} subtitle={direction === 'backward' ? t('trace.pathBackward') : t('trace.pathForward')}>
        <Card className="p-4">
          <StepFlow
            steps={flow.map((kind) => ({
              label: t(`trace.kind.${kind}`),
              detail:
                kind === 'farm'
                  ? farms.map((id) => FARMS.find((f) => f.id === id)?.name).join(', ')
                  : [target, ...others].filter((b) => b.kind === kind).map((b) => b.id).join(', '),
              tone: kind === target.kind ? (mockRecallActive ? 'danger' : 'brand') : 'neutral'
            }))}
          />
        </Card>
      </SectionPanel>

      <DataTable
        title={direction === 'backward' ? t('trace.backwardTable', { id: target.id }) : t('trace.forwardTable', { id: target.id })}
        subtitle={mockRecallActive ? 'Seluruh batch hilir di bawah ini berstatus QUARANTINE / RECALL' : t('trace.shareHint')}
        columns={columns}
        rows={rows}
        rowKey={(row) => row.batch.id}
        note={<ScenarioNote />}
      />
      <DataTable title={t('trace.lineageTransfers')} columns={transferColumns} rows={lineage.transfers} rowKey={(row) => row.id} dense />
    </div>
  )
}
