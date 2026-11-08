import { Link } from '@tanstack/react-router'
import { ArrowLeftToLine, ArrowRightToLine, ExternalLink } from 'lucide-react'
import { DetailDrawer, DrawerSection } from '../../../components/common/DetailDrawer'
import { KeyValueList } from '../../../components/common/KeyValueList'
import { Badge } from '../../../components/ui/Badge'
import type { Batch } from '../../../data/scenario'
import { SIDE_INPUTS } from '../../../data/scenario'
import { massBalance, transfersInto, transfersOutOf } from '../../../domain/genealogy'
import { useFormat } from '../../../lib/format'
import { useTranslation } from '../../../lib/i18n'

export function BatchDrawer({ batch, onClose }: { batch: Batch; onClose: () => void }) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const balance = massBalance(batch.id)
  const inputs = transfersInto(batch.id)
  const outputs = transfersOutOf(batch.id)
  const sideInputs = SIDE_INPUTS.filter((input) => input.batchId === batch.id)

  return (
    <DetailDrawer
      open
      onClose={onClose}
      eyebrow={t(`trace.kind.${batch.kind}`)}
      title={
        <span className="flex items-center gap-2">
          <span className="font-mono">{batch.id}</span> <Badge status={batch.status} />
        </span>
      }
      description={`${batch.assetId} · ${batch.material} · ${fmt.liters(batch.volumeL)}`}
    >
      <div className="flex flex-wrap gap-2">
        <Link
          to="/milk-traceability/batch-detail"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Buka Detail Batch Lengkap
        </Link>
        <Link
          to="/milk-traceability/backward"
          search={{ batch: batch.id }}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-xs font-medium text-ink-strong hover:bg-gray-50"
        >
          <ArrowLeftToLine className="w-3.5 h-3.5" /> {t('trace.openBackward')}
        </Link>
        <Link
          to="/milk-traceability/forward"
          search={{ batch: batch.id }}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-xs font-medium text-ink-strong hover:bg-gray-50"
        >
          <ArrowRightToLine className="w-3.5 h-3.5" /> {t('trace.openForward')}
        </Link>
      </div>

      <DrawerSection title={t('trace.massBalance')}>
        <KeyValueList
          items={[
            { label: t('trace.balance.opening'), value: fmt.liters(balance.opening) },
            { label: t('trace.balance.inflow'), value: fmt.liters(balance.inflow) },
            { label: t('trace.balance.output'), value: fmt.liters(balance.output) },
            { label: t('trace.balance.coProduct'), value: fmt.liters(balance.coProduct) },
            { label: t('trace.balance.closing'), value: fmt.liters(balance.closing) },
            {
              label: t('trace.balance.variance'),
              value: (
                <span className="inline-flex items-center gap-2">
                  {fmt.liters(balance.variance)}
                  <Badge status={Math.abs(balance.variance) < 1 ? 'pass' : 'warning'} />
                </span>
              )
            }
          ]}
        />
        <p className="text-[11px] text-ink mt-2">{t('trace.balance.formula')}</p>
      </DrawerSection>

      <DrawerSection title={t('trace.inputs')}>
        {inputs.length === 0 && sideInputs.length === 0 ? (
          <p className="text-sm text-ink">{t('trace.noInputs')}</p>
        ) : (
          <KeyValueList
            items={[
              ...inputs.map((transfer) => ({ label: `${transfer.id} · ${transfer.fromBatch}`, value: fmt.liters(transfer.volumeL) })),
              ...sideInputs.map((input) => ({ label: t(`trace.sideInput.${input.label}`), value: fmt.liters(input.volumeL) }))
            ]}
          />
        )}
      </DrawerSection>

      <DrawerSection title={t('trace.outputs')}>
        {outputs.length === 0 ? (
          <p className="text-sm text-ink">{t('trace.noOutputs')}</p>
        ) : (
          <KeyValueList items={outputs.map((transfer) => ({ label: `${transfer.id} · ${transfer.toBatch}`, value: fmt.liters(transfer.volumeL) }))} />
        )}
      </DrawerSection>
    </DetailDrawer>
  )
}
