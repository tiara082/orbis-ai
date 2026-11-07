import React from 'react'
import { GitFork, Package, ShieldAlert } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { StepFlow } from '../../components/common/StepFlow'
import { Callout } from '../../components/common/Callout'
import { EntityCell } from '../../components/common/EntityCell'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ENTITY_META, type EntityKind } from '../../lib/entities'
import { useTranslation } from '../../lib/i18n'

interface QualityInvestigationDetailProps {
  onOpenAnalysis?: () => void
  onOpenAffectedProducts?: () => void
}

const material: { kind: EntityKind; id: string }[] = [
  { kind: 'tanker', id: 'TRK-042' },
  { kind: 'tank', id: 'ST-04' },
  { kind: 'batch', id: 'B-2026-1030-01' },
  { kind: 'finished', id: 'FG-1030-01' }
]

export const QualityInvestigationDetail: React.FC<QualityInvestigationDetailProps> = ({
  onOpenAnalysis,
  onOpenAffectedProducts
}) => {
  const { t } = useTranslation()
  return (
  <>
    <PageHeader
      title={t('pages.quality-investigation-detail.title')}
      description={t('pages.quality-investigation-detail.description')}
      titleAddon={<Badge status="Under Investigation" size="md" shape="pill" />}
      actions={
        <>
          <Button variant="secondary" icon={GitFork} onClick={onOpenAnalysis}>
            {t('pages.quality-investigation-detail.openAnalysis')}
          </Button>
          <Button icon={Package} onClick={onOpenAffectedProducts}>
            {t('pages.quality-investigation-detail.affectedProducts')}
          </Button>
        </>
      }
    />

    <div className="space-y-5">
      <SectionPanel title={t('pages.quality-investigation-detail.tracePath')} subtitle={t('pages.quality-investigation-detail.tracePathSubtitle')}>
        <Card className="p-5">
          <StepFlow
            steps={[
              { label: 'TRK-042', detail: 'Tanker · lab review', tone: 'warning' },
              { label: 'ST-04', detail: 'Storage tank', tone: 'neutral' },
              { label: 'B-2026-1030-01', detail: 'Production batch', tone: 'warning' },
              { label: 'FG-1030-01', detail: 'Finished lot', tone: 'warning' }
            ]}
          />
        </Card>
      </SectionPanel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionPanel
          title="Affected material"
          actions={
            onOpenAnalysis && (
              <Button variant="link" size="sm" onClick={onOpenAnalysis}>
                Open analysis
              </Button>
            )
          }
        >
          <Card className="p-4 space-y-3">
            {material.map((item) => (
              <EntityCell key={item.id} icon={ENTITY_META[item.kind].icon} id={item.id} type={ENTITY_META[item.kind].label} mono />
            ))}
          </Card>
        </SectionPanel>

        <SectionPanel title={t('pages.quality-investigation-detail.findings')} actions={<Badge status="Potential impact" shape="pill" />}>
          <div className="space-y-3">
            <Callout
              tone="warning"
              title="1 finished lot is potentially affected"
              description="FG-1030-01 consumed milk from ST-04 after TRK-042 was unloaded."
              actions={
                onOpenAffectedProducts && (
                  <Button variant="outline" size="sm" onClick={onOpenAffectedProducts}>
                    Review
                  </Button>
                )
              }
            />
            <Callout
              tone="danger"
              icon={ShieldAlert}
              title="No contamination or physical condition is confirmed by ORBIS."
              description="Impact classification remains subject to quality review."
            />
          </div>
        </SectionPanel>
      </div>
    </div>
  </>
  )
}
