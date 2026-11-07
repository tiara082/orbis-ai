import React from 'react'
import { DatabaseZap } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface PredictionInsufficientProps {
  onReturn: () => void
}

export const PredictionInsufficient: React.FC<PredictionInsufficientProps> = ({ onReturn }) => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.prediction-insufficient.title')} description={t('common.syntheticReview')} />
      <ResultState
        status="Insufficient data"
        tone="warning"
        icon={DatabaseZap}
        title={t('pages.prediction-insufficient.resultTitle')}
        description="The model needs actual asset parameters and recent batch history before it can recommend a plan. Upload the missing data or continue with the rule-based schedule."
        details={[
          { label: 'Missing', value: 'Asset parameters (capacity, flow, CIP)' },
          { label: 'History available', value: '2 of 14 shifts' },
          { label: 'Fallback', value: 'Rule-based baseline' }
        ]}
        actions={
          <>
            <Button onClick={onReturn}>{t('pages.prediction-insufficient.returnToPrediction')}</Button>
            <Button variant="outline" onClick={() => navigate('data-management-upload')}>
              {t('pages.prediction-insufficient.uploadData')}
            </Button>
          </>
        }
      />
    </>
  )
}
