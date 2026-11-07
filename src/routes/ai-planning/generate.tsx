import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ClipboardCheck, Wand2 } from 'lucide-react'
import { Callout } from '../../components/common/Callout'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { AiLabel } from '../../components/planning/AiLabel'
import { CheckList } from '../../components/planning/CheckList'
import { lineLanes } from '../../components/planning/planLanes'
import { OrderOutcomeTable, PlanBlocksTable } from '../../components/planning/PlanTables'
import { ScheduleTimeline } from '../../components/planning/ScheduleTimeline'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { SCENARIO } from '../../data/scenario'
import { countByStatus, runPlanChecks, worstStatus } from '../../domain/checks'

import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'

export const Route = createFileRoute('/ai-planning/generate')({ component: GeneratePage })

function GeneratePage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { generate, pendingRevision, configChanged, activeRevision, previewPlan: plan } = usePlanning()
  const [checkFilter, setCheckFilter] = useState<'all' | 'pass' | 'warning' | 'violation' | 'not computable'>('all')

  const checks = useMemo(() => runPlanChecks(plan), [plan])
  const status = worstStatus(checks)
  const counts = countByStatus(checks)
  const blocked = status === 'violation'

  return (
    <>
      <PageHeader
        titleAddon={<AiLabel kind="optimizer" />}
        actions={
          <Button icon={Wand2} onClick={() => generate()} disabled={blocked}>
            {t('planning.generate.action')}
          </Button>
        }
      />
      <div className="space-y-5">
        {pendingRevision ? (
          <Callout
            tone="brand"
            icon={ClipboardCheck}
            eyebrow={t('planning.generate.pendingEyebrow')}
            title={t('planning.generate.pendingTitle', { id: pendingRevision.id, time: fmt.time(pendingRevision.generatedAt) })}
            description={t('planning.generate.pendingBody')}
            actions={
              <Link to="/production-schedule/approval" className="inline-flex items-center h-8 px-3 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-hover">
                {t('planning.generate.openApproval')}
              </Link>
            }
          />
        ) : (
          <Callout
            tone={blocked ? 'danger' : 'info'}
            icon={Wand2}
            eyebrow={configChanged ? t('planning.config.changed') : t('planning.config.matches', { id: activeRevision.id })}
            title={blocked ? t('planning.generate.blocked') : t('planning.generate.readyTitle')}
            description={t('planning.generate.readyBody')}
          />
        )}

        <SectionPanel
          title={t('planning.generate.preview')}
          subtitle={t('planning.generate.previewHint', { start: fmt.time(plan.start), end: fmt.time(plan.end) })}
          actions={<Badge status={status} size="md" />}
        >
          <Card className="p-4">
            <ScheduleTimeline lanes={lineLanes(plan, t)} start={SCENARIO.planWindow.start} end={Math.max(SCENARIO.planWindow.end, plan.end)} tickEvery={60} />
          </Card>
        </SectionPanel>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <OrderOutcomeTable plan={plan} title={t('planning.generate.orders')} />
          <SectionPanel
            variant="plain"
            title={t('planning.generate.checks')}
            subtitle={t('planning.generate.checksSummary', { pass: counts.pass, warning: counts.warning, violation: counts.violation, na: counts.notComputable })}
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {(['all', 'violation', 'warning', 'pass', 'not computable'] as const).map((value) => (
                <Button key={value} variant={checkFilter === value ? 'primary' : 'ghost'} size="sm" onClick={() => setCheckFilter(value)}>
                  {value === 'all' ? 'All' : value === 'not computable' ? 'Not Computable' : value[0].toUpperCase() + value.slice(1)}
                </Button>
              ))}
            </div>
            <CheckList checks={checks} filter={checkFilter} />
          </SectionPanel>
        </div>

        <PlanBlocksTable plan={plan} title={t('planning.generate.blocks')} />
      </div>
    </>
  )
}
