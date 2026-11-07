import { Link } from '@tanstack/react-router'
import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-react'
import { DetailDrawer, DrawerSection } from '../../../components/common/DetailDrawer'
import { KeyValueList } from '../../../components/common/KeyValueList'
import { Badge } from '../../../components/ui/Badge'
import type { Batch } from '../../../data/scenario'
import type { TraceabilitySnapshot } from '../../../data/traceability'
import { historicalMassBalance, transfersInto, transfersOutOf } from '../../../domain/genealogy'
import { useFormat } from '../../../lib/format'
import { useTranslation } from '../../../lib/i18n'

export function BatchDrawer({ batch, snapshot, onClose }: { batch: Batch; snapshot: TraceabilitySnapshot; onClose: () => void }) {
  const { t } = useTranslation()
  const fmt = useFormat()
  const balance = historicalMassBalance(batch.id, snapshot)
  const inputs = transfersInto(batch.id, snapshot)
  const outputs = transfersOutOf(batch.id, snapshot)
  const sideInputs = snapshot.sideInputs.filter((input) => input.batchId === batch.id)
  const quantity = (value: typeof balance.opening) => value.status === 'known' ? fmt.liters(value.value) : 'Tidak tersedia'

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
            { label: t('trace.balance.opening'), value: quantity(balance.opening) },
            { label: t('trace.balance.inflow'), value: quantity(balance.inflow) },
            { label: t('trace.balance.output'), value: quantity(balance.output) },
            { label: t('trace.balance.coProduct'), value: quantity(balance.coProduct) },
            { label: t('trace.balance.closing'), value: quantity(balance.closing) },
            {
              label: t('trace.balance.variance'),
              value: (
                <span className="inline-flex items-center gap-2">
                  {quantity(balance.variance)}
                  {balance.variance.status === 'known' && <Badge status={Math.abs(balance.variance.value) < 1 ? 'pass' : 'warning'} />}
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
