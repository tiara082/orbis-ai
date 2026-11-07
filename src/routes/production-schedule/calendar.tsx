import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { ScenarioNote } from '../../components/common/SourceNote'
import { PageHeader } from '../../components/layout/PageHeader'
import { asepticLanes, lineLanes } from '../../components/planning/planLanes'
import { ScheduleTimeline, type ScheduleLane } from '../../components/planning/ScheduleTimeline'
import { ASSET_STATES, BAYS, PRODUCTION_ORDERS, SCENARIO, type ProductionOrder } from '../../data/scenario'
import { packsToLiters } from '../../domain/products'
import { at } from '../../domain/time'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'
import { RevisionBadge } from './-components/RevisionBadge'

export const Route = createFileRoute('/production-schedule/calendar')({ component: CalendarPage })

function CalendarPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { activePlan } = usePlanning()

  const maintenanceLanes: ScheduleLane[] = [
    ...ASSET_STATES.filter((state) => state.maintenance && !activePlan.lineIds.includes(state.assetId)).map((state) => ({
      id: state.assetId,
      label: state.assetId,
      sublabel: t('schedule.block.maintenance'),
      blocks: [{ id: `${state.assetId}-m`, label: t('schedule.block.maintenance'), start: state.maintenance!.start, end: state.maintenance!.end, kind: 'maintenance' as const }]
    })),
    ...BAYS.filter((bay) => bay.maintenance).map((bay) => ({
      id: bay.bayId,
      label: bay.bayId,
      sublabel: t('schedule.block.maintenance'),
      blocks: [{ id: `${bay.bayId}-m`, label: t('schedule.block.maintenance'), start: bay.maintenance!.start, end: bay.maintenance!.end, kind: 'maintenance' as const }]
    }))
  ]

  const upcoming = PRODUCTION_ORDERS.filter((order) => order.dayOffset > 0)
  const columns: DataTableColumn<ProductionOrder>[] = [
    { key: 'id', header: t('col.order'), type: 'mono' },
    { key: 'finishedSkuId', header: t('col.finishedSku'), type: 'mono' },
    { key: 'packs', header: t('col.packs'), type: 'number', render: (row) => fmt.num(row.packs) },
    { key: 'liters', header: t('col.liters'), type: 'number', render: (row) => fmt.liters(packsToLiters(row.finishedSkuId, row.packs)) },
    { key: 'date', header: t('col.productionDate'), render: (row) => fmt.shortDate(row.dayOffset) },
    { key: 'due', header: t('col.due'), type: 'number', render: (row) => fmt.time(row.due) },
    { key: 'priority', header: t('col.priority'), type: 'status' }
  ]

  return (
    <>
      <PageHeader titleAddon={<RevisionBadge />} />
      <div className="space-y-5">
        <SectionPanel title={t('schedule.calendar.day', { date: fmt.scenarioDate() })} subtitle={t('schedule.calendar.dayHint')}>
          <Card className="p-4">
            <ScheduleTimeline
              lanes={[...lineLanes(activePlan, t), ...asepticLanes(activePlan, t), ...maintenanceLanes]}
              start={at('06:00')}
              end={at('18:00')}
              tickEvery={120}
              now={SCENARIO.snapshot}
              nowLabel={fmt.time(SCENARIO.snapshot)}
              legend={['plain', 'flavoured', 'changeover', 'cip', 'level', 'maintenance']}
            />
          </Card>
        </SectionPanel>
        <DataTable title={t('schedule.calendar.next')} subtitle={t('schedule.calendar.nextHint')} columns={columns} rows={upcoming} rowKey={(row) => row.id} note={<ScenarioNote />} />
      </div>
    </>
  )
}
