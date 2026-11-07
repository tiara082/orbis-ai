import React from 'react'
import { Boxes, CircleCheck } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel } from '../../components/common/SectionPanel'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { EntityCell } from '../../components/common/EntityCell'
import { Callout } from '../../components/common/Callout'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface ImportPreviewProps {
  onConfirm: () => void
}

interface PreviewRow {
  batchId: string
  tankId: string
  volume: string
  date: string
  validation: string
}

const previewData: PreviewRow[] = [
  { batchId: 'B-2026-1030-01', tankId: 'ST-04', volume: '8,200 L', date: '30 Oct', validation: 'Valid' },
  { batchId: 'B-2026-1030-02', tankId: 'ST-04', volume: '6,300 L', date: '30 Oct', validation: 'Valid' },
  { batchId: 'B-2026-1030-03', tankId: 'ST-02', volume: '3,920 L', date: '30 Oct', validation: 'Valid' },
  { batchId: 'B-2026-1030-04', tankId: 'ST-07', volume: '1,880 L', date: '30 Oct', validation: 'Review' }
]

const columns: DataTableColumn<PreviewRow>[] = [
  { key: 'batchId', header: 'Batch', render: (row) => <EntityCell icon={Boxes} id={row.batchId} mono /> },
  { key: 'tankId', header: 'Tank', render: (row) => <span className="font-mono text-xs">{row.tankId}</span> },
  { key: 'volume', header: 'Volume', align: 'right', render: (row) => <span className="tabular-nums font-semibold">{row.volume}</span> },
  { key: 'date', header: 'Date', render: (row) => <span className="text-ink">{row.date}</span> },
  { key: 'validation', header: 'Validation', render: (row) => <Badge status={row.validation} /> }
]

export const ImportPreview: React.FC<ImportPreviewProps> = ({ onConfirm }) => {
  const { t } = useTranslation()
  return (
  <>
    <PageHeader
      title={t('pages.data-management-preview.title')}
      description={t('pages.data-management-preview.description')}
      titleAddon={<Badge status="Ready" size="md" shape="pill">{t('pages.data-management-preview.ready')}</Badge>}
      actions={
        <Button icon={CircleCheck} onClick={onConfirm}>
          {t('pages.data-management-preview.confirm')}
        </Button>
      }
    />

    <div className="space-y-5">
      <SectionPanel title={t('pages.data-management-preview.records')} subtitle={t('pages.data-management-preview.recordsSubtitle')}>
        <DataTable columns={columns} rows={previewData} rowKey={(row) => row.batchId} />
      </SectionPanel>

      <Callout
        tone="info"
        title="Import creates a governed event ledger entry"
        description="It does not infer missing relationships. Unlinked records stay flagged until a reviewer connects them."
      />
    </div>
  </>
  )
}
