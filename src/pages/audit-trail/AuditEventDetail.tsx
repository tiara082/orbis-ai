import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { KeyValueList } from '../../components/common/KeyValueList'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

export const AuditEventDetail: React.FC = () => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()

  return (
    <>
      <PageHeader
        title={t('pages.audit-event-detail.title')}
        description={t('pages.audit-event-detail.description')}
        titleAddon={<Badge status="Verified" size="md" shape="pill">{t('pages.audit-event-detail.verifiedCount')}</Badge>}
        actions={
          <Button variant="secondary" icon={ShieldCheck} onClick={() => navigate('audit-integrity-check')}>
            {t('pages.audit-event-detail.integrity')}
          </Button>
        }
      />

      <SectionPanel title={t('pages.audit-event-detail.record')}>
        <Card className="p-5">
          <KeyValueList
            layout="grid"
            columns={2}
            items={[
              { label: 'Event type', value: 'Schedule approved' },
              { label: 'Related batch', value: 'B-2026-1030-01', mono: true },
              { label: 'Actor', value: 'Ana Putri · Production Planner' },
              { label: 'Timestamp', value: '30 Oct 2026 · 10:42' },
              { label: 'Previous record reference', value: 'EVT-1030-881', mono: true },
              { label: 'Integrity status', value: 'Hash recorded · 8/8 verified' }
            ]}
          />
        </Card>
      </SectionPanel>
    </>
  )
}
