import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { CheckCallout } from '../../components/planning/CheckCallout'
import { ScheduleTimeline, type ScheduleBlock, type ScheduleLane } from '../../components/planning/ScheduleTimeline'
import { Badge } from '../../components/ui/Badge'
import type { Delivery } from '../../data/scenario'
import { checkBayExclusive } from '../../domain/checks'
import { bayStates, estimatedUnloadMin, unloadDurationMin, type BayState } from '../../domain/receiving'
import { at } from '../../domain/time'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { ScenarioNote } from '../../components/common/SourceNote'
import { usePlanning } from '../../state/planning'

export const Route = createFileRoute('/operational-data/unloading-bay')({ component: UnloadingBayPage })

function UnloadingBayPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { activePlan } = usePlanning()
  const dependencies = activePlan.dependencies
  const bays = dependencies.operational.bays ?? []
  const deliveries = dependencies.operational.deliveries ?? []
  const snapshot = dependencies.operational.snapshot ?? 0
  const states = bayStates(undefined, dependencies)
  const activeCount = bays.filter((bay) => bay.active).length

  const bayColumns: DataTableColumn<BayState>[] = [
    { key: 'bay', header: t('col.bay'), type: 'mono', value: (row) => row.bay.bayId },
    { key: 'active', header: t('col.active'), render: (row) => <Badge status={row.bay.active ? 'ready' : 'inactive'} /> },
    { key: 'tankers', header: t('col.tankersPerBay'), type: 'number', value: (row) => row.bay.tankersPerBay },
    { key: 'pump', header: t('col.pumpFlow'), type: 'number', value: (row) => row.bay.pumpFlowLph, render: (row) => fmt.lph(row.bay.pumpFlowLph) },
    { key: 'cip', header: t('col.cipDuration'), type: 'number', value: (row) => row.bay.cipMinutes, render: (row) => fmt.duration(row.bay.cipMinutes) },
    { key: 'unloads', header: t('col.unloadsToday'), type: 'number', value: (row) => row.unloadCount },
    {
      key: 'current',
      header: t('col.currentTanker'),
      render: (row) => (row.current ? <span className="font-mono text-xs">{row.current.id}</span> : '—')
    },
    {
      key: 'freeAt',
      header: t('col.freeAt'),
      type: 'number',
      render: (row) =>
        row.bay.maintenance ? t('ops.bay.maintenanceUntil', { time: fmt.time(row.bay.maintenance.end) }) : row.freeAt !== undefined ? fmt.time(row.freeAt) : '—'
    },
    { key: 'availability', header: t('col.availability'), type: 'status', value: (row) => row.availability }
  ]

  const unloaded = deliveries.filter((delivery) => delivery.bayId)
  const unloadColumns: DataTableColumn<Delivery>[] = [
    { key: 'id', header: t('col.truck'), type: 'mono' },
    { key: 'bayId', header: t('col.bay'), type: 'mono', sortable: true },
    { key: 'volumeL', header: t('col.unloadVolume'), type: 'number', render: (row) => fmt.liters(row.volumeL) },
    {
      key: 'estimate',
      header: t('col.estimatedDuration'),
      type: 'number',
      hint: t('ops.bay.estimateHint'),
      render: (row) => {
        const bay = bays.find((b) => b.bayId === row.bayId)
        return bay ? fmt.duration(estimatedUnloadMin(row.volumeL, bay)) : '—'
      }
    },
    { key: 'start', header: t('col.unloadStart'), type: 'number', render: (row) => (row.unloadStart !== undefined ? fmt.time(row.unloadStart) : '—') },
    { key: 'end', header: t('col.unloadEnd'), type: 'number', render: (row) => (row.unloadEnd !== undefined ? fmt.time(row.unloadEnd) : '—') },
    {
      key: 'actual',
      header: t('col.actualDuration'),
      type: 'number',
      render: (row) => {
        const duration = unloadDurationMin(row)
        return duration !== undefined ? fmt.duration(duration) : <Badge status="lab pending" />
      }
    },
    { key: 'dest', header: t('col.destination'), render: (row) => row.destinations.map((d) => `${d.tankId} (${fmt.liters(d.volumeL)})`).join(' + ') || '—' }
  ]

  const lanes: ScheduleLane[] = bays.map((bay) => {
    const blocks: ScheduleBlock[] = []
    for (const delivery of deliveries.filter((d) => d.bayId === bay.bayId)) {
      if (delivery.arrival !== undefined && delivery.unloadStart === undefined) {
        blocks.push({ id: `${delivery.id}-wait`, label: delivery.id, sublabel: t('status.lab pending'), start: delivery.arrival, end: snapshot, kind: 'wait' })
      }
      if (delivery.unloadStart !== undefined && delivery.unloadEnd !== undefined) {
        blocks.push({ id: delivery.id, label: delivery.id, start: delivery.unloadStart, end: delivery.unloadEnd, kind: 'plain' })
        blocks.push({ id: `${delivery.id}-cip`, label: 'CIP', start: delivery.unloadEnd, end: delivery.unloadEnd + bay.cipMinutes, kind: 'cip' })
      }
    }
    if (bay.maintenance) blocks.push({ id: `${bay.bayId}-m`, label: t('schedule.block.maintenance'), start: bay.maintenance.start, end: bay.maintenance.end, kind: 'maintenance' })
    return { id: bay.bayId, label: bay.bayId, sublabel: fmt.lph(bay.pumpFlowLph), blocks }
  })

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <CheckCallout check={checkBayExclusive(dependencies)} />

        <DataTable
          title={t('ops.bay.table')}
          subtitle={t('ops.bay.tableHint', { active: activeCount, total: bays.length })}
          columns={bayColumns}
          rows={states}
          rowKey={(row) => row.bay.bayId}
          note={<ScenarioNote />}
        />

        <SectionPanel title={t('ops.bay.timeline')} subtitle={t('ops.bay.timelineHint')}>
          <Card className="p-4">
            <ScheduleTimeline
              lanes={lanes}
              start={at('00:00')}
              end={at('14:00')}
              now={snapshot}
              nowLabel={fmt.time(snapshot)}
              legend={['plain', 'cip', 'wait', 'maintenance']}
              legendLabels={{ plain: t('ops.bay.unloadingBlock'), wait: t('ops.bay.waitingBlock') }}
            />
          </Card>
        </SectionPanel>

        <DataTable title={t('ops.bay.unloads')} columns={unloadColumns} rows={unloaded} rowKey={(row) => row.id} note={<ScenarioNote />} />
      </div>
    </>
  )
}
