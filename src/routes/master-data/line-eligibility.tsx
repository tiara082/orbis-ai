import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { ParamValue } from '../../components/common/ParamValue'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { SegmentedFilter } from '../../components/ui/SegmentedFilter'
import {
  LINE_DEDICATION,
  LINE_FINISHED_SKU_COMPATIBILITY,
  LINE_PRODUCT_COMPATIBILITY,
  getPackSize,
  lineSupply,
  type LineDedication,
  type LineFinishedSkuCompatibility,
  type LineProductCompatibility
} from '../../data/reference'
import { useTranslation } from '../../lib/i18n'
import { CatalogNote } from '../../components/common/SourceNote'

export const Route = createFileRoute('/master-data/line-eligibility')({ component: LineEligibilityPage })

const eligibility = (eligible: boolean) => <Badge status={eligible ? 'eligible' : 'not eligible'} />

function LineEligibilityPage() {
  const { t } = useTranslation()
  const [lineId, setLineId] = useState('FL-01')
  const [onlyEligible, setOnlyEligible] = useState<'eligible' | 'all'>('eligible')

  const dedicationColumns: DataTableColumn<LineDedication>[] = [
    { key: 'lineId', header: t('col.line'), type: 'mono', sortable: true },
    { key: 'sourceAsepticTankId', header: t('col.asepticTank'), type: 'mono', sortable: true },
    { key: 'pipe', header: t('col.pipe'), type: 'mono', value: (row) => lineSupply(row.lineId).pipeId },
    { key: 'allowed', header: t('col.allowedSkus'), render: (row) => row.allowedSkuIds.join(', ') },
    {
      key: 'packs',
      header: t('col.packSizes'),
      render: (row) => row.packSizeCodes.map((code) => `${code} (${getPackSize(code)?.sizeMl ?? '?'} ml)`).join(', ')
    },
    { key: 'speed', header: t('col.speedPackph'), align: 'right', render: (row) => <ParamValue value={row.speed} /> }
  ]

  const productColumns: DataTableColumn<LineProductCompatibility>[] = [
    { key: 'skuId', header: t('col.sku'), type: 'mono', sortable: true },
    { key: 'packSizeCode', header: t('col.packSize'), sortable: true },
    { key: 'eligible', header: t('col.eligible'), render: (row) => eligibility(row.eligible) }
  ]

  const finishedColumns: DataTableColumn<LineFinishedSkuCompatibility>[] = [
    { key: 'finishedSkuId', header: t('col.finishedSku'), type: 'mono', sortable: true },
    { key: 'liquidSkuId', header: t('col.sku'), type: 'mono' },
    { key: 'packSizeCode', header: t('col.packSize') },
    { key: 'marketVariant', header: t('col.market') },
    { key: 'eligible', header: t('col.eligible'), render: (row) => eligibility(row.eligible) }
  ]

  const productRows = LINE_PRODUCT_COMPATIBILITY.filter((row) => row.lineId === lineId && (onlyEligible === 'all' || row.eligible))
  const finishedRows = LINE_FINISHED_SKU_COMPATIBILITY.filter((row) => row.lineId === lineId && (onlyEligible === 'all' || row.eligible))

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <DataTable
          title={t('master.lines.dedication')}
          subtitle={t('master.lines.dedicationHint')}
          columns={dedicationColumns}
          rows={LINE_DEDICATION}
          rowKey={(row) => row.lineId}
          onRowClick={(row) => setLineId(row.lineId)}
          selectedKey={lineId}
          dense
          note={<CatalogNote files={['line_dedication.csv', 'asset_connections.csv']} />}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-ink-strong">{t('master.lines.matrixFor', { line: lineId })}</p>
            <p className="text-xs text-ink mt-0.5">{t('master.lines.matrixHint')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedFilter
              value={lineId}
              onChange={setLineId}
              options={LINE_DEDICATION.map((line) => ({ value: line.lineId, label: line.lineId }))}
            />
            <SegmentedFilter
              value={onlyEligible}
              onChange={setOnlyEligible}
              options={[
                { value: 'eligible', label: t('master.lines.onlyEligible') },
                { value: 'all', label: t('master.lines.allRows') }
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <DataTable
            title={t('master.lines.byProduct')}
            columns={productColumns}
            rows={productRows}
            rowKey={(row) => `${row.skuId}-${row.packSizeCode}`}
            pageSize={10}
            dense
            note={<CatalogNote files={['line_product_compatibility.csv']} />}
          />
          <DataTable
            title={t('master.lines.byFinished')}
            columns={finishedColumns}
            rows={finishedRows}
            rowKey={(row) => row.finishedSkuId}
            searchText={(row) => row.finishedSkuId}
            pageSize={10}
            dense
            note={<CatalogNote files={['line_finished_sku_compatibility.csv']} />}
          />
        </div>
      </div>
    </>
  )
}
