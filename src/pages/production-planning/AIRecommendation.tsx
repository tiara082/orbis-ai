import React from 'react'
import { GitCompare, ShieldCheck, Shuffle, Sparkles, TrendingUp, UserCheck, X } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { Callout } from '../../components/common/Callout'
import { StepFlow } from '../../components/common/StepFlow'
import { ToolCard } from '../../components/common/ToolCard'
import { KeyValueList } from '../../components/common/KeyValueList'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

interface AIRecommendationProps {
  onCompareSchedule: () => void
  onApprove: () => void
  onReject?: () => void
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({ onCompareSchedule, onApprove, onReject }) => (
  <>
    <PageHeader
      title="AI recommendation"
      description="Review model output, validate constraints, then approve with confidence"
      actions={
        <>
          <Button variant="outline" icon={GitCompare} onClick={onCompareSchedule}>
            Compare schedule
          </Button>
          {onReject && (
            <Button variant="secondary" icon={X} onClick={onReject}>
              Reject
            </Button>
          )}
          <Button icon={UserCheck} onClick={onApprove}>
            Approve recommendation
          </Button>
        </>
      }
    />

    <div className="space-y-5">
      <Callout
        variant="strong"
        icon={Sparkles}
        eyebrow="Recommended sequence"
        title="Move Full Cream 1L before Strawberry 1L"
        description="Expected impact: recover 45 min · keep both filling lines active"
      />

      <SectionPanel title="Decision pipeline" subtitle="Each step must pass before the plan reaches the floor">
        <Card className="p-5 mb-3">
          <StepFlow
            variant="progress"
            steps={[
              { label: 'AI forecasting', detail: 'Done', state: 'done' },
              { label: 'Constraint validation', detail: 'Pass', state: 'done' },
              { label: 'Schedule optimization', detail: 'Done', state: 'done' },
              { label: 'Human approval', detail: 'Waiting', state: 'current' }
            ]}
          />
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ToolCard
            icon={TrendingUp}
            title="45 min delay predicted"
            description="Based on changeover duration and order sequence."
            badge={<Badge tone="brand">01 · AI forecasting</Badge>}
          />
          <ToolCard
            icon={ShieldCheck}
            iconTone="success"
            title="Pass · AT-02 at 52.5%"
            description="Two filling machines permitted above 50% capacity."
            badge={<Badge status="Passed">02 · Constraint validation</Badge>}
          />
          <ToolCard
            icon={Shuffle}
            title="Alternative sequence found"
            description="Full Cream → Strawberry reduces transition risk."
            badge={<Badge tone="brand">03 · Schedule optimization</Badge>}
          />
          <ToolCard
            icon={UserCheck}
            iconTone="warning"
            title="Planner decision required"
            description="AI does not approve quality or production release."
            badge={<Badge status="Pending">04 · Human approval</Badge>}
          />
        </div>
      </SectionPanel>

      <SectionPanel title="Why this recommendation?">
        <Card className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="text-sm text-ink leading-relaxed space-y-2">
            <p>The model prioritizes the sequence with the lowest predicted transition delay.</p>
            <p>Operational checks remain explicit: milk ratio, tank capacity, and changeover window.</p>
            <p className="text-[11px] pt-2">
              Synthetic scenario · Prediction confidence is intentionally not presented as verified accuracy.
            </p>
          </div>
          <KeyValueList
            items={[
              { label: 'Trigger', value: 'TRK-045 delayed +35 min' },
              { label: 'Milk ratio', value: 'Full Cream 100% · Strawberry 90%' },
              { label: 'Tank capacity', value: 'AT-02 6,300 / 12,000 L' },
              { label: 'Changeover window', value: '45 min (CIP_FLAVOUR)' }
            ]}
          />
        </Card>
      </SectionPanel>
    </div>
  </>
)
