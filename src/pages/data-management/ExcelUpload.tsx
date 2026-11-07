import React, { useState } from 'react'
import { CircleCheck, Download, FileSpreadsheet, ScanSearch, Upload } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { ToolCard } from '../../components/common/ToolCard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { IconTile } from '../../components/ui/IconTile'
import { useTranslation } from '../../lib/i18n'

interface ExcelUploadProps {
  onAnalyze: () => void
}

const templates = [
  {
    file: 'template_asset_parameters.csv',
    label: 'Asset parameters',
    description: 'Tank capacity, flow rates, filling speed, holding time, CIP duration'
  },
  {
    file: 'template_changeover_cip_durations.csv',
    label: 'Changeover & CIP durations',
    description: 'Actual minutes per Variant / Size / Paper change and CIP trigger'
  },
  {
    file: 'template_production_orders.csv',
    label: 'Production orders',
    description: 'Daily orders per finished SKU, volume target, deadline, priority'
  },
  {
    file: 'template_tanker_deliveries.csv',
    label: 'Tanker deliveries',
    description: 'Incoming road tankers from farm delivery notes, volume and ETA'
  },
  {
    file: 'template_tank_snapshot.csv',
    label: 'Tank snapshot (06:00)',
    description: 'Opening volume, batch, holding start and CIP status per tank'
  },
  {
    file: 'template_asset_availability.csv',
    label: 'Asset availability',
    description: 'Planned maintenance, trial, calibration and CIP windows'
  },
  {
    file: 'template_farms.csv',
    label: 'Farms',
    description: 'Master data of supplying farms for origin traceability'
  }
]

const checklist = [
  'Review AI mappings',
  'Resolve low-confidence fields',
  'Validate records before import',
  'Synthetic Demo Data only'
]

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onAnalyze }) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const { t } = useTranslation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name)
    }
  }

  return (
    <>
      <PageHeader
        title={t('pages.data-management-upload.title')}
        description={t('pages.data-management-upload.description')}
        actions={
          <Button icon={ScanSearch} onClick={onAnalyze}>
            {t('pages.data-management-upload.analyze')}
          </Button>
        }
      />

      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <SectionPanel title={t('pages.data-management-upload.file')} className="lg:col-span-8">
            <label className="cursor-pointer bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-subtle hover:bg-brand-muted/30 transition-colors p-10 min-h-[300px] flex flex-col items-center justify-center text-center">
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} className="hidden" />
              <IconTile icon={selectedFileName ? FileSpreadsheet : Upload} tone="brand" size="lg" shape="circle" />
              <h3 className="mt-4 text-lg font-bold tracking-tight text-ink-strong">
                {selectedFileName ? 'File ready for analysis' : 'Drop Excel file here'}
              </h3>
              <p className="text-sm text-ink mt-1 mb-5">
                {selectedFileName ?? 'or choose a file from your computer · .xlsx, .xls, .csv'}
              </p>
              {selectedFileName ? (
                <Badge status="Ready" size="md">Selected</Badge>
              ) : (
                <span className="inline-flex items-center h-9 px-4 rounded-lg bg-brand text-white text-sm font-medium">
                  Choose file
                </span>
              )}
            </label>
          </SectionPanel>

          <SectionPanel title={t('pages.data-management-upload.before')} className="lg:col-span-4">
            <Card className="p-5 h-full">
              <ul className="space-y-3.5 text-sm text-ink-strong">
                {checklist.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CircleCheck className="w-4 h-4 text-success shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </SectionPanel>
        </div>

        <SectionPanel title={t('pages.data-management-upload.templates')} subtitle={t('pages.data-management-upload.templatesSubtitle')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((template) => (
              <a key={template.file} href={`/templates/${template.file}`} download className="block group">
                <ToolCard
                  icon={Download}
                  title={template.label}
                  description={template.description}
                  className="h-full transition-colors group-hover:border-brand-subtle"
                  badge={<Badge tone="neutral">CSV</Badge>}
                >
                  <p className="text-[11px] font-mono text-ink truncate">{template.file}</p>
                </ToolCard>
              </a>
            ))}
          </div>
        </SectionPanel>
      </div>
    </>
  )
}
