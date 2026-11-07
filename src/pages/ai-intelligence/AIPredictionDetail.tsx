import React from 'react'
import { Clock, Cylinder, Gauge, Timer, Truck } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { StatCard } from '../../components/common/StatCard'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { IconTile } from '../../components/ui/IconTile'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { useTranslation } from '../../lib/i18n'

interface AIPredictionDetailProps {
  onOpenInsufficient?: () => void
}

interface ComparisonRow {
  comparison: string
  baseline: string
  prediction: string
  limitations: string
}

const comparisonData: ComparisonRow[] = [
  { comparison: 'Similar shift · 29 Oct', baseline: '18:15', prediction: '17:30', limitations: 'Synthetic sample' },
  { comparison: 'Order sequence', baseline: 'Full Cream → Strawberry', prediction: 'Full Cream → Strawberry', limitations: 'Changeover remains' },
  { comparison: 'Operational check', baseline: 'AT-02 52.5%', prediction: 'Pass', limitations: 'Planner approval required' }
]

const columns: DataTableColumn<ComparisonRow>[] = [
  { key: 'comparison', header: 'Historical comparison', render: (row) => <span className="font-semibold">{row.comparison}</span> },
  { key: 'baseline', header: 'Baseline' },
  {
    key: 'prediction',
    header: 'Prediction',
    render: (row) => (row.prediction === 'Pass' ? <Badge status="Passed">Pass</Badge> : row.prediction)
  },
  { key: 'limitations', header: 'Limitations', render: (row) => <span className="text-ink">{row.limitations}</span> }
]

const factors = [
  { icon: Truck, label: 'TRK-045 +35 min delay', detail: 'Incoming tanker signal' },
  { icon: Timer, label: '45 min changeover window', detail: 'Strawberry → Full Cream' },
  { icon: Cylinder, label: 'AT-02 at 52.5%', detail: 'Two-filler threshold' }
]

export const AIPredictionDetail: React.FC<AIPredictionDetailProps> = ({ onOpenInsufficient }) => {
  const { t } = useTranslation()
  return (
  <>
    <PageHeader
      title={t('pages.ai-prediction-detail.title')}
      description={t('pages.ai-prediction-detail.description')}
      actions={
        onOpenInsufficient && (
          <Button variant="secondary" onClick={onOpenInsufficient}>
            {t('pages.ai-prediction-detail.insufficient')}
          </Button>
        )
      }
    />

    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <SectionPanel title={t('pages.ai-prediction-detail.modelOutput')} className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard icon={Clock} label="Predicted completion" value="17:30" caption="45 min impact" captionStatus="Warning" />
            <StatCard
              icon={Gauge}
              label="Prediction confidence"
              value="82%"
              valueClassName="text-brand"
              caption="Simulated model output · not verified accuracy"
            >
              <ProgressBar value={82} className="mt-3" />
            </StatCard>
          </div>
        </SectionPanel>

        <SectionPanel title={t('pages.ai-prediction-detail.inputFactors')} className="lg:col-span-4">
          <Card className="p-4 space-y-3">
            {factors.map((factor) => (
              <div key={factor.label} className="flex items-center gap-3">
                <IconTile icon={factor.icon} size="sm" tone="brand" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink-strong">{factor.label}</p>
                  <p className="text-[11px] text-ink">{factor.detail}</p>
                </div>
              </div>
            ))}
          </Card>
        </SectionPanel>
      </div>

      <SectionPanel title={t('pages.ai-prediction-detail.historical')} subtitle={t('pages.ai-prediction-detail.historicalSubtitle')}>
        <DataTable columns={columns} rows={comparisonData} rowKey={(row) => row.comparison} />
      </SectionPanel>
    </div>
  </>
  )
}
