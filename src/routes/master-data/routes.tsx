import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { ParamValue } from '../../components/common/ParamValue'
import { PageHeader } from '../../components/layout/PageHeader'
import { Select } from '../../components/ui/Select'
import type { Connection } from '../../data/reference'
import { useTranslation } from '../../lib/i18n'
import { CatalogNote } from '../../components/common/SourceNote'
import { upsertCatalog, useCatalog } from '../../state/catalog'
import { CatalogBanner } from './-components/CatalogBanner'
import { RecordActions } from './-components/RecordActions'
import { connectionFields, parseConnection } from './-components/fields'

export const Route = createFileRoute('/master-data/routes')({ component: RoutesPage })

const ALL = 'all'

function RoutesPage() {
  const { t } = useTranslation()
  const { data } = useCatalog()
  const [flowType, setFlowType] = useState(ALL)
  const connections = data.connections

  const flowTypes = useMemo(() => Array.from(new Set(connections.map((c) => c.flowType))), [connections])
  const rows = flowType === ALL ? connections : connections.filter((c) => c.flowType === flowType)
  const flowLabel = (type: string) => {
    const key = `master.routes.flow.${type}`
    const label = t(key)
    return label === key ? type : label
  }

  const columns: DataTableColumn<Connection>[] = [
    { key: 'id', header: t('col.connection'), type: 'mono', sortable: true },
    { key: 'source', header: t('col.from'), type: 'mono', sortable: true },
    { key: 'via', header: t('col.via'), type: 'mono' },
    { key: 'destination', header: t('col.to'), type: 'mono', sortable: true },
    { key: 'flowType', header: t('col.flowType'), sortable: true, render: (row) => flowLabel(row.flowType) },
    { key: 'maxFlow', header: t('col.maxFlow'), hint: 'L/h', align: 'right', render: (row) => <ParamValue value={row.maxFlow} /> },
    { key: 'condition', header: t('col.condition'), className: 'min-w-[260px] text-ink' }
  ]

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
      <CatalogBanner />
      <DataTable
        title={t('master.routes.table')}
        subtitle={t('master.routes.tableHint')}
        toolbar={
          <>
            <RecordActions
              title={t('master.routes.table')}
              fileName="asset_connections"
              fields={connectionFields(t)}
              parse={parseConnection}
              onApply={(routeRows) => upsertCatalog('connections', routeRows, (row) => row.id)}
            />
            <Select
              className="w-56"
              value={flowType}
              onChange={setFlowType}
              aria-label={t('col.flowType')}
              options={[
                { value: ALL, label: t('master.routes.allFlows', { count: connections.length }) },
                ...flowTypes.map((type) => ({
                  value: type,
                  label: `${flowLabel(type)} (${connections.filter((c) => c.flowType === type).length})`
                }))
              ]}
            />
          </>
        }
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        searchText={(row) => `${row.id} ${row.source} ${row.destination} ${row.via ?? ''}`}
        searchPlaceholder={t('master.routes.search')}
        pageSize={15}
        dense
        note={<CatalogNote files={['asset_connections.csv']} />}
      />
      </div>
    </>
  )
}
