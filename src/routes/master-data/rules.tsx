import { createFileRoute, Link } from '@tanstack/react-router'
import { Lightbulb } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { ParamValue } from '../../components/common/ParamValue'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import type { AppPath } from '../../config/navigation'
import {
  CHANGEOVER_RULES,
  CIP_RULES,
  CONSTRAINTS,
  type ChangeoverRule,
  type CipRule,
  type ConstraintRule
} from '../../data/reference'
import { DEFAULT_CONFIG } from '../../domain/plan'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { CatalogNote } from '../../components/common/SourceNote'

export const Route = createFileRoute('/master-data/rules')({ component: RulesPage })

/** Where each catalog rule is evaluated in the app */
const RULE_USAGE: Record<string, { status: 'computed' | 'not computable' | 'reference'; path?: AppPath }> = {
  RECEIVING_GATE: { status: 'computed', path: '/operational-data/lab-release' },
  BAY_EXCLUSIVE: { status: 'computed', path: '/operational-data/unloading-bay' },
  DEGASSING: { status: 'reference' },
  CAPACITY: { status: 'computed', path: '/operational-data/raw-milk-process' },
  FLOW: { status: 'reference' },
  NOMINAL_NOT_ACTUAL: { status: 'reference' },
  HOLDING: { status: 'computed', path: '/operational-data/sfp-storage' },
  CONNECTION: { status: 'computed', path: '/milk-traceability/transfers' },
  LINE_PRODUCT: { status: 'computed', path: '/ai-planning/generate' },
  MARKET_VARIANT: { status: 'reference', path: '/master-data/products' },
  CHANGEOVER_PRECEDENCE: { status: 'computed', path: '/production-schedule/recommended' },
  AT_SHARED_FLOW: { status: 'computed', path: '/ai-planning/generate' },
  AT_SAME_PRODUCT: { status: 'computed', path: '/ai-planning/scenarios' },
  SIMULTANEOUS: { status: 'computed', path: '/operational-data/aseptic-tank' },
  PLAN: { status: 'computed', path: '/ai-planning/generate' },
  MASS_BALANCE: { status: 'computed', path: '/milk-traceability/batches' },
  CO_PRODUCT: { status: 'computed', path: '/milk-traceability/batches' },
  FILLING_SPEED_UNIT: { status: 'computed', path: '/operational-data/production-actual' },
  HEADER_RESOURCE: { status: 'not computable' },
  RECIPE_ROUTE: { status: 'reference' },
  TRANSFORM_BATCH: { status: 'computed', path: '/milk-traceability/graph' }
}

const SCENARIO_DURATION: Record<string, number | undefined> = {
  ...DEFAULT_CONFIG.changeoverMin,
  ...DEFAULT_CONFIG.cipMin,
  CIP_EMPTY: 20
}

function RulesPage() {
  const { t } = useTranslation()
  const fmt = useFormat()

  const scenarioValue = (ruleId: string) => {
    const value = SCENARIO_DURATION[ruleId]
    return value === undefined ? <span className="text-gray-300">—</span> : <span className="tabular-nums">{fmt.duration(value)}</span>
  }

  const constraintColumns: DataTableColumn<ConstraintRule>[] = [
    { key: 'ruleId', header: t('col.rule'), type: 'mono', sortable: true },
    { key: 'scope', header: t('col.scope'), sortable: true },
    { key: 'description', header: t('col.description'), className: 'min-w-[320px] text-ink' },
    {
      key: 'usage',
      header: t('col.implementation'),
      value: (row) => RULE_USAGE[row.ruleId]?.status ?? 'reference',
      render: (row) => <Badge status={RULE_USAGE[row.ruleId]?.status ?? 'reference'} />
    },
    {
      key: 'path',
      header: t('col.usedIn'),
      className: 'whitespace-nowrap',
      render: (row) => {
        const path = RULE_USAGE[row.ruleId]?.path
        return path ? (
          <Link to={path} className="text-xs font-medium text-brand hover:text-brand-hover hover:underline">
            {path}
          </Link>
        ) : (
          '—'
        )
      }
    }
  ]

  const changeoverColumns: DataTableColumn<ChangeoverRule>[] = [
    { key: 'ruleId', header: t('col.rule'), type: 'mono' },
    { key: 'precedence', header: t('col.precedence') },
    { key: 'condition', header: t('col.condition'), className: 'font-mono text-xs' },
    { key: 'activity', header: t('col.activity') },
    { key: 'duration', header: t('col.catalogDuration'), align: 'right', render: (row) => <ParamValue value={row.duration} /> },
    { key: 'scenario', header: t('col.scenarioDuration'), align: 'right', render: (row) => scenarioValue(row.ruleId) },
    { key: 'note', header: t('col.note'), className: 'text-ink min-w-[220px]' }
  ]

  const cipColumns: DataTableColumn<CipRule>[] = [
    { key: 'ruleId', header: t('col.rule'), type: 'mono' },
    { key: 'trigger', header: t('col.trigger'), className: 'font-mono text-xs' },
    { key: 'assetScope', header: t('col.scope'), render: (row) => row.assetScope.join(', '), className: 'min-w-[200px]' },
    { key: 'requirement', header: t('col.requirement'), className: 'text-ink min-w-[220px]' },
    { key: 'duration', header: t('col.catalogDuration'), align: 'right', render: (row) => <ParamValue value={row.duration} /> },
    { key: 'scenario', header: t('col.scenarioDuration'), align: 'right', render: (row) => scenarioValue(row.ruleId) }
  ]

  const assumptions = ['density', 'fullCream', 'flavoured', 'packaging', 'maintenance', 'breakdown', 'batchPolicy', 'hold'] as const

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <DataTable
          title={t('master.rules.constraints')}
          subtitle={t('master.rules.constraintsHint')}
          columns={constraintColumns}
          rows={CONSTRAINTS}
          rowKey={(row) => row.ruleId}
          searchText={(row) => `${row.ruleId} ${row.scope} ${row.description}`}
          dense
          note={<CatalogNote files={['constraint_catalog.csv']} />}
        />
        <DataTable
          title={t('master.rules.changeover')}
          subtitle={t('master.rules.changeoverHint')}
          columns={changeoverColumns}
          rows={CHANGEOVER_RULES}
          rowKey={(row) => row.ruleId}
          dense
          note={<CatalogNote files={['changeover_rules.csv']} />}
        />
        <DataTable
          title={t('master.rules.cip')}
          subtitle={t('master.rules.cipHint')}
          columns={cipColumns}
          rows={CIP_RULES}
          rowKey={(row) => row.ruleId}
          dense
          note={<CatalogNote files={['cip_rules.csv']} />}
        />

        <SectionPanel title={t('master.rules.assumptions')} subtitle={t('master.rules.assumptionsHint')}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {assumptions.map((key) => (
              <Card key={key} className="p-4">
                <div className="flex items-center gap-2 text-brand">
                  <Lightbulb className="w-4 h-4" />
                  <p className="text-xs font-semibold text-ink-strong">{t(`master.rules.assumption.${key}.title`)}</p>
                </div>
                <p className="text-xs text-ink mt-1.5">{t(`master.rules.assumption.${key}.body`)}</p>
              </Card>
            ))}
          </div>
        </SectionPanel>
      </div>
    </>
  )
}
