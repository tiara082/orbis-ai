import React from 'react'
import { BrainCircuit } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { ResultState } from '../../components/common/ResultState'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface TankerDelayedProps {
  onReturn: () => void
}

export const TankerDelayed: React.FC<TankerDelayedProps> = ({ onReturn }) => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.tanker-delayed.title')} description={t('common.syntheticReview')} />
      <ResultState
        status="Delayed"
        title={t('pages.tanker-delayed.resultTitle')}
        description="The delay reduces raw milk available for the afternoon sequence. ORBIS has flagged the production plan for review."
        details={[
          { label: 'Supplier', value: 'Farm Cooperative C' },
          { label: 'Volume', value: '4,800 L' },
          { label: 'Destination', value: 'ST-07', mono: true }
        ]}
        actions={
          <>
            <Button onClick={onReturn}>{t('common.returnToWorkflow')}</Button>
            <Button variant="outline" icon={BrainCircuit} onClick={() => navigate('ai-production-risk')}>
              {t('pages.tanker-delayed.openRisk')}
            </Button>
          </>
        }
      />
    </>
  )
}
