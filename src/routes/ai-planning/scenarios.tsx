import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { AiLabel } from '../../components/planning/AiLabel'
import { CheckList } from '../../components/planning/CheckList'
import { lineLanes } from '../../components/planning/planLanes'
import { ScheduleTimeline } from '../../components/planning/ScheduleTimeline'
import { Badge } from '../../components/ui/Badge'
import { SCENARIO } from '../../data/scenario'
import { runScenarios, type ScenarioId, type ScenarioResult } from '../../domain/scenarios'
import { useCheckText } from '../../lib/checkText'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'

export const Route = createFileRoute('/ai-planning/scenarios')({ component: ScenariosPage })

function ScenariosPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const checkText = useCheckText()
  const { config } = usePlanning()
  const results = useMemo(() => runScenarios(config), [config])
  const [selectedId, setSelectedId] = useState<ScenarioId>('baseline')
  const selected = results.find((result) => result.id === selectedId) ?? results[0]

  const lateCount = (result: ScenarioResult) => result.plan.orders.filter((order) => order.lateMin > 0).length
  const firstIssue = (result: ScenarioResult) => result.checks.find((check) => check.status === 'violation') ?? result.checks.find((check) => check.status === 'warning')

  const columns: DataTableColumn<ScenarioResult>[] = [
    {
      key: 'id',
      header: t('col.scenario'),
      render: (row) => (
        <div>
          <p className="font-semibold">{t(`planning.scenario.${row.id}.title`)}</p>
          <p className="text-xs text-ink">{t(`planning.scenario.${row.id}.body`)}</p>
        </div>
      ),
      className: 'min-w-[260px]'
    },
    { key: 'lines', header: t('col.line'), render: (row) => row.plan.lineIds.join(' + ') },
    { key: 'end', header: t('col.lastFinish'), type: 'number', sortable: true, value: (row) => row.plan.end, render: (row) => fmt.time(row.plan.end) },
    { key: 'late', header: t('col.lateOrders'), type: 'number', sortable: true, value: lateCount },
    {
      key: 'milk',
      header: t('col.milkBalance'),
      type: 'number',
      value: (row) => row.milkAvailableL - row.plan.milkRequiredL,
      render: (row) => {
        const spare = row.milkAvailableL - row.plan.milkRequiredL
        return <span className={spare < 0 ? 'text-danger font-semibold' : undefined}>{spare < 0 ? '−' : '+'}{fmt.liters(Math.abs(Math.round(spare)))}</span>
      }
    },
    {
      key: 'issue',
      header: t('col.keyIssue'),
      className: 'min-w-[240px] text-xs text-ink',
      render: (row) => {
        const issue = firstIssue(row)
        return issue ? checkText(issue).message : t('checks.allPass')
      }
    },
    { key: 'status', header: t('col.status'), type: 'status', sortable: true, value: (row) => row.status }
  ]

  return (
    <>
      <PageHeader titleAddon={<AiLabel kind="optimizer" />} />
      <div className="space-y-5">
        <DataTable
          title={t('planning.scenarios.table')}
          subtitle={t('planning.scenarios.tableHint')}
          columns={columns}
          rows={results}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelectedId(row.id)}
          selectedKey={selected.id}
        />

        <SectionPanel
          title={t(`planning.scenario.${selected.id}.title`)}
          subtitle={t('planning.scenarios.detailHint')}
          actions={<Badge status={selected.status} size="md" />}
        >
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Card className="p-4">
              <ScheduleTimeline
                lanes={lineLanes(selected.plan, t)}
                start={SCENARIO.planWindow.start}
                end={Math.max(SCENARIO.planWindow.end, selected.plan.end)}
                tickEvery={60}
              />
            </Card>
            <Card className="px-4 py-2">
              <CheckList checks={selected.checks} issuesOnly />
            </Card>
          </div>
        </SectionPanel>
      </div>
    </>
  )
}
