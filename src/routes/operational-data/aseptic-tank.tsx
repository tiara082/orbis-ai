import { createFileRoute } from '@tanstack/react-router'
import { Gauge } from 'lucide-react'
import { Callout } from '../../components/common/Callout'
import { KeyValueList } from '../../components/common/KeyValueList'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { linesFedBy } from '../../data/reference'
import { ASSET_STATES, type AssetState } from '../../data/scenario'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { MachineTable, TankTable } from './-components/AssetTables'

export const Route = createFileRoute('/operational-data/aseptic-tank')({ component: AsepticTankPage })

/** SIMULTANEOUS: minimum operating level depends on how many filling lines draw from the tank */
const minLevelFor = (state: AssetState, lines: number) =>
  lines >= 2 ? state.minLevelPct?.twoLines ?? 50 : state.minLevelPct?.oneLine ?? 25

function AsepticTankPage() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const sterilizers = ASSET_STATES.filter((state) => state.assetId.startsWith('ST-'))
  const tanks = ASSET_STATES.filter((state) => state.assetId.startsWith('AT-'))
  const running = tanks.filter((tank) => (tank.activeLines ?? 0) > 0)

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <Callout tone="info" icon={Gauge} eyebrow={`SIMULTANEOUS · ${t('checks.SIMULTANEOUS.title')}`} title={t('ops.aseptic.ruleTitle')} description={t('ops.aseptic.ruleBody')} />

        {running.length > 0 && (
          <SectionPanel title={t('ops.aseptic.live')} subtitle={t('ops.aseptic.liveHint')}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {running.map((tank) => {
                const capacity = tank.capacityL ?? 0
                const volume = tank.volumeL ?? 0
                const lines = tank.activeLines ?? 0
                const minNow = minLevelFor(tank, lines)
                const minTwo = minLevelFor(tank, 2)
                const okForTwo = (volume / capacity) * 100 >= minTwo
                return (
                  <Card key={tank.assetId} className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-sm font-bold text-ink-strong">
                        {tank.assetId} · {tank.material}
                      </p>
                      <Badge status={tank.status} />
                    </div>
                    <KeyValueList
                      items={[
                        { label: t('ops.aseptic.level'), value: `${fmt.liters(volume)} · ${fmt.pct(Math.round((volume / capacity) * 100))}` },
                        { label: t('ops.aseptic.activeLines'), value: `${lines} (${linesFedBy(tank.assetId).join(', ')})` },
                        { label: t('ops.aseptic.minNow', { lines }), value: `${fmt.pct(minNow)} · ${fmt.liters((capacity * minNow) / 100)}` },
                        {
                          label: t('ops.aseptic.minTwo'),
                          value: (
                            <span className="inline-flex items-center gap-2">
                              {fmt.pct(minTwo)} · {fmt.liters((capacity * minTwo) / 100)}
                              <Badge status={okForTwo ? 'pass' : 'warning'} />
                            </span>
                          )
                        }
                      ]}
                    />
                  </Card>
                )
              })}
            </div>
          </SectionPanel>
        )}

        <TankTable
          title={t('ops.aseptic.tanks')}
          rows={tanks}
          levelMarker={(row) => minLevelFor(row, row.activeLines ?? 0)}
          extra={[
            { key: 'lines', header: t('col.linesFed'), render: (row) => linesFedBy(row.assetId).join(', ') },
            { key: 'activeLines', header: t('col.activeLines'), type: 'number' },
            { key: 'minLevel', header: t('col.minLevel'), type: 'number', render: (row) => fmt.pct(minLevelFor(row, row.activeLines ?? 0)) }
          ]}
        />
        <MachineTable title={t('ops.aseptic.sterilizers')} subtitle={t('ops.aseptic.sterilizersHint')} rows={sterilizers} />
      </div>
    </>
  )
}
