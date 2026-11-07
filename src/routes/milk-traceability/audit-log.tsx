import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { ScenarioNote } from '../../components/common/SourceNote'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { SegmentedFilter } from '../../components/ui/SegmentedFilter'
import { buildAuditIntegrity, verifyAuditIntegrity, type AuditIntegrityResult } from '../../data/audit-integrity'
import { SCENARIO_AUDIT_EVENTS, type AuditEvent } from '../../data/scenario'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'

export const Route = createFileRoute('/milk-traceability/audit-log')({ component: AuditLogPage })

type Category = 'all' | 'receiving' | 'process' | 'planning'

const CATEGORY: Record<string, Exclude<Category, 'all'>> = {
  labRelease: 'receiving', tankerArrived: 'receiving', transfer: 'process', split: 'process', batchCreated: 'process', coProduct: 'process', cipStarted: 'process', productionStarted: 'process', planGenerated: 'planning', planApproved: 'planning', planRejected: 'planning'
}

export function AuditLogPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { events } = usePlanning()
  const [category, setCategory] = useState<Category>('all')
  const [integrity, setIntegrity] = useState<AuditIntegrityResult>({ status: 'unavailable', records: [], checkedCount: 0, reason: 'Checking local integrity' })
  const all = useMemo(() => [...SCENARIO_AUDIT_EVENTS, ...events].sort((a, b) => b.time - a.time), [events])
  const integrityEvents = useMemo(() => [
    ...SCENARIO_AUDIT_EVENTS.map((event) => ({ source: 'scenario' as const, event })),
    ...events.map((event) => ({ source: 'planning-session' as const, event }))
  ], [events])
  const integrityKey = useMemo(() => JSON.stringify(integrityEvents), [integrityEvents])
  const [verifiedKey, setVerifiedKey] = useState('')

  useEffect(() => {
    let active = true
    void buildAuditIntegrity(integrityEvents)
      .then(verifyAuditIntegrity)
      .then((result) => { if (active) { setIntegrity(result); setVerifiedKey(integrityKey) } })
      .catch((error: unknown) => { if (active) setIntegrity({ status: 'unavailable', records: [], checkedCount: 0, reason: error instanceof Error ? error.message : 'Integrity verification failed' }) })
    return () => { active = false }
  }, [integrityEvents, integrityKey])

  const rows = category === 'all' ? all : all.filter((event) => CATEGORY[event.action] === category)
  const checking = verifiedKey !== integrityKey
  const integrityLabel = checking ? t('trace.audit.integrity.checking') : integrity.status === 'consistent' ? t('trace.audit.integrity.consistent') : integrity.status === 'broken' ? t('trace.audit.integrity.broken') : t('trace.audit.integrity.unavailable')
  const integrityBadge = checking ? 'pending' : integrity.status === 'consistent' ? 'valid' : integrity.status === 'broken' ? 'invalid' : 'pending'
  const columns: DataTableColumn<AuditEvent>[] = [
    { key: 'time', header: t('col.time'), type: 'number', sortable: true, render: (row) => fmt.time(row.time) },
    { key: 'id', header: t('col.event'), type: 'mono' },
    { key: 'action', header: t('col.action'), sortable: true, render: (row) => t(`audit.action.${row.action}`) },
    { key: 'entity', header: t('col.entity'), className: 'font-mono text-xs' },
    { key: 'actor', header: t('col.actor'), sortable: true },
    { key: 'ruleId', header: t('col.rule'), render: (row) => row.ruleId ? <Badge tone="neutral" variant="outline" icon={null} className="font-mono">{row.ruleId}</Badge> : '—' },
    { key: 'category', header: t('col.category'), value: (row) => CATEGORY[row.action], render: (row) => t(`trace.audit.category.${CATEGORY[row.action]}`) }
  ]
  const count = (value: Exclude<Category, 'all'>) => all.filter((event) => CATEGORY[event.action] === value).length

  return <>
    <PageHeader />
    <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-ink-strong">{integrityLabel}</p><p className="text-xs text-ink">{t('trace.audit.integrity.checked', { count: integrity.checkedCount })}</p></div><Badge status={integrityBadge} /></div>
      {!checking && integrity.status !== 'consistent' && integrity.reason && <p className="mt-1 text-xs text-ink">{integrity.reason}</p>}
    </div>
    <DataTable title={t('trace.audit.table')} subtitle={t('trace.audit.tableHint')} toolbar={<SegmentedFilter value={category} onChange={setCategory} options={[{ value: 'all', label: t('common.all'), count: all.length }, { value: 'receiving', label: t('trace.audit.category.receiving'), count: count('receiving') }, { value: 'process', label: t('trace.audit.category.process'), count: count('process') }, { value: 'planning', label: t('trace.audit.category.planning'), count: count('planning') }]} />} columns={columns} rows={rows} rowKey={(row) => row.id} searchText={(row) => `${row.entity} ${row.actor} ${t(`audit.action.${row.action}`)} ${row.ruleId ?? ''}`} pageSize={15} note={<ScenarioNote />} />
  </>
}
