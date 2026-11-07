import React from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { ResultState } from '../components/common/ResultState'
import { Button } from '../components/ui/Button'

interface ImportErrorProps {
  onReturn: () => void
}

export const ImportError: React.FC<ImportErrorProps> = ({ onReturn }) => (
  <>
    <PageHeader title="Import failed" description="Synthetic Demo Data · human review required where indicated" />
    <ResultState
      status="Failed"
      title="Import failed: 20 records contain blocking schema errors"
      description="No records were written. Fix the rows below in the source file and upload it again."
      details={[
        { label: 'Import', value: 'IMP-1029-01', mono: true },
        { label: 'File', value: 'tank_snapshot_29oct.xlsx' },
        { label: 'Main error', value: 'opening_volume_l is not numeric' }
      ]}
      actions={<Button onClick={onReturn}>Return to workflow</Button>}
    />
  </>
)
