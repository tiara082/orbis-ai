import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Boxes, CircleDashed, Factory, Waypoints } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { ParamValue } from '../../components/common/ParamValue'
import { StatCard } from '../../components/common/StatCard'
import { PageHeader } from '../../components/layout/PageHeader'
import { Select } from '../../components/ui/Select'
import { ASSET_PARAMS, ASSET_TYPE_ORDER, ASSET_UNITS, type Asset, type AssetUnit } from '../../data/reference'
import { useTranslation } from '../../lib/i18n'
import { CatalogNote } from '../../components/common/SourceNote'
import { upsertCatalog, useCatalog } from '../../state/catalog'
import { CatalogBanner } from './-components/CatalogBanner'
import { RecordActions } from './-components/RecordActions'
import { assetFields, parseAsset } from './-components/fields'

export const Route = createFileRoute('/master-data/assets')({ component: AssetsPage })

const ALL = 'all'
const PHYSICAL_ROLES = ['process_asset', 'physical_pipe']

function AssetsPage() {
  const { t } = useTranslation()
  const { data } = useCatalog()
  const [type, setType] = useState(ALL)
  const assets = data.assets

  const rows = type === ALL ? assets : assets.filter((asset) => asset.type === type)
  const pendingCount = assets.reduce((sum, asset) => sum + ASSET_PARAMS.filter((param) => asset.params[param] === 'pending').length, 0)
  const unitOf = (param: string) => ASSET_UNITS.find((unit) => unit.field === param)?.unit

  const paramColumns: DataTableColumn<Asset>[] = ASSET_PARAMS.map((param) => ({
    key: param,
    header: t(`col.param.${param}`),
    hint: unitOf(param),
    align: 'right',
    render: (row: Asset) => <ParamValue value={row.params[param]} />
  }))

  const columns: DataTableColumn<Asset>[] = [
    { key: 'id', header: t('col.asset'), type: 'mono', sortable: true },
    { key: 'name', header: t('col.name'), sortable: true },
    { key: 'type', header: t('col.type'), sortable: true },
    { key: 'nodeRole', header: t('col.role'), render: (row) => t(`master.assets.role.${row.nodeRole}`) },
    { key: 'families', header: t('col.family'), render: (row) => row.compatibleFamilies.join(', ') || '—' },
    ...paramColumns
  ]

  const unitColumns: DataTableColumn<AssetUnit>[] = [
    { key: 'field', header: t('col.parameter'), type: 'mono' },
    { key: 'unit', header: t('col.unit') },
    { key: 'appliesTo', header: t('col.appliesTo') },
    { key: 'definition', header: t('col.definition') }
  ]

  const typeOptions = [
    { value: ALL, label: t('master.assets.allTypes', { count: assets.length }) },
    ...ASSET_TYPE_ORDER.map((name) => ({ value: name, label: `${name} (${assets.filter((a) => a.type === name).length})` }))
  ]

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <CatalogBanner />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Boxes} label={t('master.assets.total')} value={assets.length} caption={t('master.assets.totalCaption', { types: ASSET_TYPE_ORDER.length })} />
          <StatCard
            icon={Factory}
            label={t('master.assets.physical')}
            value={assets.filter((a) => PHYSICAL_ROLES.includes(a.nodeRole)).length}
            caption={t('master.assets.physicalCaption')}
          />
          <StatCard
            icon={Waypoints}
            label={t('master.assets.logical')}
            value={assets.filter((a) => !PHYSICAL_ROLES.includes(a.nodeRole)).length}
            caption={t('master.assets.logicalCaption')}
          />
          <StatCard
            icon={CircleDashed}
            label={t('master.assets.pendingParams')}
            value={pendingCount}
            caption={t('master.assets.pendingCaption')}
            captionTone="warning"
          />
        </div>

        <DataTable
          title={t('master.assets.table')}
          subtitle={t('master.assets.tableHint')}
          toolbar={
            <>
              <RecordActions
                title={t('master.assets.table')}
                fileName="asset_configuration"
                fields={assetFields(t)}
                parse={parseAsset}
                onApply={(assetRows) => upsertCatalog('assets', assetRows, (row) => row.id)}
              />
              <Select className="w-60" value={type} onChange={setType} options={typeOptions} aria-label={t('col.type')} />
            </>
          }
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          searchText={(row) => `${row.id} ${row.name} ${row.type}`}
          pageSize={15}
          dense
          note={<CatalogNote files={['asset_configuration.csv']} />}
        />

        <DataTable
          title={t('master.assets.units')}
          subtitle={t('master.assets.unitsHint')}
          columns={unitColumns}
          rows={ASSET_UNITS}
          rowKey={(row) => row.field}
          dense
          note={<CatalogNote files={['asset_units.csv']} />}
        />
      </div>
    </>
  )
}
