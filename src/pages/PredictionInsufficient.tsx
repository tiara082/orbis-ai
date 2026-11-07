import React from 'react'
import { DatabaseZap } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { useNavigation } from '../components/layout/NavigationContext'
import { ResultState } from '../components/common/ResultState'
import { Button } from '../components/ui/Button'

interface PredictionInsufficientProps {
  onReturn: () => void
}

export const PredictionInsufficient: React.FC<PredictionInsufficientProps> = ({ onReturn }) => {
  const { navigate } = useNavigation()

  return (
    <>
      <PageHeader title="Prediction unavailable" description="Synthetic Demo Data · human review required where indicated" />
      <ResultState
        status="Insufficient data"
        tone="warning"
        icon={DatabaseZap}
        title="Insufficient data for reliable prediction"
        description="The model needs actual asset parameters and recent batch history before it can recommend a plan. Upload the missing data or continue with the rule-based schedule."
        details={[
          { label: 'Missing', value: 'Asset parameters (capacity, flow, CIP)' },
          { label: 'History available', value: '2 of 14 shifts' },
          { label: 'Fallback', value: 'Rule-based baseline' }
        ]}
        actions={
          <>
            <Button onClick={onReturn}>Return to prediction</Button>
            <Button variant="outline" onClick={() => navigate('data-management-upload')}>
              Upload data
            </Button>
          </>
        }
      />
    </>
  )
}
