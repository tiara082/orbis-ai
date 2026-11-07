import React from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface TankerLabPendingProps {
  onReturn: () => void
}

export const TankerLabPending: React.FC<TankerLabPendingProps> = ({ onReturn }) => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.tanker-lab-pending.title')} description={t('common.syntheticReview')} />
      <ResultState
        status="Lab pending"
        title={t('pages.tanker-lab-pending.resultTitle')}
        description="TRK-042 stays on hold at the receiving bay. Unloading into ST-04 is blocked until the QA reviewer records a result."
        details={[
          { label: 'Tanker', value: 'TRK-042', mono: true },
          { label: 'Sample', value: 'S-042-01', mono: true },
          { label: 'Waiting since', value: '09:32' }
        ]}
        actions={<Button onClick={onReturn}>{t('common.returnToWorkflow')}</Button>}
      />
    </>
  )
}
