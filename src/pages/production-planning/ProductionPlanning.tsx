import React from 'react'
import {
  ClipboardList,
  Cylinder,
  Factory,
  Milk,
  Sparkles,
  TriangleAlert,
  Upload
} from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { StatCard } from '../../components/common/StatCard'
import { ScheduleTimeline, type ScheduleLane } from '../../components/planning/ScheduleTimeline'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { IconTile } from '../../components/ui/IconTile'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { useTranslation } from '../../lib/i18n'
import type { Tone } from '../../lib/status'

interface ProductionPlanningProps {
  onOpenRecommendation?: () => void
}

const buildLanes = (t: (key: string) => string): ScheduleLane[] => [
  {
    label: t('pages.production-planning.filling1'),
    sublabel: 'via AT-02',
    blocks: [
      { label: 'Full Cream 1L', start: 7, end: 11.5, kind: 'plain' },
      { label: t('pages.production-planning.changeover'), start: 11.5, end: 12.25, kind: 'changeover' },
      { label: 'Strawberry 1L', start: 12.25, end: 15.75, kind: 'flavoured' },
      { label: 'Full Cream 250ml', start: 15.75, end: 19, kind: 'plain' }
    ]
  },
  {
    label: t('pages.production-planning.filling2'),
    sublabel: 'via AT-02',
    blocks: [
      { label: t('schedule.cip'), start: 7, end: 8.5, kind: 'cip' },
      { label: 'Strawberry 250ml', start: 8.5, end: 12.75, kind: 'flavoured' },
      { label: t('pages.production-planning.changeover'), start: 12.75, end: 13.5, kind: 'changeover' },
      { label: 'Full Cream 1L', start: 14.25, end: 19, kind: 'plain' }
    ]
  }
]

interface StatusRow {
  label: string
  value: string
  percent: number
  badge: string
  tone: Tone
  marker?: number
}

export const ProductionPlanning: React.FC<ProductionPlanningProps> = ({ onOpenRecommendation }) => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const lanes = buildLanes(t)
  const statusRows: StatusRow[] = [
    { label: t('pages.production-planning.rawMilkAvailability'), value: '18,420 L / 24,000 L', percent: 77, badge: '77%', tone: 'success' },
    { label: 'Storage Tank ST-04', value: '8,200 L / 12,000 L', percent: 68, badge: '68%', tone: 'success' },
    { label: 'Aseptic Tank AT-02', value: '6,300 L / 12,000 L', percent: 52.5, badge: '52.5% · 2 fillers', tone: 'success', marker: 50 },
    { label: t('pages.production-planning.machineReadiness'), value: t('pages.production-planning.machineReadyValue'), percent: 100, badge: t('status.ready'), tone: 'success' }
  ]

  return (
    <>
      <PageHeader
        title={t('pages.production-planning.title')}
        description={t('pages.production-planning.description')}
        actions={
          <>
            <Button variant="secondary" icon={Upload} onClick={() => navigate('data-management-upload')}>
              {t('pages.production-planning.uploadOrders')}
            </Button>
            <Button icon={Sparkles} onClick={onOpenRecommendation}>
              {t('pages.production-planning.aiRecommendation')}
            </Button>
          </>
        }
      />

      <div className="space-y-5">
        <SectionPanel title={t('pages.production-planning.shiftKpis')} subtitle={t('pages.production-planning.shiftKpisSubtitle')}>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <StatCard icon={Milk} label={t('pages.production-planning.availableRawMilk')} value="18,420 L" caption={t('pages.production-planning.vsYesterday')} captionTone="success" />
            <StatCard icon={ClipboardList} label={t('pages.production-planning.plannedOrders')} value="12" caption={t('pages.production-planning.dueThisShift')} captionTone="info" />
            <StatCard icon={Cylinder} label={t('pages.production-planning.tankUtilization')} value="72%" caption={t('pages.production-planning.withinRange')} captionStatus="Valid" />
            <StatCard icon={Factory} label={t('pages.production-planning.activeLines')} value="2 / 2" caption={t('pages.production-planning.readyToRun')} captionStatus="Completed" />
            <StatCard icon={TriangleAlert} label={t('pages.production-planning.scheduleAlerts')} value="2" caption={t('pages.production-planning.needsReview')} captionStatus="Review" />
          </div>
        </SectionPanel>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <SectionPanel
            title={t('pages.production-planning.shiftOutlook')}
            subtitle={t('pages.production-planning.shiftOutlookSubtitle')}
            className="lg:col-span-5"
            actions={<Badge status="Ready" shape="pill">{t('pages.production-planning.analysisReady')}</Badge>}
          >
            <Card className="p-5 flex flex-col gap-4 h-full" onClick={onOpenRecommendation}>
              <div className="flex items-start gap-3">
                <IconTile icon={Sparkles} tone="brand" />
                <div>
                  <p className="text-xs text-ink">{t('pages.production-planning.predictedBottleneck')}</p>
                  <p className="text-base font-bold text-ink-strong mt-0.5">{t('pages.production-planning.flavourDelayTitle')}</p>
                  <p className="text-sm text-ink">{t('pages.production-planning.flavourDelayBody')}</p>
                </div>
              </div>
              <div className="rounded-lg bg-brand-muted border border-brand-subtle px-3 py-2.5 text-sm font-medium text-ink-strong">
                {t('pages.production-planning.recommendation')}
              </div>
              <p className="text-[11px] text-ink">{t('pages.production-planning.confidenceNote')}</p>
            </Card>
          </SectionPanel>

          <SectionPanel
            title={t('pages.production-planning.productionSchedule')}
            subtitle={t('pages.production-planning.scheduleSubtitle')}
            className="lg:col-span-7"
            actions={
              <Button variant="link" size="sm" onClick={() => navigate('schedule-simulation')}>
                {t('pages.production-planning.openSimulation')}
              </Button>
            }
          >
            <Card className="p-4">
              <ScheduleTimeline lanes={lanes} startHour={7} endHour={19} tickEvery={2} />
            </Card>
          </SectionPanel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <SectionPanel title={t('pages.production-planning.operationalStatus')} className="lg:col-span-7">
            <Card className="px-5 py-2 divide-y divide-gray-100">
              {statusRows.map((row) => (
                <div key={row.label} className="py-3 grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                  <span className="sm:col-span-4 text-sm text-ink">{row.label}</span>
                  <div className="sm:col-span-5">
                    <p className="text-sm font-semibold text-ink-strong tabular-nums">{row.value}</p>
                    <ProgressBar value={row.percent} tone={row.tone} marker={row.marker} className="mt-1.5" />
                  </div>
                  <div className="sm:col-span-3 sm:text-right">
                    <Badge tone={row.tone}>{row.badge}</Badge>
                  </div>
                </div>
              ))}
            </Card>
          </SectionPanel>

          <SectionPanel
            title={t('pages.production-planning.scheduleAlerts')}
            className="lg:col-span-5"
            actions={<Badge status="Review" shape="pill">{t('pages.production-planning.reviewItems')}</Badge>}
          >
            <Card className="p-4 space-y-3">
              {[
                { title: t('pages.production-planning.alertChangeoverTitle'), detail: t('pages.production-planning.alertChangeoverDetail') },
                { title: t('pages.production-planning.alertAtTitle'), detail: t('pages.production-planning.alertAtDetail') }
              ].map((alert) => (
                <div key={alert.title} className="flex items-start gap-3">
                  <IconTile icon={TriangleAlert} tone="warning" size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-ink-strong">{alert.title}</p>
                    <p className="text-xs text-ink mt-0.5">{alert.detail}</p>
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-ink pt-2 border-t border-gray-100">
                {t('pages.production-planning.syntheticNote')}
              </p>
            </Card>
          </SectionPanel>
        </div>
      </div>
    </>
  )
}
