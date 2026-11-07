import { createFileRoute } from '@tanstack/react-router'
import { DataTable, type DataTableColumn } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import {
  getLiquidSku,
  getPackSize,
  type FinishedSku,
  type LiquidSku,
  type MarketVariant,
  type PackSize
} from '../../data/reference'
import { isFlavoured, milkFraction } from '../../domain/products'
import { useTranslation } from '../../lib/i18n'
import { CatalogNote } from '../../components/common/SourceNote'
import { upsertCatalog, useCatalog } from '../../state/catalog'
import { CatalogBanner } from './-components/CatalogBanner'
import { RecordActions } from './-components/RecordActions'
import { finishedFields, liquidFields, marketFields, packFields, parseFinished, parseLiquid, parseMarket, parsePack } from './-components/fields'

export const Route = createFileRoute('/master-data/products')({ component: ProductsPage })

function ProductsPage() {
  const { t } = useTranslation()
  const { data } = useCatalog()

  const liquidColumns: DataTableColumn<LiquidSku>[] = [
    { key: 'skuId', header: t('col.sku'), type: 'mono', sortable: true },
    { key: 'productName', header: t('col.product'), sortable: true },
    { key: 'family', header: t('col.family'), sortable: true },
    { key: 'flavour', header: t('col.flavour'), sortable: true },
    {
      key: 'milk',
      header: t('col.milkContent'),
      hint: t('master.milkContentHint'),
      type: 'number',
      value: (row) => milkFraction(row.skuId) * 100,
      render: (row) => (
        <Badge tone={isFlavoured(row.skuId) ? 'brand' : 'info'} icon={null}>
          {milkFraction(row.skuId) * 100}%
        </Badge>
      )
    },
    { key: 'packs', header: t('col.packSizes'), render: (row) => row.packSizeCodes.join(', ') },
    { key: 'markets', header: t('col.markets'), render: (row) => row.marketVariants.join(', ') }
  ]

  const finishedColumns: DataTableColumn<FinishedSku>[] = [
    { key: 'finishedSkuId', header: t('col.finishedSku'), type: 'mono', sortable: true },
    { key: 'liquidSkuId', header: t('col.sku'), type: 'mono', sortable: true },
    { key: 'product', header: t('col.product'), value: (row) => getLiquidSku(row.liquidSkuId)?.productName },
    { key: 'packSizeCode', header: t('col.packSize'), sortable: true },
    { key: 'ml', header: t('col.sizeMl'), type: 'number', sortable: true, value: (row) => getPackSize(row.packSizeCode)?.sizeMl },
    { key: 'marketVariant', header: t('col.market'), sortable: true }
  ]

  const packColumns: DataTableColumn<PackSize>[] = [
    { key: 'code', header: t('col.packSize'), type: 'mono' },
    { key: 'description', header: t('col.description') },
    { key: 'sizeMl', header: t('col.sizeMl'), type: 'number' }
  ]

  const marketColumns: DataTableColumn<MarketVariant>[] = [
    { key: 'code', header: t('col.market'), type: 'mono' },
    { key: 'name', header: t('col.description') },
    { key: 'applicableLiquidSkus', header: t('col.appliesTo') }
  ]

  return (
    <>
      <PageHeader />
      <div className="space-y-5">
        <CatalogBanner />
        <DataTable
          title={t('master.products.liquid')}
          subtitle={t('master.products.liquidHint')}
          toolbar={
            <RecordActions
              title={t('master.products.liquid')}
              fileName="product_catalog"
              fields={liquidFields(t)}
              parse={parseLiquid}
              onApply={(rows) => upsertCatalog('liquidSkus', rows, (row) => row.skuId)}
            />
          }
          columns={liquidColumns}
          rows={data.liquidSkus}
          rowKey={(row) => row.skuId}
          note={<CatalogNote files={['product_catalog.csv']} />}
        />
        <DataTable
          title={t('master.products.finished')}
          subtitle={t('master.products.finishedHint')}
          toolbar={
            <RecordActions
              title={t('master.products.finished')}
              fileName="finished_sku_catalog"
              fields={finishedFields(t)}
              parse={parseFinished}
              onApply={(rows) => upsertCatalog('finishedSkus', rows, (row) => row.finishedSkuId)}
            />
          }
          columns={finishedColumns}
          rows={data.finishedSkus}
          rowKey={(row) => row.finishedSkuId}
          searchText={(row) => `${row.finishedSkuId} ${row.liquidSkuId} ${row.marketVariant}`}
          pageSize={12}
          dense
          note={<CatalogNote files={['finished_sku_catalog.csv']} />}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <DataTable
            title={t('master.products.packSizes')}
            toolbar={
              <RecordActions
                title={t('master.products.packSizes')}
                fileName="pack_size_codes"
                fields={packFields(t)}
                parse={parsePack}
                onApply={(rows) => upsertCatalog('packSizes', rows, (row) => row.code)}
              />
            }
            columns={packColumns}
            rows={data.packSizes}
            rowKey={(row) => row.code}
            dense
            note={<CatalogNote files={['pack_size_codes.csv']} />}
          />
          <DataTable
            title={t('master.products.markets')}
            subtitle={t('master.products.marketsHint')}
            toolbar={
              <RecordActions
                title={t('master.products.markets')}
                fileName="market_variants"
                fields={marketFields(t)}
                parse={parseMarket}
                onApply={(rows) => upsertCatalog('markets', rows, (row) => row.code)}
              />
            }
            columns={marketColumns}
            rows={data.markets}
            rowKey={(row) => row.code}
            dense
            note={<CatalogNote files={['market_variants.csv']} />}
          />
        </div>
      </div>
    </>
  )
}
