import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { ParamValue } from '../../components/common/ParamValue'
import { PageHeader } from '../../components/layout/PageHeader'
import { Select } from '../../components/ui/Select'
import { CONNECTIONS, type Connection } from '../../data/reference'
import { useTranslation } from '../../lib/i18n'
import { CatalogNote } from '../../components/common/SourceNote'

export const Route = createFileRoute('/master-data/routes')({ component: RoutesPage })

const ALL = 'all'

function RoutesPage() {
  const { t } = useTranslation()
  const [flowType, setFlowType] = useState(ALL)

  const flowTypes = useMemo(() => [...new Set(CONNECTIONS.map((c) => c.flowType))], [])
  const rows = flowType === ALL ? CONNECTIONS : CONNECTIONS.filter((c) => c.flowType === flowType)

  const columns: DataTableColumn<Connection>[] = [
    { key: 'id', header: t('col.connection'), type: 'mono', sortable: true },
    { key: 'source', header: t('col.from'), type: 'mono', sortable: true },
    { key: 'via', header: t('col.via'), type: 'mono' },
    { key: 'destination', header: t('col.to'), type: 'mono', sortable: true },
    { key: 'flowType', header: t('col.flowType'), sortable: true, render: (row) => t(`master.routes.flow.${row.flowType}`) },
    { key: 'maxFlow', header: t('col.maxFlow'), hint: 'L/h', align: 'right', render: (row) => <ParamValue value={row.maxFlow} /> },
    { key: 'condition', header: t('col.condition'), className: 'min-w-[260px] text-ink' }
  ]

  return (
    <>
      <PageHeader />
      <DataTable
        title={t('master.routes.table')}
        subtitle={t('master.routes.tableHint')}
        toolbar={
          <Select
            className="w-56"
            value={flowType}
            onChange={setFlowType}
            aria-label={t('col.flowType')}
            options={[
              { value: ALL, label: t('master.routes.allFlows', { count: CONNECTIONS.length }) },
              ...flowTypes.map((type) => ({
                value: type,
                label: `${t(`master.routes.flow.${type}`)} (${CONNECTIONS.filter((c) => c.flowType === type).length})`
              }))
            ]}
          />
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
    </>
  )
}
