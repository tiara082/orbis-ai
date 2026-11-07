import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { ScenarioNote } from '../../components/common/SourceNote'
import { PageHeader } from '../../components/layout/PageHeader'
import { CheckList } from '../../components/planning/CheckList'
import { asepticLanes } from '../../components/planning/planLanes'
import { ScheduleTimeline } from '../../components/planning/ScheduleTimeline'
import { BATCHES, SCENARIO, getAssetState, type Batch } from '../../data/scenario'
import { holdingStatuses, runPlanChecks } from '../../domain/checks'
import { descendants, transfersOutOf } from '../../domain/genealogy'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'
import { RevisionBadge } from './-components/RevisionBadge'

export const Route = createFileRoute('/production-schedule/tank-allocation')({ component: TankAllocationPage })

const TANK_RULES = ['AT_SAME_PRODUCT', 'AT_SHARED_FLOW', 'SIMULTANEOUS', 'HOLDING', 'MILK_BALANCE']

function TankAllocationPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { activePlan } = usePlanning()
  const holding = new Map(holdingStatuses().map((status) => [status.batchId, status]))

  /** Material that feeds today's orders: SFP and aseptic batches that end in finished goods */
  const rows = BATCHES.filter((batch) => (batch.kind === 'storage' || batch.kind === 'aseptic') && batch.dayOffset === 0)
  const ordersFed = (batch: Batch) => {
    const finished = descendants(batch.id).batches.filter((b) => b.kind === 'finished')
    return [...new Set(finished.map((b) => activePlan.orders.find((order) => order.finishedSkuId === b.finishedSkuId)?.orderId).filter(Boolean))].join(', ')
  }

  const columns: DataTableColumn<Batch>[] = [
    { key: 'assetId', header: t('col.tank'), type: 'mono', sortable: true },
    { key: 'id', header: t('col.batch'), type: 'mono' },
    { key: 'material', header: t('col.material') },
    { key: 'volumeL', header: t('col.batchVolume'), type: 'number', render: (row) => fmt.liters(row.volumeL) },
    {
      key: 'current',
      header: t('col.volumeNow'),
      type: 'number',
      render: (row) => {
        const state = getAssetState(row.assetId)
        return state?.batchId === row.id ? fmt.liters(state.volumeL ?? 0) : fmt.liters(0)
      }
    },
    { key: 'next', header: t('col.sentTo'), type: 'mono', render: (row) => transfersOutOf(row.id).map((tr) => tr.toBatch).join(', ') || '—' },
    { key: 'orders', header: t('col.orders'), render: (row) => ordersFed(row) || '—' },
    {
      key: 'holding',
      header: t('col.holding'),
      type: 'number',
      render: (row) => {
        const status = holding.get(row.id)
        return status ? t('ops.remaining', { time: fmt.duration(status.remainingMin) }) : '—'
      }
    },
    { key: 'status', header: t('col.status'), type: 'status' }
  ]

  const checks = runPlanChecks(activePlan).filter((check) => TANK_RULES.includes(check.ruleId))

  return (
    <>
      <PageHeader titleAddon={<RevisionBadge />} />
      <div className="space-y-5">
        <SectionPanel title={t('schedule.tanks.aseptic')} subtitle={t('schedule.tanks.asepticHint')}>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Card className="p-4">
              <ScheduleTimeline
                lanes={asepticLanes(activePlan, t)}
                start={SCENARIO.planWindow.start}
                end={Math.max(SCENARIO.planWindow.end, activePlan.end)}
                tickEvery={60}
                legend={['plain', 'flavoured', 'cip', 'level']}
              />
            </Card>
            <Card className="px-4 py-2">
              <CheckList checks={checks} />
            </Card>
          </div>
        </SectionPanel>
        <DataTable title={t('schedule.tanks.table')} subtitle={t('schedule.tanks.tableHint')} columns={columns} rows={rows} rowKey={(row) => row.id} note={<ScenarioNote />} />
      </div>
    </>
  )
}
