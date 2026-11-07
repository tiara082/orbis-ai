import React from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface ImportErrorProps {
  onReturn: () => void
}

export const ImportError: React.FC<ImportErrorProps> = ({ onReturn }) => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.data-management-error.title')} description={t('common.syntheticReview')} />
      <ResultState
        status="Failed"
        title={t('pages.data-management-error.resultTitle')}
        description="No records were written. Fix the rows below in the source file and upload it again."
        details={[
          { label: 'Import', value: 'IMP-1029-01', mono: true },
          { label: 'File', value: 'tank_snapshot_29oct.xlsx' },
          { label: 'Main error', value: 'opening_volume_l is not numeric' }
        ]}
        actions={<Button onClick={onReturn}>{t('common.returnToWorkflow')}</Button>}
      />
    </>
  )
}
