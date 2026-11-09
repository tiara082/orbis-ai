import { createFileRoute, Link } from '@tanstack/react-router'
import { ClipboardCheck } from 'lucide-react'
import { Callout } from '../../components/common/Callout'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { lineLanes } from '../../components/planning/planLanes'
import { OrderOutcomeTable, PlanBlocksTable } from '../../components/planning/PlanTables'
import { ScheduleTimeline } from '../../components/planning/ScheduleTimeline'
import { VolumeBalanceCalculator } from '../../components/planning/VolumeBalanceCalculator'
import { SCENARIO } from '../../data/scenario'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'
import { RevisionBadge } from './-components/RevisionBadge'

export const Route = createFileRoute('/production-schedule/recommended')({ component: RecommendedPage })

function RecommendedPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { activePlan, pendingRevision } = usePlanning()

  return (
    <>
      <PageHeader titleAddon={<RevisionBadge />} />
      <div className="space-y-5">
        {pendingRevision && (
          <Callout
            tone="brand"
            icon={ClipboardCheck}
            title={t('schedule.pendingTitle', { id: pendingRevision.id })}
            description={t('schedule.pendingBody')}
            actions={
              <Link to="/production-schedule/approval" className="inline-flex items-center h-8 px-3 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-hover">
                {t('planning.generate.openApproval')}
              </Link>
            }
          />
        )}

        <SectionPanel title={t('schedule.timeline')} subtitle={t('schedule.timelineHint', { start: fmt.time(activePlan.start), end: fmt.time(activePlan.end) })}>
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

        {/* Volume Balance Validation with formula: Stok Awal + Milk In = Output + Leftover Akhir */}
        <VolumeBalanceCalculator
          recommendedOutputL={Math.round(activePlan.milkRequiredL)}
          recommendedPackOutputL={activePlan.orders.reduce((sum, o) => sum + o.liters, 0)}
        />

        <PlanBlocksTable plan={activePlan} title={t('schedule.table')} subtitle={t('schedule.tableHint')} />
        <OrderOutcomeTable plan={activePlan} title={t('schedule.orders')} />
      </div>
    </>
  )
}
