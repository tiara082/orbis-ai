import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Bell, CalendarCheck, GitFork, Milk, Sparkles, Truck } from 'lucide-react'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { StatCard } from '../../components/common/StatCard'
import { PageHeader } from '../../components/layout/PageHeader'
import { AiLabel } from '../../components/planning/AiLabel'
import { lineLanes } from '../../components/planning/planLanes'
import { ScheduleTimeline } from '../../components/planning/ScheduleTimeline'
import { Badge } from '../../components/ui/Badge'
import { IconTile } from '../../components/ui/IconTile'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { AppPath } from '../../config/navigation'
import { ASSET_STATES, BATCHES, FORECAST, PRODUCTION_ACTUALS, SCENARIO, TRANSFERS } from '../../data/scenario'
import { incomingMilk, pendingMilk, releasedMilkL } from '../../domain/checks'
import { massBalance } from '../../domain/genealogy'
import { validatePath } from '../../domain/routing'
import { useCheckText } from '../../lib/checkText'
import { cn } from '../../lib/cn'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlantAlerts } from '../../state/alerts'
import { usePlanning } from '../../state/planning'

export const Route = createFileRoute('/dashboard/')({ component: DashboardPage })

const STATUS_ASSETS = ['RMT-01', 'RMT-02', 'RMT-03', 'TH-01', 'TH-02', '1-Sep', 'ST-01', 'AT-01', 'FL-01', 'FL-02', 'SFP-05', 'ST-05']

function MoreLink({ to, label }: { to: AppPath; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-hover">
      {label} <ArrowRight className="w-3 h-3" />
    </Link>
  )
}

function DashboardPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const checkText = useCheckText()
  const alerts = usePlantAlerts()
  const { activePlan, activeRevision, pendingRevision } = usePlanning()

  const released = releasedMilkL()
  const pendingL = pendingMilk().reduce((sum, d) => sum + d.volumeL, 0)
  const incoming = incomingMilk()
  const incomingL = incoming.reduce((sum, d) => sum + d.volumeL, 0)
  const spare = released - activePlan.milkRequiredL
  const validTransfers = TRANSFERS.filter((tr) => validatePath(tr.path).valid).length
  const balanced = BATCHES.filter((batch) => Math.abs(massBalance(batch.id).variance) < 1).length
  const pendingQa = BATCHES.filter((batch) => batch.status === 'pending qa').length

  const goodPacks = PRODUCTION_ACTUALS.reduce((sum, a) => sum + a.goodPacks, 0)
  const elapsedPlanned = activePlan.blocks
    .filter((block) => block.kind === 'production')
    .reduce((sum, block) => sum + (block.packs ?? 0) * (Math.max(0, Math.min(SCENARIO.snapshot, block.end) - block.start) / (block.end - block.start)), 0)

  return (
    <>
      <PageHeader title={t('dashboard.greeting')} />
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Milk} label={t('dashboard.kpi.received')} value={fmt.liters(released)} caption={t('dashboard.kpi.receivedCaption')} captionStatus="released" />
          <StatCard
            icon={Sparkles}
            label={t('dashboard.kpi.available')}
            value={fmt.liters(FORECAST.availableTodayL)}
            caption={t('dashboard.kpi.availableCaption', { spare: fmt.liters(Math.round(spare)) })}
            captionTone={spare >= 0 ? 'success' : 'danger'}
          />
          <StatCard
            icon={Truck}
            label={t('dashboard.kpi.waiting')}
            value={fmt.liters(pendingL + incomingL)}
            caption={t('dashboard.kpi.waitingCaption', { pending: fmt.liters(pendingL), incoming: fmt.liters(incomingL) })}
            captionStatus="lab pending"
          />
          <StatCard
            icon={CalendarCheck}
            label={t('dashboard.kpi.plan')}
            value={activeRevision.id.replace('PLAN-', '')}
            caption={pendingRevision ? t('dashboard.kpi.planPending', { id: pendingRevision.id }) : t('dashboard.kpi.planApproved')}
            captionStatus={pendingRevision ? 'pending approval' : 'approved'}
          />
        </div>

        <SectionPanel
          title={t('dashboard.plan')}
          subtitle={t('dashboard.planHint', { id: activeRevision.id, start: fmt.time(activePlan.start), end: fmt.time(activePlan.end) })}
          actions={<MoreLink to="/production-schedule/recommended" label={t('dashboard.openSchedule')} />}
        >
          <Card className="p-4">
            <ScheduleTimeline
              lanes={lineLanes(activePlan, t)}
              start={SCENARIO.planWindow.start}
              end={Math.max(SCENARIO.planWindow.end, activePlan.end)}
              tickEvery={60}
              now={SCENARIO.snapshot}
              nowLabel={fmt.time(SCENARIO.snapshot)}
            />
          </Card>
        </SectionPanel>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <SectionPanel
            title={t('dashboard.alerts')}
            subtitle={t('dashboard.alertsHint', { count: alerts.length })}
            actions={<MoreLink to="/ai-planning/recommendations" label={t('dashboard.openRecommendations')} />}
          >
            <div className="space-y-2">
              {alerts.map((alert) => {
                const text = alert.check ? checkText(alert.check) : { title: t(`alerts.${alert.id}.title`), message: t(`alerts.${alert.id}.body`) }
                return (
                  <Link key={alert.id} to={alert.path} className="block">
                    <Card className="p-3 flex items-start gap-3 hover:border-brand-subtle transition-colors">
                      <IconTile icon={Bell} tone={alert.tone} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink-strong">
                          {text.title}
                          {alert.check && <span className="ml-2 font-mono text-[11px] font-normal text-ink">{alert.check.ruleId}</span>}
                        </p>
                        <p className="text-xs text-ink mt-0.5">{text.message}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                    </Card>
                  </Link>
                )
              })}
            </div>
          </SectionPanel>

          <div className="space-y-5">
            <SectionPanel title={t('dashboard.pva')} actions={<MoreLink to="/production-schedule/planned-vs-actual" label={t('common.details')} />}>
              <Card className="p-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-ink">{t('dashboard.pvaGood')}</p>
                    <p className="text-2xl font-extrabold tabular-nums text-ink-strong">{fmt.packs(goodPacks)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink">{t('dashboard.pvaExpected', { time: fmt.time(SCENARIO.snapshot) })}</p>
                    <p className="text-sm font-semibold tabular-nums text-ink-strong">{fmt.packs(Math.round(elapsedPlanned))}</p>
                  </div>
                </div>
                <ProgressBar value={(goodPacks / Math.max(1, elapsedPlanned)) * 100} className="mt-3" tone={goodPacks >= elapsedPlanned * 0.97 ? 'success' : 'warning'} />
                <p className="text-[11px] text-ink mt-2">{t('dashboard.pvaCaption', { pct: Math.round((goodPacks / Math.max(1, elapsedPlanned)) * 100) })}</p>
              </Card>
            </SectionPanel>

            <SectionPanel title={t('dashboard.trace')} actions={<MoreLink to="/milk-traceability/graph" label={t('dashboard.openGraph')} />}>
              <Card className="p-4 space-y-2.5">
                {[
                  { label: t('dashboard.traceBatches'), value: `${BATCHES.length}`, status: 'valid' },
                  { label: t('dashboard.traceTransfers'), value: `${validTransfers}/${TRANSFERS.length}`, status: validTransfers === TRANSFERS.length ? 'valid' : 'invalid' },
                  { label: t('dashboard.traceBalance'), value: `${balanced}/${BATCHES.length}`, status: balanced === BATCHES.length ? 'pass' : 'warning' },
                  { label: t('dashboard.tracePendingQa'), value: `${pendingQa}`, status: pendingQa ? 'pending qa' : 'released' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-ink">
                      <GitFork className="w-3.5 h-3.5" />
                      {item.label}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums text-ink-strong">{item.value}</span>
                      <Badge status={item.status} />
                    </span>
                  </div>
                ))}
              </Card>
            </SectionPanel>
          </div>
        </div>

        <SectionPanel
          title={t('dashboard.assets')}
          subtitle={t('dashboard.assetsHint', { time: fmt.time(SCENARIO.snapshot) })}
          actions={<MoreLink to="/operational-data/sfp-storage" label={t('dashboard.openOperational')} />}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {STATUS_ASSETS.map((id) => {
              const state = ASSET_STATES.find((s) => s.assetId === id)
              if (!state) return null
              const pct = state.capacityL ? ((state.volumeL ?? 0) / state.capacityL) * 100 : undefined
              return (
                <Card key={id} className={cn('p-3', state.status === 'maintenance' && 'bg-danger-muted/30')}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs font-semibold text-ink-strong">{id}</p>
                    <Badge status={state.status} />
                  </div>
                  {pct !== undefined ? (
                    <>
                      <p className="text-[11px] text-ink mt-2 tabular-nums">
                        {fmt.liters(state.volumeL ?? 0)} · {fmt.pct(Math.round(pct))}
                      </p>
                      <ProgressBar value={pct} className="mt-1" />
                    </>
                  ) : (
                    <p className="text-[11px] text-ink mt-2 tabular-nums">
                      {state.speedLph ? fmt.lph(state.speedLph) : state.speedPackph ? `${fmt.num(state.speedPackph)} ${t('units.packsPerHour')}` : '—'}
                    </p>
                  )}
                </Card>
              )
            })}
          </div>
        </SectionPanel>

        <p className="flex items-center gap-2 text-[11px] text-ink">
          <AiLabel /> {t('dashboard.footer')}
        </p>
      </div>
    </>
  )
}
