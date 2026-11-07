import React from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'

interface PlanningRejectionProps {
  onReturn: () => void
}

export const PlanningRejection: React.FC<PlanningRejectionProps> = ({ onReturn }) => (
  <>
    <PageHeader title="Plan rejected" description="Synthetic Demo Data · human review required where indicated" />
    <ResultState
      status="Rejected"
      title="Alternative rejected; baseline schedule remains active"
      description="No change is sent to the floor. The rejection and its reason are recorded in the audit ledger."
      details={[
        { label: 'Active plan', value: 'Baseline schedule' },
        { label: 'Decided by', value: 'Ana Putri · Planner' },
        { label: 'Audit event', value: 'EVT-1030-883', mono: true }
      ]}
      actions={<Button onClick={onReturn}>Return to workflow</Button>}
    />
  </>
)
