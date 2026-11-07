import { useNavigate } from '@tanstack/react-router'
import { Boxes, Factory, GitFork, Tractor } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../../components/common/DataTable'
import { ScenarioNote } from '../../../components/common/SourceNote'
import { StatCard } from '../../../components/common/StatCard'
import { StepFlow } from '../../../components/common/StepFlow'
import { SectionPanel, Card } from '../../../components/common/SectionPanel'
import { ProgressBar } from '../../../components/ui/ProgressBar'
import { Select } from '../../../components/ui/Select'
import { FARMS, type Batch, type Transfer } from '../../../data/scenario'
import type { TraceabilitySnapshot } from '../../../data/traceability'
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
  snapshot: TraceabilitySnapshot
}

export function TraceView({ direction, batchId, defaultId, snapshot }: TraceViewProps) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const navigate = useNavigate()
  const target = snapshot.batches.find((batch) => batch.id === batchId) ?? snapshot.batches.find((batch) => batch.id === defaultId)

  const options = snapshot.batches.filter((batch) =>
    direction === 'backward' ? batch.kind !== 'tanker' && ancestors(batch.id, snapshot).transfers.length > 0 : descendants(batch.id, snapshot).transfers.length > 0
  )

  if (!target) return null

  const lineage = direction === 'backward' ? ancestors(target.id, snapshot) : descendants(target.id, snapshot)
  const others = lineage.batches.filter((batch) => batch.id !== target.id)
  const forwardShares = direction === 'forward' ? contributionShares(target.id, snapshot) : undefined

  const rows: TraceRow[] = others.map((batch) => {
    const share = direction === 'backward' ? contributionShares(batch.id, snapshot).get(target.id) ?? 0 : forwardShares?.get(batch.id) ?? 0
    const liters = direction === 'backward' ? share * target.volumeL : share * batch.volumeL
    return { batch, share, liters }
  })
  rows.sort((a, b) => STAGE_ORDER.indexOf(a.batch.kind) - STAGE_ORDER.indexOf(b.batch.kind))

  const tankers = (direction === 'backward' ? others : [target, ...others]).filter((batch) => batch.kind === 'tanker')
  const farms = [...new Set(tankers.map((batch) => farmOfTanker(batch, snapshot)))].filter(Boolean) as string[]
  const finished = (direction === 'forward' ? others : [target]).filter((batch) => batch.kind === 'finished')
  const stages = [...new Set([target, ...others].map((batch) => batch.kind))].sort((a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b))
  const flow = direction === 'backward' ? ['farm', ...stages] : stages

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
      render: (row) => (row.batch.kind === 'tanker' ? `${row.batch.deliveryId} · ${FARMS.find((f) => f.id === farmOfTanker(row.batch, snapshot))?.name}` : row.batch.finishedSkuId ?? '—')
    },
    { key: 'status', header: t('col.status'), type: 'status', value: (row) => row.batch.status }
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

  const setBatch = (id: string) => void navigate({ to: direction === 'backward' ? '/milk-traceability/backward' : '/milk-traceability/forward', search: { batch: id } })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-sm font-semibold text-ink-strong">{direction === 'backward' ? t('trace.pickTarget') : t('trace.pickSource')}</p>
        <Select
          className="w-72"
          value={target.id}
          onChange={setBatch}
          aria-label={t('col.batch')}
          options={options.map((batch) => ({ value: batch.id, label: `${batch.id} · ${t(`trace.kind.${batch.kind}`)} · ${fmt.liters(batch.volumeL)}` }))}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Tractor} label={t('trace.summary.farms')} value={farms.length} caption={farms.map((id) => FARMS.find((f) => f.id === id)?.name).join(', ') || '—'} />
        <StatCard icon={GitFork} label={t('trace.summary.tankers')} value={tankers.length} caption={tankers.map((b) => b.deliveryId).join(', ') || '—'} />
        <StatCard icon={Boxes} label={t('trace.summary.batches')} value={others.length} caption={t('trace.summary.transfers', { count: lineage.transfers.length })} />
        <StatCard
          icon={Factory}
          label={t('trace.summary.finished')}
          value={finished.length}
          caption={finished.map((b) => b.id).join(', ') || '—'}
          captionTone={direction === 'forward' && finished.length > 0 ? 'warning' : 'neutral'}
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
              tone: kind === target.kind ? 'brand' : 'neutral'
            }))}
          />
        </Card>
      </SectionPanel>

      <DataTable
        title={direction === 'backward' ? t('trace.backwardTable', { id: target.id }) : t('trace.forwardTable', { id: target.id })}
        subtitle={t('trace.shareHint')}
        columns={columns}
        rows={rows}
        rowKey={(row) => row.batch.id}
        note={<ScenarioNote />}
      />
      <DataTable title={t('trace.lineageTransfers')} columns={transferColumns} rows={lineage.transfers} rowKey={(row) => row.id} dense />
    </div>
  )
}
