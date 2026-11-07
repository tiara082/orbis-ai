import React from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface ColumnMappingReviewProps {
  onReturn: () => void
}

export const ColumnMappingReview: React.FC<ColumnMappingReviewProps> = ({ onReturn }) => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.data-management-mapping-review.title')} description={t('common.syntheticReview')} />
      <ResultState
        status="Needs review"
        title={t('pages.data-management-mapping-review.resultTitle')}
        description="The AI could not match this free-text column to a standard field. Choose a field or mark it as ignored before validation."
        details={[
          { label: 'Source column', value: 'Keterangan' },
          { label: 'AI confidence', value: '38%' },
          { label: 'Sample value', value: '"susu agak asam, cek ulang"' }
        ]}
        actions={<Button onClick={onReturn}>{t('pages.data-management-mapping-review.returnToMapping')}</Button>}
      />
    </>
  )
}
