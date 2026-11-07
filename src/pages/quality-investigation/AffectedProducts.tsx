import React from 'react'
import { GitFork } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface AffectedProductsProps {
  onReturn: () => void
}

export const AffectedProducts: React.FC<AffectedProductsProps> = ({ onReturn }) => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.affected-products.title')} description={t('common.syntheticReview')} />
      <ResultState
        status="Potential impact"
        title={t('pages.affected-products.resultTitle')}
        description="The finished lot is placed on hold review. Release or recall is decided by the quality team, not by ORBIS."
        details={[
          { label: 'Batch', value: 'B-2026-1030-01', mono: true },
          { label: 'Finished lot', value: 'FG-1030-01', mono: true },
          { label: 'Product', value: 'Full Cream 1L' }
        ]}
        actions={
          <>
            <Button onClick={onReturn}>{t('common.returnToWorkflow')}</Button>
            <Button variant="outline" icon={GitFork} onClick={() => navigate('traceability-forward')}>
              {t('pages.affected-products.openForward')}
            </Button>
          </>
        }
      />
    </>
  )
}
