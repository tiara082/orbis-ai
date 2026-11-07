import React from 'react'
import { Download, Layers, Package, Waypoints } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { SectionPanel } from '../../components/common/SectionPanel'
import { StatCard } from '../../components/common/StatCard'
import { StepFlow } from '../../components/common/StepFlow'
import { TraceStepsTable, type TraceStep } from '../../components/traceability/TraceStepsTable'
import { Button } from '../../components/ui/Button'

const steps: TraceStep[] = [
  { kind: 'tanker', entity: 'TRK-042', quantity: '8,200 L', timestamp: '30 Oct 09:18', relationship: 'SUPPLIED_TO', integrity: 'Verified' },
  { kind: 'tank', entity: 'ST-04', quantity: '8,200 L', timestamp: '30 Oct 10:18', relationship: 'DISCHARGED_INTO', integrity: 'Verified' },
  { kind: 'batch', entity: 'B-2026-1030-01', quantity: '8,200 L input', timestamp: '30 Oct 11:00', relationship: 'PRODUCED', integrity: 'Pending' },
  { kind: 'finished', entity: 'FG-1030-01', quantity: 'Derived lot', timestamp: '30 Oct 14:00', relationship: 'FINISHED_GOODS', integrity: 'Mismatch' }
]

export const ForwardTrace: React.FC = () => {
  const { navigate } = useNavigation()

  return (
    <>
      <PageHeader
        title="Forward trace · TRK-042"
        description="Source tanker → storage tank → production batch → finished goods"
        actions={
          <Button variant="secondary" icon={Download}>
            Export
          </Button>
        }
      />

      <div className="space-y-5">
        <SectionPanel title="Impact summary" subtitle="Everything downstream of the selected tanker">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard icon={Waypoints} label="Hops" value="4" caption="tanker to finished lot" />
            <StatCard icon={Layers} label="Traced volume" value="8,200 L" caption="100% of tanker volume" />
            <StatCard icon={Package} label="Finished lots affected" value="1" caption="FG-1030-01 needs QA review" captionStatus="Mismatch" />
          </div>
        </SectionPanel>

        <SectionPanel title="Trace path">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4">
            <StepFlow
              steps={[
                { label: 'TRK-042', detail: 'Tanker · 09:18', tone: 'info' },
                { label: 'ST-04', detail: 'Storage tank · 10:18' },
                { label: 'B-2026-1030-01', detail: 'Production batch · 11:00' },
                { label: 'FG-1030-01', detail: 'Finished lot · 14:00', tone: 'brand' }
              ]}
            />
          </div>
        </SectionPanel>

        <SectionPanel title="Trace steps">
          <TraceStepsTable
            steps={steps}
            onRowClick={(step) => navigate(step.kind === 'batch' ? 'traceability-batch' : 'traceability-graph')}
          />
        </SectionPanel>
      </div>
    </>
  )
}
