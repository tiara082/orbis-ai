import React from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel } from '../../components/common/SectionPanel'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { EntityCell } from '../../components/common/EntityCell'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface ImportHistoryProps {
  onOpenError?: () => void
}

interface HistoryRow {
  importId: string
  file: string
  records: string
  actor: string
  status: string
}

const historyData: HistoryRow[] = [
  { importId: 'IMP-1030-04', file: 'production_shift_A.xlsx', records: '1,248', actor: 'Ana Putri', status: 'Imported' },
  { importId: 'IMP-1030-03', file: 'tanker_receipts_30oct.xlsx', records: '84', actor: 'Raka Wijaya', status: 'Review' },
  { importId: 'IMP-1029-01', file: 'tank_snapshot_29oct.xlsx', records: '20', actor: 'Raka Wijaya', status: 'Failed' },
  { importId: 'IMP-0929-02', file: 'batch_master_sep.xlsx', records: '3,920', actor: 'System', status: 'Imported' }
]

export const ImportHistory: React.FC<ImportHistoryProps> = ({ onOpenError }) => {
  const { t } = useTranslation()
  const columns: DataTableColumn<HistoryRow>[] = [
    { key: 'importId', header: 'Import ID', render: (row) => <span className="font-mono text-xs font-semibold">{row.importId}</span> },
    { key: 'file', header: 'File', render: (row) => <EntityCell icon={FileSpreadsheet} id={row.file} /> },
    { key: 'records', header: 'Records', align: 'right', render: (row) => <span className="tabular-nums">{row.records}</span> },
    { key: 'actor', header: 'Actor' },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (row) =>
        row.status === 'Failed' && onOpenError ? (
          <Button variant="link" size="sm" onClick={onOpenError}>
            {t('pages.data-management-history.viewError')}
          </Button>
        ) : null
    }
  ]

  return (
    <>
      <PageHeader title={t('pages.data-management-history.title')} description={t('pages.data-management-history.description')} />
      <SectionPanel title={t('pages.data-management-history.imports')} subtitle={t('pages.data-management-history.importsSubtitle')}>
        <DataTable
          columns={columns}
          rows={historyData}
          rowKey={(row) => row.importId}
          onRowClick={(row) => row.status === 'Failed' && onOpenError?.()}
          footer={`Showing ${historyData.length} imports`}
          note="Synthetic Demo Data"
        />
      </SectionPanel>
    </>
  )
}
