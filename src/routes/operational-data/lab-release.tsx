import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { CheckCallout } from '../../components/planning/CheckCallout'
import { DELIVERIES, LAB_RECORDS, type LabRecord } from '../../data/scenario'
import { checkReceivingGate } from '../../domain/checks'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { ScenarioNote } from '../../components/common/SourceNote'

export const Route = createFileRoute('/operational-data/lab-release')({ component: LabReleasePage })

function LabReleasePage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const time = (value?: number) => (value !== undefined ? fmt.time(value) : '—')

  const columns: DataTableColumn<LabRecord>[] = [
    { key: 'deliveryId', header: t('col.truck'), type: 'mono', sortable: true },
    { key: 'sampleId', header: t('col.sample'), type: 'mono' },
    {
      key: 'volume',
      header: t('col.volume'),
      type: 'number',
      value: (row) => DELIVERIES.find((d) => d.id === row.deliveryId)?.volumeL,
      render: (row) => fmt.liters(DELIVERIES.find((d) => d.id === row.deliveryId)?.volumeL ?? 0)
    },
    { key: 'sampling', header: t('col.sampling'), type: 'number', sortable: true, value: (row) => row.samplingStart, render: (row) => fmt.range(row.samplingStart, row.samplingEnd) },
    { key: 'labStart', header: t('col.labStart'), type: 'number', render: (row) => time(row.labStart) },
    { key: 'labEnd', header: t('col.labEnd'), type: 'number', render: (row) => time(row.labEnd) },
    {
      key: 'labDuration',
      header: t('col.labDuration'),
      type: 'number',
      value: (row) => (row.labEnd !== undefined ? row.labEnd - row.labStart : undefined),
      render: (row) => (row.labEnd !== undefined ? fmt.duration(row.labEnd - row.labStart) : '—')
    },
    { key: 'result', header: t('col.qcResult'), type: 'status' },
    { key: 'releaseTime', header: t('col.releaseTime'), type: 'number', sortable: true, render: (row) => time(row.releaseTime) },
    { key: 'releasedBy', header: t('col.releasedBy') },
    { key: 'qcStatus', header: t('col.qcStatus'), type: 'status', sortable: true }
  ]

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <CheckCallout check={checkReceivingGate()} />
        <DataTable
          title={t('ops.lab.table')}
          subtitle={t('ops.lab.tableHint')}
          columns={columns}
          rows={LAB_RECORDS}
          rowKey={(row) => row.sampleId}
          note={<ScenarioNote />}
        />
      </div>
    </>
  )
}
