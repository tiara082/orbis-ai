import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../../components/layout/PageHeader'
import { CheckCallout } from '../../components/planning/CheckCallout'
import { ASSET_STATES } from '../../data/scenario'
import { checkCapacity, checkReceivingCapacity } from '../../domain/checks'
import { useTranslation } from '../../lib/i18n'
import { MachineTable, TankTable } from './-components/AssetTables'

export const Route = createFileRoute('/operational-data/raw-milk-process')({ component: RawMilkProcessPage })

const byPrefix = (...prefixes: string[]) => ASSET_STATES.filter((state) => prefixes.some((prefix) => state.assetId.startsWith(prefix)))

function RawMilkProcessPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <CheckCallout check={checkReceivingCapacity()} />
          <CheckCallout check={checkCapacity()} />
        </div>
        <TankTable title={t('ops.raw.tanks')} rows={byPrefix('RMT-')} />
        <MachineTable title={t('ops.raw.machines')} subtitle={t('ops.raw.machinesHint')} rows={byPrefix('DG-', 'TH-', '1-Sep', '2-Sep')} />
        <TankTable title={t('ops.raw.intermediate')} subtitle={t('ops.raw.intermediateHint')} rows={byPrefix('CRT-', 'PREMIX-', 'MIX-')} />
      </div>
    </>
  )
}
