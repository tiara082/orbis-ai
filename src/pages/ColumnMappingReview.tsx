import React from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { ResultState } from '../components/common/ResultState'
import { Button } from '../components/ui/Button'

interface ColumnMappingReviewProps {
  onReturn: () => void
}

export const ColumnMappingReview: React.FC<ColumnMappingReviewProps> = ({ onReturn }) => (
  <>
    <PageHeader title="Mapping review" description="Synthetic Demo Data · human review required where indicated" />
    <ResultState
      status="Needs review"
      title="Manual review required for Keterangan → unmapped"
      description="The AI could not match this free-text column to a standard field. Choose a field or mark it as ignored before validation."
      details={[
        { label: 'Source column', value: 'Keterangan' },
        { label: 'AI confidence', value: '38%' },
        { label: 'Sample value', value: '"susu agak asam, cek ulang"' }
      ]}
      actions={<Button onClick={onReturn}>Return to mapping</Button>}
    />
  </>
)
