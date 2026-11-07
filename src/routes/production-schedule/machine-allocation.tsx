import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { ScenarioNote } from '../../components/common/SourceNote'
import { PageHeader } from '../../components/layout/PageHeader'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { lineSupply } from '../../data/reference'
import { SCENARIO, getAssetState } from '../../data/scenario'
import type { PlanBlockKind } from '../../domain/plan'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'
import { RevisionBadge } from './-components/RevisionBadge'

export const Route = createFileRoute('/production-schedule/machine-allocation')({ component: MachineAllocationPage })

interface LineRow {
  lineId: string
  orders: string[]
  minutes: Record<'production' | 'changeover' | 'cip' | 'wait', number>
  start: number
  end: number
  liters: number
}

interface UpstreamRow {
  assetId: string
  role: string
  feeds: string
  speedLph: number
  liters: number
}

const WINDOW = SCENARIO.planWindow.end - SCENARIO.planWindow.start
const bucket = (kind: PlanBlockKind) => (kind === 'production' ? 'production' : kind === 'CIP' ? 'cip' : kind === 'wait' ? 'wait' : 'changeover')

function MachineAllocationPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { activePlan } = usePlanning()

  const lineRows: LineRow[] = activePlan.lineIds.map((lineId) => {
    const blocks = activePlan.blocks.filter((block) => block.lineId === lineId)
    const minutes = { production: 0, changeover: 0, cip: 0, wait: 0 }
    blocks.forEach((block) => (minutes[bucket(block.kind)] += block.end - block.start))
    return {
      lineId,
      orders: [...new Set(blocks.map((block) => block.orderId).filter(Boolean))] as string[],
      minutes,
      start: Math.min(...blocks.map((block) => block.start)),
      end: Math.max(...blocks.map((block) => block.end)),
      liters: blocks.reduce((sum, block) => sum + (block.liters ?? 0), 0)
    }
  })

  const lineColumns: DataTableColumn<LineRow>[] = [
    { key: 'lineId', header: t('col.line'), type: 'mono' },
    { key: 'supply', header: t('col.asepticTank'), type: 'mono', value: (row) => `${lineSupply(row.lineId).asepticTankId} · ${lineSupply(row.lineId).pipeId}` },
    { key: 'orders', header: t('col.orders'), render: (row) => row.orders.join(', ') },
    { key: 'speed', header: t('col.speed'), type: 'number', render: (row) => `${fmt.num(getAssetState(row.lineId)?.speedPackph ?? 0)} ${t('units.packsPerHour')}` },
    { key: 'production', header: t('col.productionTime'), type: 'number', render: (row) => fmt.duration(row.minutes.production) },
    { key: 'changeover', header: t('col.changeoverTime'), type: 'number', render: (row) => fmt.duration(row.minutes.changeover) },
    { key: 'cip', header: t('col.cipTime'), type: 'number', render: (row) => fmt.duration(row.minutes.cip) },
    { key: 'window', header: t('col.window'), type: 'number', render: (row) => fmt.range(row.start, row.end) },
    {
      key: 'util',
      header: t('col.utilization'),
      hint: t('schedule.machines.utilHint', { window: fmt.range(SCENARIO.planWindow.start, SCENARIO.planWindow.end) }),
      className: 'min-w-[140px]',
      value: (row) => row.minutes.production / WINDOW,
      render: (row) => {
        const pct = (row.minutes.production / WINDOW) * 100
        return (
          <div>
            <p className="text-xs tabular-nums">{fmt.pct(Math.round(pct))}</p>
            <ProgressBar value={pct} className="mt-1" />
          </div>
        )
      }
    }
  ]

  const atLiters = activePlan.blocks.reduce((sum, block) => sum + (block.liters ?? 0), 0)
  const upstream: UpstreamRow[] = [
    { assetId: 'ST-01', role: t('schedule.machines.role.sterilize'), feeds: 'AT-01', speedLph: getAssetState('ST-01')?.speedLph ?? 0, liters: atLiters },
    { assetId: 'TH-01', role: t('schedule.machines.role.thermize'), feeds: '1-Sep · SFP', speedLph: getAssetState('TH-01')?.speedLph ?? 0, liters: activePlan.milkRequiredL },
    { assetId: '1-Sep', role: t('schedule.machines.role.separate'), feeds: 'SFP · CRT', speedLph: getAssetState('1-Sep')?.speedLph ?? 0, liters: activePlan.milkRequiredL }
  ]

  const upstreamColumns: DataTableColumn<UpstreamRow>[] = [
    { key: 'assetId', header: t('col.asset'), type: 'mono' },
    { key: 'role', header: t('col.role') },
    { key: 'feeds', header: t('col.feeds'), type: 'mono' },
    { key: 'speedLph', header: t('col.speed'), type: 'number', render: (row) => fmt.lph(row.speedLph) },
    { key: 'liters', header: t('col.volumeToProcess'), type: 'number', render: (row) => fmt.liters(Math.round(row.liters)) },
    { key: 'hours', header: t('col.runTime'), type: 'number', render: (row) => fmt.duration((row.liters / row.speedLph) * 60) },
    { key: 'status', header: t('col.status'), type: 'status', value: (row) => getAssetState(row.assetId)?.status }
  ]

  return (
    <>
      <PageHeader titleAddon={<RevisionBadge />} />
      <div className="space-y-5">
        <DataTable title={t('schedule.machines.lines')} subtitle={t('schedule.machines.linesHint')} columns={lineColumns} rows={lineRows} rowKey={(row) => row.lineId} />
        <DataTable title={t('schedule.machines.upstream')} subtitle={t('schedule.machines.upstreamHint')} columns={upstreamColumns} rows={upstream} rowKey={(row) => row.assetId} note={<ScenarioNote />} />
      </div>
    </>
  )
}
