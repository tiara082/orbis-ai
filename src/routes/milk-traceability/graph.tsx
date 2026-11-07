import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MousePointerClick } from 'lucide-react'
import { Callout } from '../../components/common/Callout'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { BATCHES } from '../../data/scenario'
import { useTranslation } from '../../lib/i18n'
import { BatchDrawer } from './-components/BatchDrawer'
import { GenealogyGraph } from './-components/GenealogyGraph'

export const Route = createFileRoute('/milk-traceability/graph')({ component: GraphPage })

function GraphPage() {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState<string>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const selectedBatch = BATCHES.find((batch) => batch.id === selectedId)

  return (
    <>
      <PageHeader />
      <div className="space-y-4">
        <Callout
          tone="info"
          icon={MousePointerClick}
          title={selectedId ? t('trace.graph.selected', { id: selectedId }) : t('trace.graph.hintTitle')}
          description={t('trace.graph.hintBody')}
          actions={
            selectedId && (
              <>
                {selectedBatch && (
                  <Button size="sm" variant="outline" onClick={() => setDrawerOpen(true)}>
                    {t('trace.graph.details')}
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setSelectedId(undefined)}>
                  {t('trace.graph.clear')}
                </Button>
              </>
            )
          }
        />
        <SectionPanel title={t('trace.graph.title')} subtitle={t('trace.graph.subtitle')}>
          <Card className="p-3">
            <GenealogyGraph selectedId={selectedId} onSelect={setSelectedId} />
          </Card>
        </SectionPanel>
      </div>
      {drawerOpen && selectedBatch && <BatchDrawer batch={selectedBatch} onClose={() => setDrawerOpen(false)} />}
    </>
  )
}
