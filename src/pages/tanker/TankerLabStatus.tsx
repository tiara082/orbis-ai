import React from 'react'
import { ClipboardCheck, ShieldAlert } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { KeyValueList } from '../../components/common/KeyValueList'
import { Callout } from '../../components/common/Callout'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

interface TankerLabStatusProps {
  onRecordResult: () => void
  onOpenPending?: () => void
}

export const TankerLabStatus: React.FC<TankerLabStatusProps> = ({ onRecordResult, onOpenPending }) => (
  <>
    <PageHeader
      title="Sampling & lab status"
      description="Quality release remains human-controlled"
      actions={
        <>
          {onOpenPending && (
            <Button variant="secondary" onClick={onOpenPending}>
              Mark as pending
            </Button>
          )}
          <Button icon={ClipboardCheck} onClick={onRecordResult}>
            Record lab result
          </Button>
        </>
      }
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <SectionPanel title="Sample S-042-01" actions={<Badge status="In progress">Lab test in progress</Badge>}>
        <Card className="px-5 py-2">
          <KeyValueList
            items={[
              { label: 'Tanker', value: 'TRK-042', mono: true },
              { label: 'Sample time', value: '09:32' },
              { label: 'Test panel', value: 'Fat · protein · acidity' },
              { label: 'Reviewer', value: 'Lab team pending' }
            ]}
          />
        </Card>
      </SectionPanel>

      <SectionPanel title="Release decision">
        <div className="space-y-3">
          <Callout
            tone="neutral"
            title="ORBIS may prioritize and surface results."
            description="Lab values are attached to the tanker record and to every batch that consumes this milk."
          />
          <Callout
            tone="danger"
            icon={ShieldAlert}
            title="It does not independently approve milk quality release."
            description="A QA reviewer must record the decision before unloading can start."
          />
        </div>
      </SectionPanel>
    </div>
  </>
)
