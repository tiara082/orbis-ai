import React from 'react'
import { History } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { ResultState } from '../../components/common/ResultState'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

interface PlanningApprovalProps {
  onReturn: () => void
}

export const PlanningApproval: React.FC<PlanningApprovalProps> = ({ onReturn }) => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.planning-approval.title')} description={t('common.syntheticReview')} />
      <ResultState
        status="Approved"
        title={t('pages.planning-approval.resultTitle')}
        description="The approved sequence replaces the baseline for Filling Machine 1. The decision is hashed into the audit ledger."
        details={[
          { label: 'Audit event', value: 'EVT-1030-882', mono: true },
          { label: 'Approved by', value: 'Ana Putri · Planner' },
          { label: 'Ledger status', value: <Badge status="Recorded" variant="outline" /> }
        ]}
        actions={
          <>
            <Button onClick={onReturn}>{t('common.returnToWorkflow')}</Button>
            <Button variant="outline" icon={History} onClick={() => navigate('audit-event-detail')}>
              {t('pages.planning-approval.viewEvent')}
            </Button>
          </>
        }
      />
    </>
  )
}
