import { createFileRoute } from '@tanstack/react-router'
import { Archive, Droplets, Hourglass, Milk } from 'lucide-react'
import { StatCard } from '../../components/common/StatCard'
import { PageHeader } from '../../components/layout/PageHeader'
import { CheckCallout } from '../../components/planning/CheckCallout'
import { ASSET_STATES } from '../../data/scenario'
import { checkHolding } from '../../domain/checks'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { TankTable } from './-components/AssetTables'

export const Route = createFileRoute('/operational-data/sfp-storage')({ component: SfpStoragePage })

function SfpStoragePage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const tanks = ASSET_STATES.filter((state) => state.assetId.startsWith('SFP-'))
  const used = tanks.filter((tank) => (tank.volumeL ?? 0) > 0)
  const capacity = tanks.reduce((sum, tank) => sum + (tank.capacityL ?? 0), 0)
  const volume = tanks.reduce((sum, tank) => sum + (tank.volumeL ?? 0), 0)
  const cip = tanks.filter((tank) => tank.status === 'cip' || tank.status === 'cip required')

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Archive} label={t('ops.sfp.tanks')} value={tanks.length} caption={t('ops.sfp.tanksCaption', { capacity: fmt.liters(capacity) })} />
          <StatCard icon={Milk} label={t('ops.sfp.inUse')} value={used.length} caption={fmt.liters(volume)} />
          <StatCard icon={Droplets} label={t('ops.sfp.cip')} value={cip.length} caption={cip.map((tank) => tank.assetId).join(', ')} captionStatus="cip required" />
          <StatCard
            icon={Hourglass}
            label={t('ops.sfp.holdingRisk')}
            value={tanks.filter((tank) => tank.status === 'holding risk').length}
            caption={t('ops.sfp.holdingCaption')}
            captionStatus="holding risk"
          />
        </div>
        <CheckCallout check={checkHolding()} />
        <TankTable title={t('ops.sfp.table')} rows={tanks} />
      </div>
    </>
  )
}
