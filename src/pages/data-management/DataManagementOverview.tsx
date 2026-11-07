import React from 'react'
import { FileSpreadsheet, History, ShieldCheck, Upload } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel } from '../../components/common/SectionPanel'
import { ToolCard } from '../../components/common/ToolCard'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { EntityCell } from '../../components/common/EntityCell'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'

interface DataManagementOverviewProps {
  onOpenUpload: () => void
  onOpenRecent: () => void
}

interface ImportRow {
  file: string
  rows: string
  status: string
  imported: string
}

const imports: ImportRow[] = [
  { file: 'production_shift_A.xlsx', rows: '1,248', status: 'Imported', imported: '30 Oct 2026' },
  { file: 'tanker_receipts_30oct.xlsx', rows: '84', status: 'Needs review', imported: '—' },
  { file: 'batch_master_sep.xlsx', rows: '3,920', status: 'Imported', imported: '29 Sep 2026' }
]

const columns: DataTableColumn<ImportRow>[] = [
  { key: 'file', header: 'File', render: (row) => <EntityCell icon={FileSpreadsheet} id={row.file} /> },
  { key: 'rows', header: 'Rows', align: 'right', render: (row) => <span className="tabular-nums">{row.rows}</span> },
  { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
  { key: 'imported', header: 'Imported', render: (row) => <span className="text-ink">{row.imported}</span> }
]

export const DataManagementOverview: React.FC<DataManagementOverviewProps> = ({ onOpenUpload, onOpenRecent }) => (
  <>
    <PageHeader
      title="Data Management"
      description="Governed ingestion and validation for operational production data"
      actions={
        <Button icon={Upload} onClick={onOpenUpload}>
          Upload file
        </Button>
      }
    />

    <div className="space-y-5">
      <SectionPanel title="Ingestion tools">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ToolCard
            icon={Upload}
            title="Smart Excel ingestion"
            description="Map spreadsheets with AI assistance, then validate before import."
            onClick={onOpenUpload}
          />
          <ToolCard
            icon={History}
            iconTone="info"
            title="Recent imports"
            description="production_shift_A.xlsx · 1,248 records"
            onClick={onOpenRecent}
          />
          <ToolCard
            icon={ShieldCheck}
            iconTone="success"
            title="Validation health"
            description="98.4% valid · 20 records need review"
            badge={<Badge status="Valid">98.4%</Badge>}
          >
            <ProgressBar value={98.4} tone="success" />
          </ToolCard>
        </div>
      </SectionPanel>

      <SectionPanel title="Import log" subtitle="Latest files ingested into the operational store">
        <DataTable
          columns={columns}
          rows={imports}
          rowKey={(row) => row.file}
          onRowClick={onOpenRecent}
          footer={`Showing ${imports.length} recent files`}
        />
      </SectionPanel>
    </div>
  </>
)
