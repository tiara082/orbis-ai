import React from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { ResultState } from '../components/common/ResultState'
import { Button } from '../components/ui/Button'

interface TankerLabPendingProps {
  onReturn: () => void
}

export const TankerLabPending: React.FC<TankerLabPendingProps> = ({ onReturn }) => (
  <>
    <PageHeader title="Lab result pending" description="Synthetic Demo Data · human review required where indicated" />
    <ResultState
      status="Lab pending"
      title="Lab result pending · release decision unavailable"
      description="TRK-042 stays on hold at the receiving bay. Unloading into ST-04 is blocked until the QA reviewer records a result."
      details={[
        { label: 'Tanker', value: 'TRK-042', mono: true },
        { label: 'Sample', value: 'S-042-01', mono: true },
        { label: 'Waiting since', value: '09:32' }
      ]}
      actions={<Button onClick={onReturn}>Return to workflow</Button>}
    />
  </>
)
