import React from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface PlanningRejectionProps {
  onReturn: () => void
}

export const PlanningRejection: React.FC<PlanningRejectionProps> = ({ onReturn }) => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.planning-rejection.title')} description={t('common.syntheticReview')} />
      <ResultState
        status="Rejected"
        title={t('pages.planning-rejection.resultTitle')}
        description="No change is sent to the floor. The rejection and its reason are recorded in the audit ledger."
        details={[
          { label: 'Active plan', value: 'Baseline schedule' },
          { label: 'Decided by', value: 'Ana Putri · Planner' },
          { label: 'Audit event', value: 'EVT-1030-883', mono: true }
        ]}
        actions={<Button onClick={onReturn}>{t('common.returnToWorkflow')}</Button>}
      />
    </>
  )
}
