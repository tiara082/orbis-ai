import { DataTable, type DataTableColumn } from '../../../components/common/DataTable'
import { ProgressBar } from '../../../components/ui/ProgressBar'
import { getAsset } from '../../../data/reference'
import { SCENARIO, type AssetState } from '../../../data/scenario'
import { holdingStatuses, HOLDING_WARNING_MIN } from '../../../domain/checks'
import { useFormat } from '../../../lib/format'
import { useTranslation } from '../../../lib/i18n'
import type { Tone } from '../../../lib/status'
import { ScenarioNote } from '../../../components/common/SourceNote'

interface TableProps {
  title: string
  subtitle?: string
  rows: AssetState[]
  /** Extra columns appended before the status column */
  extra?: DataTableColumn<AssetState>[]
  levelMarker?: (row: AssetState) => number | undefined
  pageSize?: number
}

const levelPct = (row: AssetState) => (row.capacityL ? ((row.volumeL ?? 0) / row.capacityL) * 100 : 0)

/** Storage and buffer tanks: level, flows, HOLDING age, and CIP */
export function TankTable({ title, subtitle, rows, extra = [], levelMarker, pageSize }: TableProps) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const holding = new Map(holdingStatuses().map((status) => [status.assetId, status]))

  const holdingTone = (remaining: number): Tone => (remaining < 0 ? 'danger' : remaining < HOLDING_WARNING_MIN ? 'warning' : 'success')

  const columns: DataTableColumn<AssetState>[] = [
    { key: 'assetId', header: t('col.tank'), type: 'mono', sortable: true },
    { key: 'capacityL', header: t('col.capacity'), type: 'number', render: (row) => (row.capacityL ? fmt.liters(row.capacityL) : '—') },
    { key: 'volumeL', header: t('col.volume'), type: 'number', sortable: true, render: (row) => fmt.liters(row.volumeL ?? 0) },
    {
      key: 'level',
      header: t('col.level'),
      className: 'min-w-[130px]',
      value: levelPct,
      sortable: true,
      render: (row) => {
        const marker = levelMarker?.(row)
        const pct = levelPct(row)
        return (
          <div>
            <p className="text-xs tabular-nums">{fmt.pct(Math.round(pct))}</p>
            <ProgressBar value={pct} marker={marker} tone={marker !== undefined && pct < marker ? 'warning' : 'brand'} className="mt-1" />
          </div>
        )
      }
    },
    { key: 'material', header: t('col.material'), render: (row) => row.material ?? '—' },
    { key: 'batchId', header: t('col.batch'), type: 'mono' },
    { key: 'inflowLph', header: t('col.inflow'), type: 'number', render: (row) => (row.inflowLph ? fmt.lph(row.inflowLph) : '—') },
    { key: 'outflowLph', header: t('col.outflow'), type: 'number', render: (row) => (row.outflowLph ? fmt.lph(row.outflowLph) : '—') },
    {
      key: 'holding',
      header: t('col.holding'),
      hint: t('ops.holdingHint'),
      type: 'number',
      value: (row) => holding.get(row.assetId)?.remainingMin,
      sortable: true,
      render: (row) => {
        const status = holding.get(row.assetId)
        if (!status) return <span className="text-ink">{row.holdingLimitH ? t('ops.holdingLimit', { hours: row.holdingLimitH }) : '—'}</span>
        const tone = holdingTone(status.remainingMin)
        return (
          <div className="text-xs leading-tight">
            <p className="tabular-nums">
              {fmt.duration(status.ageMin)} / {row.holdingLimitH} {t('units.h')}
            </p>
            <p className={tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning font-semibold' : 'text-danger font-semibold'}>
              {t('ops.remaining', { time: fmt.duration(status.remainingMin) })}
            </p>
          </div>
        )
      }
    },
    { key: 'cipMinutes', header: t('col.cipDuration'), type: 'number', render: (row) => (row.cipMinutes ? fmt.duration(row.cipMinutes) : '—') },
    ...extra,
    { key: 'status', header: t('col.status'), type: 'status', sortable: true }
  ]

  return (
    <DataTable
      title={title}
      subtitle={subtitle ?? t('ops.snapshotAt', { time: fmt.time(SCENARIO.snapshot) })}
      columns={columns}
      rows={rows}
      rowKey={(row) => row.assetId}
      rowClassName={(row) => (row.status === 'holding risk' ? 'bg-warning-muted/40' : undefined)}
      pageSize={pageSize}
      dense
      note={<ScenarioNote />}
    />
  )
}

/** Process machines: rated speed, CIP, maintenance window */
export function MachineTable({ title, subtitle, rows, extra = [] }: TableProps) {
  const { t } = useTranslation()
  const fmt = useFormat()

  const columns: DataTableColumn<AssetState>[] = [
    { key: 'assetId', header: t('col.asset'), type: 'mono', sortable: true },
    { key: 'type', header: t('col.type'), value: (row) => getAsset(row.assetId)?.type },
    {
      key: 'speed',
      header: t('col.speed'),
      type: 'number',
      value: (row) => row.speedLph ?? row.speedPackph,
      render: (row) => (row.speedLph ? fmt.lph(row.speedLph) : row.speedPackph ? `${fmt.num(row.speedPackph)} ${t('units.packsPerHour')}` : '—')
    },
    { key: 'cipMinutes', header: t('col.cipDuration'), type: 'number', render: (row) => (row.cipMinutes ? fmt.duration(row.cipMinutes) : '—') },
    {
      key: 'maintenance',
      header: t('col.maintenance'),
      type: 'number',
      render: (row) => (row.maintenance ? fmt.range(row.maintenance.start, row.maintenance.end) : '—')
    },
    { key: 'material', header: t('col.material'), render: (row) => row.material ?? row.runningSku ?? '—' },
    ...extra,
    { key: 'status', header: t('col.status'), type: 'status', sortable: true }
  ]

  return (
    <DataTable
      title={title}
      subtitle={subtitle ?? t('ops.snapshotAt', { time: fmt.time(SCENARIO.snapshot) })}
      columns={columns}
      rows={rows}
      rowKey={(row) => row.assetId}
      dense
      note={<ScenarioNote />}
    />
  )
}
