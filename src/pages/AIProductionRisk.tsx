import React from 'react'
import { CalendarClock, Cylinder, Milk, Truck, type LucideIcon } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionPanel } from '../components/common/SectionPanel'
import { Callout } from '../components/common/Callout'
import { Badge } from '../components/ui/Badge'
import { IconTile } from '../components/ui/IconTile'
import type { Tone } from '../lib/status'

interface Risk {
  category: string
  icon: LucideIcon
  tone: Tone
  severity: string
  title: string
  description: string
}

const risks: Risk[] = [
  { category: 'Delayed tanker', icon: Truck, tone: 'danger', severity: 'High', title: 'TRK-045 · +35 min', description: 'Potential raw milk availability gap' },
  { category: 'Raw milk availability', icon: Milk, tone: 'warning', severity: 'Medium', title: '18,420 L → 13,620 L available', description: 'Demand coverage requires review' },
  { category: 'Tank capacity', icon: Cylinder, tone: 'success', severity: 'Passed', title: 'AT-02 · 6,300 / 12,000 L', description: 'Two-filler threshold passes at 52.5%' },
  { category: 'Schedule conflict', icon: CalendarClock, tone: 'warning', severity: 'Medium', title: 'Strawberry order after Full Cream', description: '45 min changeover remains required' }
]

export const AIProductionRisk: React.FC = () => (
  <>
    <PageHeader title="Production risk analysis" description="Risks detected from the delayed tanker scenario" />

    <div className="space-y-5">
      <SectionPanel
        title="Detected risks"
        subtitle={`${risks.length} signals · sorted by severity`}
        actions={
          <div className="flex gap-1.5">
            <Badge tone="danger">1 high</Badge>
            <Badge tone="warning">2 medium</Badge>
          </div>
        }
      >
        <div className="space-y-2.5">
          {risks.map((risk) => (
            <div
              key={risk.category}
              className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-center gap-3 sm:w-56 shrink-0">
                <IconTile icon={risk.icon} tone={risk.tone} />
                <span className="text-xs font-semibold uppercase tracking-wider text-ink">{risk.category}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-ink-strong">{risk.title}</h3>
                <p className="text-xs text-ink mt-0.5">{risk.description}</p>
              </div>
              <Badge status={risk.severity} tone={risk.tone} />
            </div>
          ))}
        </div>
      </SectionPanel>

      <Callout
        tone="info"
        title="Downstream impact"
        description="Delay today may affect tomorrow's planned sequence; warehouse and packaging are not used as scheduling constraints."
      />
    </div>
  </>
)
