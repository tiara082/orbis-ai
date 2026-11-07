import React from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel } from '../../components/common/SectionPanel'
import { ResultState } from '../../components/common/ResultState'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { Badge } from '../../components/ui/Badge'
import { useTranslation } from '../../lib/i18n'

interface CheckRow {
  reference: string
  value: string
  status: string
}

const checkData: CheckRow[] = [
  { reference: 'Record hash', value: 'sha256: demo-8f3a...', status: 'Match' },
  { reference: 'Previous reference', value: 'EVT-1030-881', status: 'Match' },
  { reference: 'Verification status', value: '8/8 verified', status: 'Recorded' }
]

const columns: DataTableColumn<CheckRow>[] = [
  { key: 'reference', header: 'Reference', render: (row) => <span className="font-semibold">{row.reference}</span> },
  { key: 'value', header: 'Value', render: (row) => <span className="font-mono text-xs text-ink">{row.value}</span> },
  { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} variant="outline" /> }
]

export const AuditIntegrityCheck: React.FC = () => {
  const { t } = useTranslation()
  return (
  <>
    <PageHeader title={t('pages.audit-integrity-check.title')} description={t('pages.audit-integrity-check.description')} />

    <div className="space-y-5">
      <ResultState
        status="Integrity match"
        title="EVT-1030-882 · operational record matches stored integrity evidence"
        description="8/8 is a progress indicator only; verification stages are not specified here."
      />

      <SectionPanel title={t('pages.audit-integrity-check.compared')}>
        <DataTable columns={columns} rows={checkData} rowKey={(row) => row.reference} />
      </SectionPanel>
    </div>
  </>
  )
}
