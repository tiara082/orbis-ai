import { useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Check, Wand2, X } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { EmptyState } from '../../components/common/EmptyState'
import { ResultState } from '../../components/common/ResultState'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { CheckList } from '../../components/planning/CheckList'
import { lineLanes } from '../../components/planning/planLanes'
import { ScheduleTimeline } from '../../components/planning/ScheduleTimeline'
import { Button } from '../../components/ui/Button'
import { SCENARIO } from '../../data/scenario'
import { worstStatus } from '../../domain/checks'
import type { Plan } from '../../domain/plan'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { revisionDiagnostics, usePlanning, type PlanRevision } from '../../state/planning'

export const Route = createFileRoute('/production-schedule/approval')({ component: ApprovalPage })

interface CompareRow {
  key: string
  label: string
  active: string
  pending: string
  changed: boolean
}

const lateCount = (plan: Plan) => plan.orders.filter((order) => order.lateMin > 0).length

function ApprovalPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const navigate = useNavigate()
  const { revisions, activeRevision, pendingRevision, activePlan, pendingPlan, approve, reject } = usePlanning()
  const [note, setNote] = useState('')
  const [decidedId, setDecidedId] = useState<string>()
  const [showReasonError, setShowReasonError] = useState(false)

  const decided = revisions.find((revision) => revision.id === decidedId)
  const pendingChecks = useMemo(() => (pendingRevision ? revisionDiagnostics(pendingRevision, pendingPlan) : []), [pendingRevision, pendingPlan])
  const blocked = worstStatus(pendingChecks) === 'violation'

  const onApprove = () => {
    if (!pendingRevision) return
    approve(note.trim() || undefined)
    setDecidedId(pendingRevision.id)
    setNote('')
  }

  const onReject = () => {
    if (!pendingRevision) return
    if (!note.trim()) {
      setShowReasonError(true)
      return
    }
    reject(note.trim())
    setDecidedId(pendingRevision.id)
    setNote('')
    setShowReasonError(false)
  }

  const compare: CompareRow[] =
    pendingPlan && pendingRevision
      ? [
          { key: 'end', label: t('schedule.approval.compare.end'), active: fmt.time(activePlan.end), pending: fmt.time(pendingPlan.end) },
          { key: 'late', label: t('schedule.approval.compare.late'), active: String(lateCount(activePlan)), pending: String(lateCount(pendingPlan)) },
          { key: 'milk', label: t('schedule.approval.compare.milk'), active: fmt.liters(Math.round(activePlan.milkRequiredL)), pending: fmt.liters(Math.round(pendingPlan.milkRequiredL)) },
          {
            key: 'variant',
            label: t('schedule.block.VARIANT'),
            active: fmt.duration(activeRevision.config.changeoverMin.VARIANT),
            pending: fmt.duration(pendingRevision.config.changeoverMin.VARIANT)
          },
          {
            key: 'util',
            label: t('planning.config.utilization'),
            active: fmt.pct(activeRevision.config.utilizationPct),
            pending: fmt.pct(pendingRevision.config.utilizationPct)
          }
        ].map((row) => ({ ...row, changed: row.active !== row.pending }))
      : []

  const compareColumns: DataTableColumn<CompareRow>[] = [
    { key: 'label', header: t('col.metric') },
    { key: 'active', header: t('schedule.approval.activeCol', { id: activeRevision.id }), type: 'number' },
    {
      key: 'pending',
      header: t('schedule.approval.pendingCol', { id: pendingRevision?.id ?? '' }),
      type: 'number',
      render: (row) => <span className={row.changed ? 'font-semibold text-brand' : undefined}>{row.pending}</span>
    }
  ]

  const revisionColumns: DataTableColumn<PlanRevision>[] = [
    { key: 'id', header: t('col.revision'), type: 'mono' },
    { key: 'generatedAt', header: t('col.generated'), type: 'number', sortable: true, render: (row) => fmt.time(row.generatedAt) },
    { key: 'generatedBy', header: t('col.generatedBy') },
    { key: 'decidedAt', header: t('col.decided'), type: 'number', render: (row) => (row.decidedAt !== undefined ? fmt.time(row.decidedAt) : '—') },
    { key: 'decidedBy', header: t('col.decidedBy') },
    { key: 'note', header: t('col.note'), className: 'text-ink min-w-[220px]' },
    { key: 'status', header: t('col.status'), type: 'status' }
  ]

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        {decided && !pendingRevision && (
          <ResultState
            status={decided.status}
            title={t(decided.status === 'approved' ? 'schedule.approval.approvedTitle' : 'schedule.approval.rejectedTitle', { id: decided.id })}
            description={t(decided.status === 'approved' ? 'schedule.approval.approvedBody' : 'schedule.approval.rejectedBody', { active: activeRevision.id })}
            details={[
              { label: t('col.decidedBy'), value: decided.decidedBy ?? '—' },
              { label: t('col.decided'), value: decided.decidedAt !== undefined ? fmt.time(decided.decidedAt) : '—' },
              { label: t('col.note'), value: decided.note ?? '—' }
            ]}
            actions={
              <>
                <Button onClick={() => void navigate({ to: '/production-schedule/recommended' })}>{t('schedule.approval.openSchedule')}</Button>
                <Button variant="outline" onClick={() => void navigate({ to: '/milk-traceability/audit-log' })}>
                  {t('schedule.approval.openAudit')}
                </Button>
              </>
            }
          />
        )}

        {pendingRevision && pendingPlan ? (
          <>
            <SectionPanel
              title={t('schedule.approval.reviewTitle', { id: pendingRevision.id })}
              subtitle={t('schedule.approval.reviewHint', { by: pendingRevision.generatedBy, time: fmt.time(pendingRevision.generatedAt) })}
            >
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <Card className="p-4">
                  <ScheduleTimeline lanes={lineLanes(pendingPlan, t)} start={SCENARIO.planWindow.start} end={Math.max(SCENARIO.planWindow.end, pendingPlan.end)} tickEvery={60} />
                </Card>
                <DataTable columns={compareColumns} rows={compare} rowKey={(row) => row.key} dense />
              </div>
            </SectionPanel>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SectionPanel variant="plain" title={t('schedule.approval.checks')}>
                <CheckList checks={pendingChecks} issuesOnly />
              </SectionPanel>
              <SectionPanel variant="plain" title={t('schedule.approval.decision')} subtitle={t('schedule.approval.decisionHint')}>
                <label className="block">
                  <span className="text-xs font-semibold text-ink-strong">{t('schedule.approval.note')}</span>
                  <textarea
                    value={note}
                    onChange={(event) => {
                      setNote(event.target.value)
                      setShowReasonError(false)
                    }}
                    rows={3}
                    placeholder={t('schedule.approval.notePlaceholder')}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                {showReasonError && <p className="text-xs text-danger mt-1">{t('schedule.approval.reasonRequired')}</p>}
                {blocked && <p className="text-xs text-danger mt-1">{t('schedule.approval.blocked')}</p>}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button icon={Check} onClick={onApprove} disabled={blocked}>
                    {t('schedule.approval.approve')}
                  </Button>
                  <Button variant="outline" icon={X} onClick={onReject}>
                    {t('schedule.approval.reject')}
                  </Button>
                </div>
              </SectionPanel>
            </div>
          </>
        ) : (
          !decided && (
            <EmptyState
              icon={Wand2}
              title={t('schedule.approval.emptyTitle')}
              description={t('schedule.approval.emptyBody', { id: activeRevision.id })}
              action={{ label: t('schedule.approval.emptyAction'), onClick: () => void navigate({ to: '/ai-planning/generate' }) }}
            />
          )
        )}

        <DataTable title={t('schedule.approval.history')} columns={revisionColumns} rows={[...revisions].reverse()} rowKey={(row) => row.id} dense />
      </div>
    </>
  )
}
