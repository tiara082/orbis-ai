import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock, Milk, Sparkles, Truck } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { ScenarioNote } from '../../components/common/SourceNote'
import { StatCard } from '../../components/common/StatCard'
import { PageHeader } from '../../components/layout/PageHeader'
import { AiLabel } from '../../components/planning/AiLabel'
import { CheckCallout } from '../../components/planning/CheckCallout'
import { FORECAST, MILK_INTAKE_HISTORY } from '../../data/scenario'
import { incomingMilk, pendingMilk, releasedMilkL, runPlanChecks } from '../../domain/checks'
import { buildPlan } from '../../domain/plan'
import { isFlavoured, milkFraction } from '../../domain/products'
import { cn } from '../../lib/cn'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'

export const Route = createFileRoute('/ai-planning/forecasting')({ component: ForecastingPage })

interface DemandRow {
  group: 'plain' | 'flavoured'
  liters: number
  fraction: number
  milkL: number
}

interface EtaRow {
  id: string
  subject: string
  planned: number
  predicted: number
}

function ForecastingPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { config } = usePlanning()
  const plan = useMemo(() => buildPlan(config), [config])
  const milkCheck = runPlanChecks(plan).find((check) => check.ruleId === 'MILK_BALANCE')

  const released = releasedMilkL()
  const waitingL = [...pendingMilk(), ...incomingMilk()].reduce((sum, delivery) => sum + delivery.volumeL, 0)
  const maxIntake = Math.max(...MILK_INTAKE_HISTORY.map((day) => day.volumeL))

  const demand: DemandRow[] = (['plain', 'flavoured'] as const).map((group) => {
    const blocks = plan.blocks.filter((block) => block.kind === 'production' && isFlavoured(block.liquidSkuId ?? '') === (group === 'flavoured'))
    const liters = blocks.reduce((sum, block) => sum + (block.liters ?? 0), 0)
    const milkL = blocks.reduce((sum, block) => sum + (block.milkL ?? 0), 0)
    return { group, liters, milkL, fraction: blocks[0] ? milkFraction(blocks[0].liquidSkuId ?? '') : group === 'flavoured' ? 0.9 : 1 }
  })

  const demandColumns: DataTableColumn<DemandRow>[] = [
    { key: 'group', header: t('col.productGroup'), render: (row) => t(`planning.forecast.group.${row.group}`) },
    { key: 'liters', header: t('col.plannedLiters'), type: 'number', render: (row) => fmt.liters(Math.round(row.liters)) },
    { key: 'fraction', header: t('col.milkContent'), type: 'number', render: (row) => fmt.pct(row.fraction * 100) },
    { key: 'milkL', header: t('col.milkNeed'), type: 'number', render: (row) => fmt.liters(Math.round(row.milkL)) }
  ]

  const etaRows: EtaRow[] = [
    { id: 'TRK-B02', subject: t('planning.forecast.eta.arrival'), planned: FORECAST.trkB02Eta.planned, predicted: FORECAST.trkB02Eta.predicted },
    { id: 'TRK-A03', subject: t('planning.forecast.eta.labResult'), planned: FORECAST.trkA03ResultExpected, predicted: FORECAST.trkA03ResultExpected }
  ]

  const etaColumns: DataTableColumn<EtaRow>[] = [
    { key: 'id', header: t('col.truck'), type: 'mono' },
    { key: 'subject', header: t('col.prediction') },
    { key: 'planned', header: t('col.planned'), type: 'number', render: (row) => fmt.time(row.planned) },
    { key: 'predicted', header: t('col.predicted'), type: 'number', render: (row) => fmt.time(row.predicted) },
    {
      key: 'diff',
      header: t('col.delay'),
      type: 'number',
      render: (row) => {
        const diff = row.predicted - row.planned
        return diff > 0 ? <span className="text-danger font-semibold">+{fmt.duration(diff)}</span> : '—'
      }
    }
  ]

  return (
    <>
      <PageHeader titleAddon={<AiLabel />} />
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Sparkles}
            label={t('planning.forecast.availableToday')}
            value={fmt.liters(FORECAST.availableTodayL)}
            caption={t('planning.forecast.confidence', { pct: FORECAST.availableTodayConfidencePct })}
            captionTone="brand"
          />
          <StatCard icon={Milk} label={t('planning.forecast.released')} value={fmt.liters(released)} caption={t('planning.forecast.releasedCaption')} captionStatus="released" />
          <StatCard icon={Truck} label={t('planning.forecast.waiting')} value={fmt.liters(waitingL)} caption={t('planning.forecast.waitingCaption')} captionStatus="lab pending" />
          <StatCard
            icon={CalendarClock}
            label={t('planning.forecast.tomorrow')}
            value={fmt.liters(FORECAST.tomorrowL)}
            caption={t('planning.forecast.range', { min: fmt.liters(FORECAST.tomorrowRangeL[0]), max: fmt.liters(FORECAST.tomorrowRangeL[1]) })}
            captionTone="brand"
          />
        </div>

        <SectionPanel title={t('planning.forecast.intake')} subtitle={t('planning.forecast.intakeHint', { time: fmt.time(FORECAST.modelRefreshed) })} actions={<AiLabel />}>
          <Card className="p-4">
            <div className="flex items-end gap-3 h-48">
              {MILK_INTAKE_HISTORY.map((day) => (
                <div key={day.dayOffset} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[11px] tabular-nums text-ink-strong font-medium">{fmt.num(day.volumeL / 1000)}k</span>
                  <div
                    className={cn(
                      'w-full max-w-12 rounded-t-md',
                      day.forecast ? 'bg-brand-muted border border-dashed border-brand' : day.dayOffset === 0 ? 'bg-brand' : 'bg-info-subtle'
                    )}
                    style={{ height: `${(day.volumeL / maxIntake) * 75}%` }}
                  />
                  <span className={cn('text-[11px]', day.dayOffset === 0 ? 'font-semibold text-ink-strong' : 'text-ink')}>
                    {day.dayOffset === 0 ? t('common.today') : fmt.shortDate(day.dayOffset)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-ink">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-info-subtle" />{t('planning.forecast.legendActual')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand" />{t('common.today')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border border-dashed border-brand bg-brand-muted" />{t('planning.forecast.legendForecast')}</span>
            </div>
          </Card>
        </SectionPanel>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            <DataTable
              title={t('planning.forecast.demand')}
              subtitle={t('planning.forecast.demandHint')}
              columns={demandColumns}
              rows={demand}
              rowKey={(row) => row.group}
              footer={t('planning.forecast.demandFooter', { milk: fmt.liters(Math.round(plan.milkRequiredL)), available: fmt.liters(released) })}
            />
            {milkCheck && <CheckCallout check={milkCheck} />}
          </div>
          <DataTable title={t('planning.forecast.etas')} subtitle={t('planning.forecast.etasHint')} toolbar={<AiLabel />} columns={etaColumns} rows={etaRows} rowKey={(row) => row.id} note={<ScenarioNote />} />
        </div>
      </div>
    </>
  )
}
