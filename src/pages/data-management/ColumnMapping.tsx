import React from 'react'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel } from '../../components/common/SectionPanel'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { useTranslation } from '../../lib/i18n'
import type { Tone } from '../../lib/status'

interface ColumnMappingProps {
  onContinue: () => void
  onReviewKeterangan?: () => void
}

interface MappingRow {
  original: string
  standard: string
  suggestion: string
  confidence: number
  status: string
  clickable?: boolean
}

const mappingData: MappingRow[] = [
  { original: 'Tank ID', standard: 'storage_tank_id', suggestion: 'Tank ID', confidence: 99, status: 'Validated' },
  { original: 'Volume Susu', standard: 'volume_liter', suggestion: 'Milk volume', confidence: 96, status: 'Validated' },
  { original: 'Tgl Produksi', standard: 'production_date', suggestion: 'Production date', confidence: 91, status: 'Validated' },
  { original: 'Kode Batch', standard: 'batch_id', suggestion: 'Batch identifier', confidence: 72, status: 'Review' },
  { original: 'Keterangan', standard: '—', suggestion: 'Unmapped', confidence: 38, status: 'Review', clickable: true }
]

const confidenceTone = (value: number): Tone => (value >= 90 ? 'success' : value >= 60 ? 'warning' : 'danger')

export const ColumnMapping: React.FC<ColumnMappingProps> = ({ onContinue, onReviewKeterangan }) => {
  const { t } = useTranslation()
  const columns: DataTableColumn<MappingRow>[] = [
    { key: 'original', header: 'Original column', render: (row) => <span className="font-semibold">{row.original}</span> },
    { key: 'standard', header: 'Standard field', render: (row) => <span className="font-mono text-xs">{row.standard}</span> },
    { key: 'suggestion', header: 'AI suggestion', render: (row) => <span className="text-ink">{row.suggestion}</span> },
    {
      key: 'confidence',
      header: 'Confidence',
      render: (row) => (
        <div className="flex items-center gap-2 w-32">
          <ProgressBar value={row.confidence} tone={confidenceTone(row.confidence)} />
          <span className="text-xs font-semibold tabular-nums w-9 text-right">{row.confidence}%</span>
        </div>
      )
    },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (row) =>
        row.clickable && onReviewKeterangan ? (
          <Button variant="link" size="sm" onClick={onReviewKeterangan}>
            {t('pages.data-management-mapping.reviewKeterangan')}
          </Button>
        ) : null
    }
  ]

  const reviewCount = mappingData.filter((row) => row.status === 'Review').length

  return (
    <>
      <PageHeader
        title={t('pages.data-management-mapping.title')}
        description={t('pages.data-management-mapping.description')}
        actions={
          <Button iconRight={ArrowRight} onClick={onContinue}>
            {t('pages.data-management-mapping.continue')}
          </Button>
        }
      />

      <SectionPanel
        title="Column mapping"
        subtitle="production_shift_A.xlsx · 5 source columns"
        actions={<Badge status="Review" shape="pill">{reviewCount} need review</Badge>}
      >
        <DataTable
          columns={columns}
          rows={mappingData}
          rowKey={(row) => row.original}
          onRowClick={(row) => row.clickable && onReviewKeterangan?.()}
          note="Confidence below 90% requires a reviewer"
        />
      </SectionPanel>
    </>
  )
}
