import React from 'react'
import { BrainCircuit } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'

interface TankerDelayedProps {
  onReturn: () => void
}

export const TankerDelayed: React.FC<TankerDelayedProps> = ({ onReturn }) => {
  const { navigate } = useNavigation()

  return (
    <>
      <PageHeader title="Tanker TRK-045" description="Synthetic Demo Data · human review required where indicated" />
      <ResultState
        status="Delayed"
        title="TRK-045 delayed by 35 minutes · ETA 12:15"
        description="The delay reduces raw milk available for the afternoon sequence. ORBIS has flagged the production plan for review."
        details={[
          { label: 'Supplier', value: 'Farm Cooperative C' },
          { label: 'Volume', value: '4,800 L' },
          { label: 'Destination', value: 'ST-07', mono: true }
        ]}
        actions={
          <>
            <Button onClick={onReturn}>Return to workflow</Button>
            <Button variant="outline" icon={BrainCircuit} onClick={() => navigate('ai-production-risk')}>
              View production risk
            </Button>
          </>
        }
      />
    </>
  )
}
