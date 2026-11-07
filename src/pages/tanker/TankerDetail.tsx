import React from 'react'
import { FlaskConical, Truck } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { KeyValueList } from '../../components/common/KeyValueList'
import { StepFlow } from '../../components/common/StepFlow'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { IconTile } from '../../components/ui/IconTile'
import { useTranslation } from '../../lib/i18n'

interface TankerDetailProps {
  onOpenLabStatus: () => void
}

export const TankerDetail: React.FC<TankerDetailProps> = ({ onOpenLabStatus }) => {
  const { t } = useTranslation()
  return (
  <>
    <PageHeader
      title={t('pages.tanker-detail.title')}
      description={t('pages.tanker-detail.description')}
      titleAddon={<Badge status="Lab Test" size="md" shape="pill" />}
      actions={
        <Button icon={FlaskConical} onClick={onOpenLabStatus}>
          {t('pages.tanker-detail.openLab')}
        </Button>
      }
    />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <SectionPanel title={t('pages.tanker-detail.delivery')} className="lg:col-span-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <IconTile icon={Truck} tone="brand" size="lg" />
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-ink-strong tabular-nums">8,200 L</p>
              <p className="text-xs text-ink mt-0.5">Estimated arrival 09:20 · Actual 09:18</p>
            </div>
          </div>
          <KeyValueList
            className="mt-4"
            items={[
              { label: 'Supplier', value: 'Farm Cooperative A' },
              { label: 'Destination tank', value: 'ST-04', mono: true },
              { label: 'Sample', value: 'S-042-01', mono: true },
              { label: 'Ledger', value: <Badge status="Recorded" variant="outline" /> }
            ]}
          />
        </Card>
      </SectionPanel>

      <SectionPanel title={t('pages.tanker-detail.timeline')} subtitle={t('pages.tanker-detail.timelineSubtitle')} className="lg:col-span-7">
        <Card className="p-5">
          <StepFlow
            variant="progress"
            steps={[
              { label: 'Farm', detail: '05:10', state: 'done' },
              { label: 'On the way', detail: '06:40', state: 'done' },
              { label: 'Sampling', detail: '09:32', state: 'done' },
              { label: 'Lab test', detail: 'In progress', state: 'current' },
              { label: 'Released', state: 'upcoming' },
              { label: 'Unloading', state: 'upcoming' },
              { label: 'Stored', state: 'upcoming' }
            ]}
          />
        </Card>
      </SectionPanel>
    </div>
  </>
  )
}
