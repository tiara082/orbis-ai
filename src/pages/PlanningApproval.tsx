import React from 'react'
import { History } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { useNavigation } from '../components/layout/NavigationContext'
import { ResultState } from '../components/common/ResultState'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

interface PlanningApprovalProps {
  onReturn: () => void
}

export const PlanningApproval: React.FC<PlanningApprovalProps> = ({ onReturn }) => {
  const { navigate } = useNavigation()

  return (
    <>
      <PageHeader title="Plan approved" description="Synthetic Demo Data · human review required where indicated" />
      <ResultState
        status="Approved"
        title="Alternative sequence approved; audit event EVT-1030-882 recorded"
        description="The approved sequence replaces the baseline for Filling Machine 1. The decision is hashed into the audit ledger."
        details={[
          { label: 'Audit event', value: 'EVT-1030-882', mono: true },
          { label: 'Approved by', value: 'Ana Putri · Planner' },
          { label: 'Ledger status', value: <Badge status="Recorded" variant="outline" /> }
        ]}
        actions={
          <>
            <Button onClick={onReturn}>Return to workflow</Button>
            <Button variant="outline" icon={History} onClick={() => navigate('audit-event-detail')}>
              View audit event
            </Button>
          </>
        }
      />
    </>
  )
}
