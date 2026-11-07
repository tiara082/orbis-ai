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
import type { Tone } from '../../lib/status'

interface ProductionPlanningProps {
  onOpenRecommendation?: () => void
}

const lanes: ScheduleLane[] = [
  {
    label: 'Filling Machine 1',
    sublabel: 'via AT-02',
    blocks: [
      { label: 'Full Cream 1L', start: 7, end: 11.5, kind: 'plain' },
      { label: 'Changeover', start: 11.5, end: 12.25, kind: 'changeover' },
      { label: 'Strawberry 1L', start: 12.25, end: 15.75, kind: 'flavoured' },
      { label: 'Full Cream 250ml', start: 15.75, end: 19, kind: 'plain' }
    ]
  },
  {
    label: 'Filling Machine 2',
    sublabel: 'via AT-02',
    blocks: [
      { label: 'CIP', start: 7, end: 8.5, kind: 'cip' },
      { label: 'Strawberry 250ml', start: 8.5, end: 12.75, kind: 'flavoured' },
      { label: 'Changeover', start: 12.75, end: 13.5, kind: 'changeover' },
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

const statusRows: StatusRow[] = [
  { label: 'Raw milk availability', value: '18,420 L / 24,000 L', percent: 77, badge: '77%', tone: 'success' },
  { label: 'Storage Tank ST-04', value: '8,200 L / 12,000 L', percent: 68, badge: '68%', tone: 'success' },
  { label: 'Aseptic Tank AT-02', value: '6,300 L / 12,000 L', percent: 52.5, badge: '52.5% · 2 fillers', tone: 'success', marker: 50 },
  { label: 'Machine readiness', value: 'Filling 1 + Filling 2', percent: 100, badge: 'Ready', tone: 'success' }
]

export const ProductionPlanning: React.FC<ProductionPlanningProps> = ({ onOpenRecommendation }) => {
  const { navigate } = useNavigation()

  return (
    <>
      <PageHeader
        title="Production plan"
        description="AI-assisted scheduling for raw milk, tanks, and filling lines"
        actions={
          <>
            <Button variant="secondary" icon={Upload} onClick={() => navigate('data-management-upload')}>
              Upload orders
            </Button>
            <Button icon={Sparkles} onClick={onOpenRecommendation}>
              AI recommendation
            </Button>
          </>
        }
      />

      <div className="space-y-5">
        <SectionPanel title="Shift KPIs" subtitle="Snapshot at 06:00 opening stock · Shift A">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <StatCard icon={Milk} label="Available raw milk" value="18,420 L" caption="+8.4% vs yesterday" captionTone="success" />
            <StatCard icon={ClipboardList} label="Planned orders" value="12" caption="3 due this shift" captionTone="info" />
            <StatCard icon={Cylinder} label="Tank utilization" value="72%" caption="Within operating range" captionStatus="Valid" />
            <StatCard icon={Factory} label="Active lines" value="2 / 2" caption="Ready to run" captionStatus="Completed" />
            <StatCard icon={TriangleAlert} label="Schedule alerts" value="2" caption="Needs review" captionStatus="Review" />
          </div>
        </SectionPanel>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <SectionPanel
            title="Shift outlook"
            subtitle="AI forecast for the afternoon sequence"
            className="lg:col-span-5"
            actions={<Badge status="Ready" shape="pill">Analysis ready</Badge>}
          >
            <Card className="p-5 flex flex-col gap-4 h-full" onClick={onOpenRecommendation}>
              <div className="flex items-start gap-3">
                <IconTile icon={Sparkles} tone="brand" />
                <div>
                  <p className="text-xs text-ink">Predicted bottleneck</p>
                  <p className="text-base font-bold text-ink-strong mt-0.5">Flavour changeover may add 45 min</p>
                  <p className="text-sm text-ink">to the afternoon sequence.</p>
                </div>
              </div>
              <div className="rounded-lg bg-brand-muted border border-brand-subtle px-3 py-2.5 text-sm font-medium text-ink-strong">
                Recommendation: run Full Cream before Strawberry
              </div>
              <p className="text-[11px] text-ink">Confidence is model output — validate constraints before approval.</p>
            </Card>
          </SectionPanel>

          <SectionPanel
            title="Production schedule"
            subtitle="Today · 07:00–19:00"
            className="lg:col-span-7"
            actions={
              <Button variant="link" size="sm" onClick={() => navigate('schedule-simulation')}>
                Open simulation
              </Button>
            }
          >
            <Card className="p-4">
              <ScheduleTimeline lanes={lanes} startHour={7} endHour={19} tickEvery={2} />
            </Card>
          </SectionPanel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <SectionPanel title="Operational status" className="lg:col-span-7">
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
            title="Schedule alerts"
            className="lg:col-span-5"
            actions={<Badge status="Review" shape="pill">2 review items</Badge>}
          >
            <Card className="p-4 space-y-3">
              {[
                { title: 'Changeover window is 45 min', detail: 'Strawberry → Full Cream on Filling Machine 1 needs CIP_FLAVOUR' },
                { title: 'AT-02 threshold validated at 52.5%', detail: 'Two fillers allowed above the 50% minimum level' }
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
                Synthetic data · Constraint rules shown separately from AI forecasts.
              </p>
            </Card>
          </SectionPanel>
        </div>
      </div>
    </>
  )
}
