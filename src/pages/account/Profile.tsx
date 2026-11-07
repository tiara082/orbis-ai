import React from 'react'
import { Settings } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { KeyValueList } from '../../components/common/KeyValueList'
import { Button } from '../../components/ui/Button'
import { CURRENT_USER } from '../../config/alerts'
import { useTranslation } from '../../lib/i18n'

export const Profile: React.FC = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  return (
    <>
      <PageHeader
        title={t('pages.profile.title')}
        description={t('pages.profile.description')}
        actions={
          <Button variant="secondary" icon={Settings} onClick={() => navigate('settings')}>
            {t('pages.profile.openSettings')}
          </Button>
        }
      />

      <SectionPanel>
        <Card className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-brand-muted text-brand text-lg font-bold flex items-center justify-center">
              {CURRENT_USER.initials}
            </div>
            <div>
              <p className="text-lg font-bold text-ink-strong">{CURRENT_USER.name}</p>
              <p className="text-sm text-ink">
                {t('shell.role')} · {t('shell.shift')}
              </p>
            </div>
          </div>
          <KeyValueList
            layout="grid"
            columns={2}
            items={[
              { label: t('pages.profile.name'), value: CURRENT_USER.name },
              { label: t('pages.profile.role'), value: t('shell.role') },
              { label: t('pages.profile.plant'), value: t('shell.plant') },
              { label: t('pages.profile.shift'), value: t('shell.shift') },
              { label: t('pages.profile.email'), value: CURRENT_USER.email, mono: true }
            ]}
          />
        </Card>
      </SectionPanel>
    </>
  )
}
