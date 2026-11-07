import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { ScenarioNote } from '../../components/common/SourceNote'
import { PageHeader } from '../../components/layout/PageHeader'
import { CheckList } from '../../components/planning/CheckList'
import { asepticLanes } from '../../components/planning/planLanes'
import { ScheduleTimeline } from '../../components/planning/ScheduleTimeline'
import { SCENARIO, getAssetState, type Batch } from '../../data/scenario'
import { createScenarioTraceabilitySnapshot } from '../../data/traceability'
import { checkCapacity, checkHolding, holdingStatuses } from '../../domain/checks'
import { descendants, transfersOutOf } from '../../domain/genealogy'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { revisionDiagnostics, usePlanning } from '../../state/planning'
import { RevisionBadge } from './-components/RevisionBadge'

export const Route = createFileRoute('/production-schedule/tank-allocation')({ component: TankAllocationPage })

const TANK_RULES = ['AT_SAME_PRODUCT', 'AT_SHARED_FLOW', 'SIMULTANEOUS', 'HOLDING', 'MILK_BALANCE']

function TankAllocationPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { activePlan, activeRevision } = usePlanning()
  const traceability = useMemo(() => createScenarioTraceabilitySnapshot('traceability-tank-allocation', '2026-10-30'), [])
  const holding = new Map(holdingStatuses(undefined, activePlan.dependencies).map((status) => [status.batchId, status]))
  const approvedChecks = revisionDiagnostics(activeRevision, activePlan).filter((check) => TANK_RULES.includes(check.ruleId))
  const runtimeChecks = [checkCapacity(activePlan.dependencies), checkHolding(activePlan.dependencies)]
    .filter((check) => TANK_RULES.includes(check.ruleId))
  const legacyDiagnostic = activeRevision.diagnostics === undefined
  const currentTankStates = activePlan.dependencies.operational.assetStates.filter((state) => state.assetId.startsWith('AT-') || state.assetId.startsWith('RMT-') || state.assetId.startsWith('SFP-'))
  const traceabilityRows = traceability.batches.filter((batch) => (batch.kind === 'storage' || batch.kind === 'aseptic') && batch.dayOffset === 0)

  /** Material that feeds today's orders: SFP and aseptic batches that end in finished goods */
  const rows = traceabilityRows
  const ordersFed = (batch: Batch) => {
    const finished = descendants(batch.id, traceability).batches.filter((b) => b.kind === 'finished')
    return [...new Set(finished.map((b) => activePlan.orders.find((order) => order.finishedSkuId === b.finishedSkuId)?.orderId).filter(Boolean))].join(', ')
  }

  const columns: DataTableColumn<Batch>[] = [
    { key: 'assetId', header: t('col.tank'), type: 'mono', sortable: true },
    { key: 'id', header: t('col.batch'), type: 'mono' },
    { key: 'material', header: t('col.material') },
    { key: 'volumeL', header: t('col.batchVolume'), type: 'number', render: (row) => fmt.liters(row.volumeL) },
    {
      key: 'current',
      header: t('col.volumeNow'),
      type: 'number',
      render: (row) => {
        const state = getAssetState(row.assetId)
        return state?.batchId === row.id ? fmt.liters(state.volumeL ?? 0) : fmt.liters(0)
      }
    },
    { key: 'next', header: t('col.sentTo'), type: 'mono', render: (row) => transfersOutOf(row.id, traceability).map((tr) => tr.toBatch).join(', ') || '—' },
    { key: 'orders', header: t('col.orders'), render: (row) => ordersFed(row) || '—' },
    {
      key: 'holding',
      header: t('col.holding'),
      type: 'number',
      render: (row) => {
        const status = holding.get(row.id)
        return status ? t('ops.remaining', { time: fmt.duration(status.remainingMin) }) : '—'
      }
    },
    { key: 'status', header: t('col.status'), type: 'status' }
  ]

  return (
    <>
      <PageHeader titleAddon={<RevisionBadge />} />
      <div className="space-y-5">
        <SectionPanel title={t('schedule.tanks.aseptic')} subtitle={t('schedule.tanks.asepticHint')}>
          <Card className="p-4">
            <ScheduleTimeline lanes={asepticLanes(activePlan, t)} start={SCENARIO.planWindow.start} end={Math.max(SCENARIO.planWindow.end, activePlan.end)} tickEvery={60} legend={['plain', 'flavoured', 'cip', 'level']} />
          </Card>
        </SectionPanel>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <SectionPanel variant="plain" title={t('schedule.tanks.approvedDiagnostics')} subtitle={t('schedule.tanks.approvedDiagnosticsHint', { id: activeRevision.id })}>
            {legacyDiagnostic && <p className="mb-3 text-xs text-warning">{t('schedule.tanks.legacyDiagnostic')}</p>}
            <CheckList checks={approvedChecks} />
          </SectionPanel>
          <SectionPanel variant="plain" title={t('schedule.tanks.runtimeStatus')} subtitle={t('schedule.tanks.runtimeStatusHint')}>
            <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-ink">
              <span>{t('schedule.tanks.currentTanks')}: {currentTankStates.length}</span>
              <span>{t('schedule.tanks.currentHolding')}: {holding.size}</span>
            </div>
            <CheckList checks={runtimeChecks} />
          </SectionPanel>
        </div>
        <SectionPanel variant="plain" title={t('schedule.tanks.traceability')} subtitle={t('schedule.tanks.traceabilityHint')}>
          <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} note={<ScenarioNote />} />
        </SectionPanel>
      </div>
    </>
  )
}
