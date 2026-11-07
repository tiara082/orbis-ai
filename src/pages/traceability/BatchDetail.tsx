import React from 'react'
import { Download, Network } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { useNavigation } from '../../components/layout/NavigationContext'
import { SectionPanel } from '../../components/common/SectionPanel'
import { KeyValueList } from '../../components/common/KeyValueList'
import { StepFlow } from '../../components/common/StepFlow'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../lib/i18n'

export const BatchDetail: React.FC = () => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()

  return (
    <>
      <PageHeader
        title={t('pages.traceability-batch.title')}
        description={t('pages.traceability-batch.description')}
        titleAddon={<Badge status="Pending" size="md">{t('pages.traceability-batch.ledgerPending')}</Badge>}
        actions={
          <>
            <Button variant="secondary" icon={Download}>
              {t('common.export')}
            </Button>
            <Button icon={Network} onClick={() => navigate('traceability-graph')}>
              {t('pages.traceability-batch.openGraph')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <SectionPanel title={t('pages.traceability-batch.facts')} className="lg:col-span-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs px-5 py-2">
            <KeyValueList
              items={[
                { label: 'Product', value: 'Full Cream 1L' },
                { label: 'Milk ratio', value: '100% pure milk' },
                { label: 'Input volume', value: '8,200 L = 8,200 kg' },
                { label: 'Source tank', value: 'ST-04', mono: true },
                { label: 'Finished lot', value: 'FG-1030-01', mono: true }
              ]}
            />
          </div>
        </SectionPanel>

        <SectionPanel title={t('pages.traceability-batch.relationships')} className="lg:col-span-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-5">
            <StepFlow
              steps={[
                { label: 'TRK-042', detail: 'Tanker' },
                { label: 'ST-04', detail: 'Storage tank' },
                { label: 'B-2026-1030-01', detail: 'This batch', tone: 'brand' },
                { label: 'FG-1030-01', detail: 'Finished lot' }
              ]}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Badge status="Recorded" variant="outline" size="md">
                Relationships recorded
              </Badge>
              <Button variant="link" size="sm" onClick={() => navigate('traceability-backward')}>
                {t('pages.traceability-batch.openBackward')}
              </Button>
            </div>
          </div>
        </SectionPanel>
      </div>
    </>
  )
}
