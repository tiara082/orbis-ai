import React from 'react'
import { Download, Tractor, Truck, Waypoints } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { SectionPanel } from '../../components/common/SectionPanel'
import { StatCard } from '../../components/common/StatCard'
import { StepFlow } from '../../components/common/StepFlow'
import { TraceStepsTable, type TraceStep } from '../../components/traceability/TraceStepsTable'
import { Button } from '../../components/ui/Button'

const steps: TraceStep[] = [
  { kind: 'finished', entity: 'FG-1030-01', quantity: 'Derived lot', timestamp: '30 Oct 14:00', relationship: 'PRODUCED_FROM', integrity: 'Mismatch' },
  { kind: 'batch', entity: 'B-2026-1030-01', quantity: '8,200 L input', timestamp: '30 Oct 11:00', relationship: 'PRODUCED', integrity: 'Pending' },
  { kind: 'tank', entity: 'ST-04', quantity: '8,200 L', timestamp: '30 Oct 10:18', relationship: 'BLENDED_FROM', integrity: 'Verified' },
  { kind: 'tanker', entity: 'TRK-042', quantity: '8,200 L', timestamp: '30 Oct 09:18', relationship: 'SUPPLIED_TO', integrity: 'Verified' }
]

export const BackwardTrace: React.FC = () => {
  const { navigate } = useNavigation()

  return (
    <>
      <PageHeader
        title="Backward trace · FG-1030-01"
        description="Finished goods → production batch → tank → source tanker"
        actions={
          <Button variant="secondary" icon={Download}>
            Export
          </Button>
        }
      />

      <div className="space-y-5">
        <SectionPanel title="Origin summary" subtitle="Where the selected finished lot came from">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard icon={Waypoints} label="Hops" value="4" caption="finished lot to tanker" />
            <StatCard icon={Truck} label="Source tankers" value="1" caption="TRK-042 · 8,200 L" captionStatus="Verified" />
            <StatCard icon={Tractor} label="Origin farm" value="Farm A" caption="Farm Cooperative A" />
          </div>
        </SectionPanel>

        <SectionPanel title="Trace path">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4">
            <StepFlow
              steps={[
                { label: 'FG-1030-01', detail: 'Finished lot · 14:00', tone: 'brand' },
                { label: 'B-2026-1030-01', detail: 'Production batch · 11:00' },
                { label: 'ST-04', detail: 'Storage tank · 10:18' },
                { label: 'TRK-042', detail: 'Tanker · 09:18' },
                { label: 'Farm A', detail: 'Origin farm', tone: 'info' }
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
