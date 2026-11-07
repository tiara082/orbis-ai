import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Callout } from '../../components/common/Callout'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { AiLabel } from '../../components/planning/AiLabel'
import { CheckList } from '../../components/planning/CheckList'
import { Badge } from '../../components/ui/Badge'
import type { AppPath } from '../../config/navigation'
import { checkHolding, checkReceivingCapacity, type CheckResult } from '../../domain/checks'
import type { Plan } from '../../domain/plan'
import { runScenarios, type ScenarioId, type ScenarioResult } from '../../domain/scenarios'
import { useCheckText } from '../../lib/checkText'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'

export const Route = createFileRoute('/ai-planning/recommendations')({ component: RecommendationsPage })

interface AlternativeRow {
  id: string
  trigger: 'breakdown' | 'capacity' | 'holding' | 'sequence' | 'changeover' | 'milk'
  check?: CheckResult
  scenario?: ScenarioResult
  path: AppPath
}

const lateCount = (plan: Plan) => plan.orders.filter((order) => order.lateMin > 0).length

function RecommendationsPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const checkText = useCheckText()
  const { config, previewPlan } = usePlanning()
  const results = useMemo(() => runScenarios(config, previewPlan.dependencies), [config, previewPlan.dependencies])
  const byId = (id: ScenarioId) => results.find((result) => result.id === id) as ScenarioResult
  const baseline = byId('baseline')

  const production = baseline.plan.blocks.filter((block) => block.kind === 'production')
  const summary = baseline.plan.lineIds
    .map((lineId) =>
      `${lineId}: ${production
        .filter((block) => block.lineId === lineId)
        .map((block) => `${block.liquidSkuId} ${fmt.range(block.start, block.end)}`)
        .join(' → ')}`
    )
    .join(' · ')

  const alternatives: AlternativeRow[] = [
    { id: 'fl02', trigger: 'breakdown', scenario: byId('fl02-breakdown'), path: '/ai-planning/scenarios' },
    { id: 'rmt', trigger: 'capacity', check: checkReceivingCapacity(), path: '/operational-data/raw-milk-process' },
    { id: 'sfp', trigger: 'holding', check: checkHolding(), path: '/operational-data/sfp-storage' },
    { id: 'split', trigger: 'sequence', scenario: byId('split-chocolate'), path: '/ai-planning/scenarios' },
    { id: 'variant', trigger: 'changeover', scenario: byId('variant-60'), path: '/ai-planning/scenarios' },
    { id: 'milk', trigger: 'milk', scenario: byId('milk-short'), path: '/ai-planning/forecasting' }
  ]

  const impact = (row: AlternativeRow) => {
    if (!row.scenario) return row.check ? checkText(row.check).message : '—'
    const deltaEnd = row.scenario.plan.end - baseline.plan.end
    const deltaLate = lateCount(row.scenario.plan) - lateCount(baseline.plan)
    return t('planning.recs.impact', {
      end: fmt.time(row.scenario.plan.end),
      delta: `${deltaEnd >= 0 ? '+' : '−'}${fmt.duration(Math.abs(deltaEnd))}`,
      late: deltaLate
    })
  }

  const columns: DataTableColumn<AlternativeRow>[] = [
    { key: 'trigger', header: t('col.alert'), render: (row) => <Badge tone="warning" icon={null}>{t(`planning.recs.trigger.${row.trigger}`)}</Badge> },
    {
      key: 'recommendation',
      header: t('col.recommendation'),
      className: 'min-w-[280px]',
      render: (row) => (
        <div>
          <p className="font-semibold">{t(`planning.recs.alt.${row.id}.title`)}</p>
          <p className="text-xs text-ink">{t(`planning.recs.alt.${row.id}.body`)}</p>
        </div>
      )
    },
    { key: 'impact', header: t('col.impact'), className: 'min-w-[220px] text-xs', render: impact },
    { key: 'status', header: t('col.ruleCheck'), type: 'status', value: (row) => row.scenario?.status ?? row.check?.status },
    {
      key: 'open',
      header: '',
      render: (row) => (
        <Link to={row.path} className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-hover">
          {t('common.open')} <ArrowRight className="w-3 h-3" />
        </Link>
      )
    }
  ]

  return (
    <>
      <PageHeader titleAddon={<AiLabel kind="optimizer" />} />
      <div className="space-y-5">
        <Callout
          variant="strong"
          icon={Sparkles}
          eyebrow={t('planning.recs.eyebrow')}
          title={t('planning.recs.title')}
          description={summary}
          actions={
            <Link to="/production-schedule/recommended" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-white text-brand text-sm font-semibold hover:bg-white/90">
              {t('planning.recs.openSchedule')} <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <SectionPanel title={t('planning.recs.why')} subtitle={t('planning.recs.whyHint')}>
            <Card className="p-4">
              <ul className="space-y-2 text-sm text-ink-strong list-disc pl-4">
                <li>{t('planning.recs.reason.onTime', { count: baseline.plan.orders.length - lateCount(baseline.plan), total: baseline.plan.orders.length })}</li>
                <li>{t('planning.recs.reason.milk', { required: fmt.liters(Math.round(baseline.plan.milkRequiredL)), available: fmt.liters(baseline.milkAvailableL) })}</li>
                <li>{t('planning.recs.reason.changeover', { min: config.changeoverMin.VARIANT })}</li>
                <li>{t('planning.recs.reason.end', { time: fmt.time(baseline.plan.end) })}</li>
              </ul>
            </Card>
          </SectionPanel>
          <SectionPanel variant="plain" title={t('planning.recs.risks')} subtitle={t('planning.recs.risksHint')}>
            <CheckList checks={baseline.checks} issuesOnly />
          </SectionPanel>
        </div>

        <DataTable
          title={t('planning.recs.alternatives')}
          subtitle={t('planning.recs.alternativesHint')}
          columns={columns}
          rows={alternatives}
          rowKey={(row) => row.id}
        />
      </div>
    </>
  )
}
