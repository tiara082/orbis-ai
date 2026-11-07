import React from 'react'
import { GitFork } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { useNavigation } from '../components/layout/NavigationContext'
import { ResultState } from '../components/common/ResultState'
import { Button } from '../components/ui/Button'

interface AffectedProductsProps {
  onReturn: () => void
}

export const AffectedProducts: React.FC<AffectedProductsProps> = ({ onReturn }) => {
  const { navigate } = useNavigation()

  return (
    <>
      <PageHeader title="Affected products" description="Synthetic Demo Data · human review required where indicated" />
      <ResultState
        status="Potential impact"
        title="Potentially affected: B-2026-1030-01 → FG-1030-01"
        description="The finished lot is placed on hold review. Release or recall is decided by the quality team, not by ORBIS."
        details={[
          { label: 'Batch', value: 'B-2026-1030-01', mono: true },
          { label: 'Finished lot', value: 'FG-1030-01', mono: true },
          { label: 'Product', value: 'Full Cream 1L' }
        ]}
        actions={
          <>
            <Button onClick={onReturn}>Return to workflow</Button>
            <Button variant="outline" icon={GitFork} onClick={() => navigate('traceability-forward')}>
              Open forward trace
            </Button>
          </>
        }
      />
    </>
  )
}
