import assetConfigurationCsv from './asset_configuration.csv?raw'
import assetConnectionsCsv from './asset_connections.csv?raw'
import assetUnitsCsv from './asset_units.csv?raw'
import changeoverRulesCsv from './changeover_rules.csv?raw'
import cipRulesCsv from './cip_rules.csv?raw'
import constraintCatalogCsv from './constraint_catalog.csv?raw'
import finishedSkuCatalogCsv from './finished_sku_catalog.csv?raw'
import lineDedicationCsv from './line_dedication.csv?raw'
import lineFinishedSkuCompatibilityCsv from './line_finished_sku_compatibility.csv?raw'
import lineProductCompatibilityCsv from './line_product_compatibility.csv?raw'
import marketVariantsCsv from './market_variants.csv?raw'
import packSizeCodesCsv from './pack_size_codes.csv?raw'
import productCatalogCsv from './product_catalog.csv?raw'
import { parseCsv, parseParam, splitList, type ParamCell } from './csv'

export type { ParamCell } from './csv'

export const CATALOG_FILE_COUNT = 13

// ---------- Products ----------

export interface LiquidSku {
  skuId: string
  productName: string
  family: string
  flavour: string
  packSizeCodes: string[]
  marketVariants: string[]
}

export interface FinishedSku {
  finishedSkuId: string
  liquidSkuId: string
  packSizeCode: string
  marketVariant: string
}

export interface PackSize {
  code: string
  description: string
  sizeMl: number
}

export interface MarketVariant {
  code: string
  name: string
  applicableLiquidSkus: string
}

export const LIQUID_SKUS: LiquidSku[] = parseCsv(productCatalogCsv).map((row) => ({
  skuId: row.sku_id,
  productName: row.product_name,
  family: row.product_family,
  flavour: row.flavour,
  packSizeCodes: splitList(row.allowed_pack_size_codes),
  marketVariants: splitList(row.market_variants)
}))

export const FINISHED_SKUS: FinishedSku[] = parseCsv(finishedSkuCatalogCsv).map((row) => ({
  finishedSkuId: row.finished_sku_id,
  liquidSkuId: row.liquid_sku_id,
  packSizeCode: row.pack_size_code,
  marketVariant: row.market_variant
}))

export const PACK_SIZES: PackSize[] = parseCsv(packSizeCodesCsv).map((row) => ({
  code: row.pack_size_code,
  description: row.description,
  sizeMl: Number(row.exact_size_ml)
}))

export const MARKET_VARIANTS: MarketVariant[] = parseCsv(marketVariantsCsv).map((row) => ({
  code: row.market_variant,
  name: row.market_name,
  applicableLiquidSkus: row.applicable_liquid_skus
}))

// ---------- Assets ----------

export const ASSET_PARAMS = [
  'capacity_l',
  'input_flow_lph',
  'output_flow_lph',
  'process_speed_lph',
  'holding_time_limit_hours',
  'cip_duration_minutes',
  'speed_packph'
] as const

export type AssetParam = (typeof ASSET_PARAMS)[number]

export interface AssetUnit {
  field: AssetParam
  appliesTo: string
  unit: string
  definition: string
}

export interface Asset {
  id: string
  type: string
  name: string
  nodeRole: string
  compatibleFamilies: string[]
  params: Record<AssetParam, ParamCell>
}

export const ASSET_UNITS: AssetUnit[] = parseCsv(assetUnitsCsv).map((row) => ({
  field: row.field as AssetParam,
  appliesTo: row.applies_to,
  unit: row.unit,
  definition: row.definition
}))

export const ASSETS: Asset[] = parseCsv(assetConfigurationCsv).map((row) => ({
  id: row.asset_id,
  type: row.asset_type,
  name: row.asset_name,
  nodeRole: row.node_role,
  compatibleFamilies: splitList(row.compatible_product_family),
  params: Object.fromEntries(ASSET_PARAMS.map((param) => [param, parseParam(row[param] ?? '')])) as Record<
    AssetParam,
    ParamCell
  >
}))

/** Asset types in process order, used for grouping and filters */
export const ASSET_TYPE_ORDER = [
  'Farm Supply Boundary',
  'Road Tanker Delivery Boundary',
  'Unloading Bay',
  'Degassing',
  'Raw Milk Tank',
  'Thermizer',
  'Separation / Standardization',
  'SFP Storage Tank',
  'Cream Tank',
  'Premix Tank',
  'Mixing Tank',
  'Sterilizer',
  'Aseptic Tank',
  'Dedicated Pipe',
  'Filling Line',
  'Finished Goods Batch Boundary',
  'Logical Routing Header'
]

export interface CatalogOverlay {
  liquidSkus?: LiquidSku[]
  finishedSkus?: FinishedSku[]
  packSizes?: PackSize[]
  markets?: MarketVariant[]
  assets?: Asset[]
  connections?: Connection[]
  lineDedication?: LineDedication[]
  lineProducts?: LineProductCompatibility[]
  lineFinished?: LineFinishedSkuCompatibility[]
  constraints?: ConstraintRule[]
  changeovers?: ChangeoverRule[]
  cipRules?: CipRule[]
}

/** Session edits from Master Data. Lookups read this when a category has been changed. */
let overlay: CatalogOverlay = {}

export function setCatalogOverlay(next: CatalogOverlay) {
  overlay = next
}

export const getAsset = (id: string) => (overlay.assets ?? ASSETS).find((asset) => asset.id === id)

export const assetsOfType = (type: string) => (overlay.assets ?? ASSETS).filter((asset) => asset.type === type)

// ---------- Routes ----------

export interface Connection {
  id: string
  source: string
  destination: string
  via?: string
  maxFlow: ParamCell
  flowType: string
  condition: string
}

export const CONNECTIONS: Connection[] = parseCsv(assetConnectionsCsv).map((row) => ({
  id: row.connection_id,
  source: row.source_asset_id,
  destination: row.destination_asset_id,
  via: row.via_asset_id || undefined,
  maxFlow: parseParam(row.max_flow_lph),
  flowType: row.flow_type,
  condition: row.routing_condition
}))

export const findConnection = (source: string, destination: string) =>
  (overlay.connections ?? CONNECTIONS).find((c) => c.source === source && c.destination === destination)

// ---------- Filling line eligibility ----------

export interface LineDedication {
  lineId: string
  allowedSkuIds: string[]
  packSizeCodes: string[]
  sourceAsepticTankId: string
  speed: ParamCell
}

export interface LineProductCompatibility {
  lineId: string
  skuId: string
  packSizeCode: string
  eligible: boolean
}

export interface LineFinishedSkuCompatibility {
  lineId: string
  finishedSkuId: string
  liquidSkuId: string
  packSizeCode: string
  marketVariant: string
  eligible: boolean
}

export const LINE_DEDICATION: LineDedication[] = parseCsv(lineDedicationCsv).map((row) => ({
  lineId: row.line_id,
  allowedSkuIds: splitList(row.allowed_sku_ids),
  packSizeCodes: splitList(row.pack_size_codes),
  sourceAsepticTankId: row.source_aseptic_tank_id,
  speed: parseParam(row.speed_packph)
}))

export const LINE_PRODUCT_COMPATIBILITY: LineProductCompatibility[] = parseCsv(lineProductCompatibilityCsv).map(
  (row) => ({
    lineId: row.line_id,
    skuId: row.sku_id,
    packSizeCode: row.pack_size_code,
    eligible: row.eligible === 'Y'
  })
)

export const LINE_FINISHED_SKU_COMPATIBILITY: LineFinishedSkuCompatibility[] = parseCsv(
  lineFinishedSkuCompatibilityCsv
).map((row) => ({
  lineId: row.line_id,
  finishedSkuId: row.finished_sku_id,
  liquidSkuId: row.liquid_sku_id,
  packSizeCode: row.pack_size_code,
  marketVariant: row.market_variant,
  eligible: row.eligible === 'Y'
}))

// ---------- Rules ----------

export interface ConstraintRule {
  ruleId: string
  scope: string
  description: string
}

export interface ChangeoverRule {
  ruleId: 'VARIANT' | 'SIZE' | 'PAPER' | 'NONE'
  precedence: string
  condition: string
  activity: string
  duration: ParamCell
  note: string
}

export interface CipRule {
  ruleId: string
  trigger: string
  assetScope: string[]
  requirement: string
  duration: ParamCell
}

export const CONSTRAINTS: ConstraintRule[] = parseCsv(constraintCatalogCsv).map((row) => ({
  ruleId: row.rule_id,
  scope: row.scope,
  description: row.description
}))

export const CHANGEOVER_RULES: ChangeoverRule[] = parseCsv(changeoverRulesCsv).map((row) => ({
  ruleId: row.rule_id as ChangeoverRule['ruleId'],
  precedence: row.precedence,
  condition: row.condition,
  activity: row.activity,
  duration: parseParam(row.duration_minutes),
  note: row.additional_note
}))

export const CIP_RULES: CipRule[] = parseCsv(cipRulesCsv).map((row) => ({
  ruleId: row.rule_id,
  trigger: row.trigger,
  assetScope: splitList(row.asset_scope),
  requirement: row.requirement,
  duration: parseParam(row.duration_minutes)
}))

export const getConstraint = (ruleId: string) =>
  (overlay.constraints ?? CONSTRAINTS).find((rule) => rule.ruleId === ruleId)

export const getMarketVariant = (code: string) =>
  (overlay.markets ?? MARKET_VARIANTS).find((market) => market.code === code)

export const getChangeoverRule = (ruleId: string) =>
  (overlay.changeovers ?? CHANGEOVER_RULES).find((rule) => rule.ruleId === ruleId)

export const getCipRule = (ruleId: string) =>
  (overlay.cipRules ?? CIP_RULES).find((rule) => rule.ruleId === ruleId)

export const getLineDedication = (lineId: string) =>
  (overlay.lineDedication ?? LINE_DEDICATION).find((line) => line.lineId === lineId)

export const getLineProductCompatibility = () =>
  overlay.lineProducts ?? LINE_PRODUCT_COMPATIBILITY

export const getLineFinishedSkuCompatibility = () =>
  overlay.lineFinished ?? LINE_FINISHED_SKU_COMPATIBILITY

// ---------- Lookups ----------

export const getLiquidSku = (skuId: string) => (overlay.liquidSkus ?? LIQUID_SKUS).find((sku) => sku.skuId === skuId)
export const getFinishedSku = (finishedSkuId: string) =>
  (overlay.finishedSkus ?? FINISHED_SKUS).find((sku) => sku.finishedSkuId === finishedSkuId)
export const getPackSize = (code: string) => (overlay.packSizes ?? PACK_SIZES).find((pack) => pack.code === code)

export function describeFinishedSku(finishedSkuId: string) {
  const finished = getFinishedSku(finishedSkuId)
  const liquid = finished ? getLiquidSku(finished.liquidSkuId) : undefined
  const pack = finished ? getPackSize(finished.packSizeCode) : undefined
  return { finished, liquid, pack }
}

export const isLineEligible = (lineId: string, finishedSkuId: string) =>
  (overlay.lineFinished ?? LINE_FINISHED_SKU_COMPATIBILITY).some(
    (row) => row.lineId === lineId && row.finishedSkuId === finishedSkuId && row.eligible
  )

/** Aseptic tank and dedicated pipe feeding a filling line, from asset_connections */
export function lineSupply(lineId: string) {
  const connection = (overlay.connections ?? CONNECTIONS).find((c) => c.destination === lineId && c.flowType === 'aseptic_supply')
  return { asepticTankId: connection?.source, pipeId: connection?.via, connectionId: connection?.id }
}

export const linesFedBy = (asepticTankId: string) =>
  (overlay.lineDedication ?? LINE_DEDICATION).filter((line) => line.sourceAsepticTankId === asepticTankId).map((line) => line.lineId)
