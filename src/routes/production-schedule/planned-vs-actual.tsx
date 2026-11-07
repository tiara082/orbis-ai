import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { ScenarioNote } from '../../components/common/SourceNote'
import { PageHeader } from '../../components/layout/PageHeader'
import { CheckCallout } from '../../components/planning/CheckCallout'
import { blockKind } from '../../components/planning/planLanes'
import { ScheduleTimeline, type ScheduleLane } from '../../components/planning/ScheduleTimeline'
import { Badge } from '../../components/ui/Badge'
import { PRODUCTION_ACTUALS, SCENARIO, type ProductionActual } from '../../data/scenario'
import { runPlanChecks } from '../../domain/checks'
import type { PlanBlock } from '../../domain/plan'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'
import { RevisionBadge } from './-components/RevisionBadge'

export const Route = createFileRoute('/production-schedule/planned-vs-actual')({ component: PlannedVsActualPage })

interface CompareRow {
  key: string
  planned?: PlanBlock
  actual?: ProductionActual
  expectedByNow: number
}

function PlannedVsActualPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { activePlan } = usePlanning()
  const now = SCENARIO.snapshot

  const production = activePlan.blocks.filter((block) => block.kind === 'production')
  const rows: CompareRow[] = production.map((planned) => {
    const actual = PRODUCTION_ACTUALS.find((a) => a.orderId === planned.orderId && a.lineId === planned.lineId)
    const elapsed = Math.max(0, Math.min(now, planned.end) - planned.start)
    const expectedByNow = (planned.packs ?? 0) * (elapsed / (planned.end - planned.start))
    return { key: `${planned.lineId}-${planned.orderId}`, planned, actual, expectedByNow }
  })

  const columns: DataTableColumn<CompareRow>[] = [
    { key: 'order', header: t('col.order'), type: 'mono', value: (row) => row.planned?.orderId },
    { key: 'line', header: t('col.line'), type: 'mono', value: (row) => row.planned?.lineId },
    { key: 'plannedWindow', header: t('col.plannedWindow'), type: 'number', render: (row) => (row.planned ? fmt.range(row.planned.start, row.planned.end) : '—') },
    {
      key: 'actualWindow',
      header: t('col.actualWindow'),
      type: 'number',
      render: (row) => (row.actual ? (row.actual.end !== undefined ? fmt.range(row.actual.start, row.actual.end) : `${fmt.time(row.actual.start)}–…`) : '—')
    },
    {
      key: 'startDev',
      header: t('col.startDeviation'),
      type: 'number',
      value: (row) => (row.actual && row.planned ? row.actual.start - row.planned.start : undefined),
      render: (row) => {
        if (!row.actual || !row.planned) return '—'
        const dev = row.actual.start - row.planned.start
        return dev > 0 ? <span className={dev >= 10 ? 'text-danger font-semibold' : 'text-warning'}>+{fmt.duration(dev)}</span> : <span className="text-success">{fmt.duration(dev)}</span>
      }
    },
    { key: 'plannedPacks', header: t('col.plannedPacks'), type: 'number', render: (row) => fmt.num(Math.round(row.planned?.packs ?? 0)) },
    { key: 'expected', header: t('col.expectedByNow', { time: fmt.time(now) }), type: 'number', render: (row) => fmt.num(Math.round(row.expectedByNow)) },
    { key: 'actualPacks', header: t('col.goodPacks'), type: 'number', render: (row) => (row.actual ? fmt.num(row.actual.goodPacks) : '—') },
    {
      key: 'variance',
      header: t('col.variance'),
      type: 'number',
      value: (row) => (row.actual?.goodPacks ?? 0) - row.expectedByNow,
      render: (row) => {
        const variance = Math.round((row.actual?.goodPacks ?? 0) - row.expectedByNow)
        return <span className={variance < 0 ? 'text-danger font-semibold' : 'text-success'}>{variance >= 0 ? '+' : '−'}{fmt.num(Math.abs(variance))}</span>
      }
    },
    { key: 'status', header: t('col.status'), type: 'status', value: (row) => (row.actual ? (row.actual.end !== undefined ? 'completed' : 'running') : 'pending') },
    { key: 'reason', header: t('col.reason'), render: (row) => (row.actual?.note ? <Badge status="warning">{t(`ops.actual.note.${row.actual.note}`)}</Badge> : '—') }
  ]

  const lanes: ScheduleLane[] = activePlan.lineIds.flatMap((lineId) => [
    {
      id: `${lineId}-plan`,
      label: lineId,
      sublabel: t('schedule.pva.planned'),
      blocks: activePlan.blocks
        .filter((block) => block.lineId === lineId)
        .map((block) => ({ id: `${block.kind}-${block.start}`, label: block.liquidSkuId ?? t(`schedule.block.${block.kind}`), start: block.start, end: block.end, kind: blockKind(block) }))
    },
    {
      id: `${lineId}-actual`,
      label: lineId,
      sublabel: t('schedule.pva.actual'),
      blocks: PRODUCTION_ACTUALS.filter((actual) => actual.lineId === lineId).map((actual) => {
        const planned = production.find((block) => block.orderId === actual.orderId)
        return {
          id: actual.orderId,
          label: actual.orderId,
          start: actual.start,
          end: actual.end ?? now,
          kind: planned ? blockKind(planned) : 'plain',
          flagged: actual.note !== undefined
        }
      })
    }
  ])

  const simultaneous = runPlanChecks(activePlan).find((check) => check.ruleId === 'SIMULTANEOUS')

  return (
    <>
      <PageHeader titleAddon={<RevisionBadge />} />
      <div className="space-y-5">
        {simultaneous && simultaneous.status !== 'pass' && <CheckCallout check={simultaneous} />}
        <SectionPanel title={t('schedule.pva.timeline')} subtitle={t('schedule.pva.timelineHint')}>
          <Card className="p-4">
            <ScheduleTimeline lanes={lanes} start={SCENARIO.planWindow.start} end={Math.max(SCENARIO.planWindow.end, activePlan.end)} tickEvery={60} now={now} nowLabel={fmt.time(now)} />
          </Card>
        </SectionPanel>
        <DataTable title={t('schedule.pva.table')} subtitle={t('schedule.pva.tableHint')} columns={columns} rows={rows} rowKey={(row) => row.key} note={<ScenarioNote />} />
      </div>
    </>
  )
}
