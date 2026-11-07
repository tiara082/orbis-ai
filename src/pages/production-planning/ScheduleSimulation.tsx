import React from 'react'
import { CircleCheck, Clock, Gauge, ShieldCheck, Timer } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { StatCard } from '../../components/common/StatCard'
import { Callout } from '../../components/common/Callout'
import { ScheduleTimeline } from '../../components/planning/ScheduleTimeline'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface ScheduleSimulationProps {
  onApprove: () => void
}

export const ScheduleSimulation: React.FC<ScheduleSimulationProps> = ({ onApprove }) => {
  const { t } = useTranslation()
  return (
  <>
    <PageHeader
      title={t('pages.schedule-simulation.title')}
      description={t('pages.schedule-simulation.description')}
      actions={
        <Button icon={CircleCheck} onClick={onApprove}>
          {t('pages.schedule-simulation.approve')}
        </Button>
      }
    />

    <div className="space-y-5">
      <SectionPanel title={t('pages.schedule-simulation.scenario')} subtitle={t('pages.schedule-simulation.scenarioSubtitle')}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Clock} label="Completion" value="13:45" caption="both sequences" />
          <StatCard icon={Timer} label="Changeover" value="45 min" caption="one flavour transition" captionTone="warning" />
          <StatCard icon={Gauge} label="Time saved" value="0 min" caption="no reduction found" captionStatus="Failed" />
          <StatCard icon={ShieldCheck} label="Constraints" value="Pass" caption="AT-02 at 52.5%" captionStatus="Passed" />
        </div>
      </SectionPanel>

      <SectionPanel title={t('pages.schedule-simulation.compare')} subtitle={t('pages.schedule-simulation.compareSubtitle')}>
        <Card className="p-4">
          <ScheduleTimeline
            startHour={7}
            endHour={14}
            tickEvery={1}
            lanes={[
              {
                label: 'Baseline schedule',
                sublabel: '13:45 complete',
                blocks: [
                  { label: 'Full Cream 1L', start: 7, end: 10, kind: 'plain' },
                  { label: 'Changeover', start: 10, end: 10.75, kind: 'changeover' },
                  { label: 'Strawberry 1L', start: 10.75, end: 13.75, kind: 'flavoured' }
                ]
              },
              {
                label: 'Valid alternative',
                sublabel: '13:45 complete',
                blocks: [
                  { label: 'Strawberry 1L', start: 7, end: 10, kind: 'flavoured' },
                  { label: 'Changeover + CIP', start: 10, end: 10.75, kind: 'changeover' },
                  { label: 'Full Cream 1L', start: 10.75, end: 13.75, kind: 'plain' }
                ]
              }
            ]}
          />
        </Card>
      </SectionPanel>

      <SectionPanel title={t('pages.schedule-simulation.optimization')}>
        <div className="space-y-3">
          <Callout
            tone="danger"
            title="No time saved: both sequences contain one product transition and the same 45-minute changeover."
            description="The alternative may change downstream priority, but it does not eliminate the changeover."
          />
          <Callout
            tone="success"
            icon={ShieldCheck}
            title="Constraint validation: AT-02 = 6,300 / 12,000 L = 52.5%"
            description="Two filling machines permitted above the 50% minimum aseptic level."
          />
        </div>
      </SectionPanel>
    </div>
  </>
  )
}
