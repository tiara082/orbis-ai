import { ASSET_PARAMS, type Asset, type ChangeoverRule, type CipRule, type Connection, type ConstraintRule, type FinishedSku, type LineDedication, type LineFinishedSkuCompatibility, type LineProductCompatibility, type LiquidSku, type MarketVariant, type PackSize } from '../../../data/reference'
import { parseParam, type ParamCell } from '../../../data/reference/csv'
import type { ImportField, RowError } from './RecordActions'

type Translate = (key: string) => string

const list = (raw: string) =>
  raw
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)

function text(record: Record<string, string>, header: string, required = false): string | RowError {
  const value = record[header]?.trim() ?? ''
  if (required && !value) return { error: 'required', field: header }
  return value
}

function number(record: Record<string, string>, header: string): number | RowError {
  const value = record[header]?.trim() ?? ''
  if (!value) return { error: 'required', field: header }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : { error: 'number', field: header }
}

function paramCell(record: Record<string, string>, header: string): ParamCell {
  return parseParam(record[header] ?? '')
}

function failed<T>(value: T | RowError): value is RowError {
  return typeof value === 'object' && value !== null && 'error' in value
}

const yesNo = (t: Translate): ImportField['options'] => [
  { value: 'Y', label: t('master.edit.yes') },
  { value: 'N', label: t('master.edit.no') }
]

function eligible(record: Record<string, string>): boolean | RowError {
  const value = (record.eligible ?? '').trim().toLowerCase()
  if (['y', 'yes', 'true', '1'].includes(value)) return true
  if (['n', 'no', 'false', '0'].includes(value)) return false
  return { error: 'required', field: 'eligible' }
}

export const liquidFields = (t: Translate): ImportField[] => [
  { header: 'sku_id', label: t('col.sku'), required: true },
  { header: 'product_name', label: t('col.product'), required: true },
  { header: 'product_family', label: t('col.family'), required: true, placeholder: 'ESL' },
  { header: 'flavour', label: t('col.flavour'), required: true },
  { header: 'allowed_pack_size_codes', label: t('col.packSizes'), placeholder: 'LARGE_A;LARGE_B', required: true },
  { header: 'market_variants', label: t('col.markets'), placeholder: 'LOCAL;EXP', required: true }
]

export function parseLiquid(record: Record<string, string>): LiquidSku | RowError {
  const skuId = text(record, 'sku_id', true)
  const productName = text(record, 'product_name', true)
  const family = text(record, 'product_family', true)
  const flavour = text(record, 'flavour', true)
  if (failed(skuId)) return skuId
  if (failed(productName)) return productName
  if (failed(family)) return family
  if (failed(flavour)) return flavour
  return {
    skuId,
    productName,
    family,
    flavour,
    packSizeCodes: list(record.allowed_pack_size_codes ?? ''),
    marketVariants: list(record.market_variants ?? '')
  }
}

export const finishedFields = (t: Translate): ImportField[] => [
  { header: 'finished_sku_id', label: t('col.finishedSku'), required: true },
  { header: 'liquid_sku_id', label: t('col.sku'), required: true },
  { header: 'pack_size_code', label: t('col.packSize'), required: true },
  { header: 'market_variant', label: t('col.market'), required: true }
]

export function parseFinished(record: Record<string, string>): FinishedSku | RowError {
  const finishedSkuId = text(record, 'finished_sku_id', true)
  const liquidSkuId = text(record, 'liquid_sku_id', true)
  const packSizeCode = text(record, 'pack_size_code', true)
  const marketVariant = text(record, 'market_variant', true)
  if (failed(finishedSkuId)) return finishedSkuId
  if (failed(liquidSkuId)) return liquidSkuId
  if (failed(packSizeCode)) return packSizeCode
  if (failed(marketVariant)) return marketVariant
  return { finishedSkuId, liquidSkuId, packSizeCode, marketVariant }
}

export const packFields = (t: Translate): ImportField[] => [
  { header: 'pack_size_code', label: t('col.packSize'), required: true },
  { header: 'description', label: t('col.description'), required: true },
  { header: 'exact_size_ml', label: t('col.sizeMl'), kind: 'number', required: true }
]

export function parsePack(record: Record<string, string>): PackSize | RowError {
  const code = text(record, 'pack_size_code', true)
  const description = text(record, 'description', true)
  const sizeMl = number(record, 'exact_size_ml')
  if (failed(code)) return code
  if (failed(description)) return description
  if (failed(sizeMl)) return sizeMl
  return { code, description, sizeMl }
}

export const marketFields = (t: Translate): ImportField[] => [
  { header: 'market_variant', label: t('col.market'), required: true },
  { header: 'market_name', label: t('col.description'), required: true },
  { header: 'applicable_liquid_skus', label: t('col.appliesTo'), required: true, placeholder: 'ALL_ACTIVE_SKUS' }
]

export function parseMarket(record: Record<string, string>): MarketVariant | RowError {
  const code = text(record, 'market_variant', true)
  const name = text(record, 'market_name', true)
  const applicableLiquidSkus = text(record, 'applicable_liquid_skus', true)
  if (failed(code)) return code
  if (failed(name)) return name
  if (failed(applicableLiquidSkus)) return applicableLiquidSkus
  return { code, name, applicableLiquidSkus }
}

const ROLES = ['process_asset', 'physical_pipe', 'logical_junction', 'material_source', 'delivery_source', 'finished_goods_sink']

export const assetFields = (t: Translate): ImportField[] => [
  { header: 'asset_id', label: t('col.asset'), required: true },
  { header: 'asset_name', label: t('col.name'), required: true },
  { header: 'asset_type', label: t('col.type'), required: true, placeholder: 'SFP Storage Tank' },
  {
    header: 'node_role',
    label: t('col.role'),
    required: true,
    kind: 'select',
    options: ROLES.map((role) => ({ value: role, label: t(`master.assets.role.${role}`) }))
  },
  { header: 'compatible_product_family', label: t('col.family'), placeholder: 'ESL;UHT' },
  ...ASSET_PARAMS.map((param) => ({ header: param, label: t(`col.param.${param}`), placeholder: 'X' }))
]

export function parseAsset(record: Record<string, string>): Asset | RowError {
  const id = text(record, 'asset_id', true)
  const name = text(record, 'asset_name', true)
  const type = text(record, 'asset_type', true)
  const nodeRole = text(record, 'node_role', true)
  if (failed(id)) return id
  if (failed(name)) return name
  if (failed(type)) return type
  if (failed(nodeRole)) return nodeRole
  return {
    id,
    name,
    type,
    nodeRole,
    compatibleFamilies: list(record.compatible_product_family ?? ''),
    params: Object.fromEntries(ASSET_PARAMS.map((name) => [name, paramCell(record, name)])) as Asset['params']
  }
}

const FLOWS = ['main_milk', 'sterilized_product', 'aseptic_supply', 'cream', 'mixed_product', 'premix', 'to_sterilization', 'finished_goods']

export const connectionFields = (t: Translate): ImportField[] => [
  { header: 'connection_id', label: t('col.connection'), required: true },
  { header: 'source_asset_id', label: t('col.from'), required: true },
  { header: 'destination_asset_id', label: t('col.to'), required: true },
  { header: 'via_asset_id', label: t('col.via') },
  { header: 'max_flow_lph', label: t('col.maxFlow'), placeholder: 'X' },
  {
    header: 'flow_type',
    label: t('col.flowType'),
    required: true,
    kind: 'select',
    options: FLOWS.map((flow) => ({ value: flow, label: t(`master.routes.flow.${flow}`) }))
  },
  { header: 'routing_condition', label: t('col.condition'), required: true }
]

export function parseConnection(record: Record<string, string>): Connection | RowError {
  const id = text(record, 'connection_id', true)
  const source = text(record, 'source_asset_id', true)
  const destination = text(record, 'destination_asset_id', true)
  const flowType = text(record, 'flow_type', true)
  const condition = text(record, 'routing_condition', true)
  const via = text(record, 'via_asset_id')
  if (failed(id)) return id
  if (failed(source)) return source
  if (failed(destination)) return destination
  if (failed(flowType)) return flowType
  if (failed(condition)) return condition
  if (failed(via)) return via
  return { id, source, destination, via: via || undefined, maxFlow: paramCell(record, 'max_flow_lph'), flowType, condition }
}

export const dedicationFields = (t: Translate): ImportField[] => [
  { header: 'line_id', label: t('col.line'), required: true },
  { header: 'allowed_sku_ids', label: t('col.allowedSkus'), required: true, placeholder: 'ESL-FC;ESL-CH' },
  { header: 'pack_size_codes', label: t('col.packSizes'), required: true, placeholder: 'LARGE_A;LARGE_B' },
  { header: 'source_aseptic_tank_id', label: t('col.asepticTank'), required: true },
  { header: 'speed_packph', label: t('col.speedPackph'), placeholder: 'X' }
]

export function parseDedication(record: Record<string, string>): LineDedication | RowError {
  const lineId = text(record, 'line_id', true)
  const sourceAsepticTankId = text(record, 'source_aseptic_tank_id', true)
  if (failed(lineId)) return lineId
  if (failed(sourceAsepticTankId)) return sourceAsepticTankId
  return {
    lineId,
    allowedSkuIds: list(record.allowed_sku_ids ?? ''),
    packSizeCodes: list(record.pack_size_codes ?? ''),
    sourceAsepticTankId,
    speed: paramCell(record, 'speed_packph')
  }
}

export const lineProductFields = (t: Translate): ImportField[] => [
  { header: 'line_id', label: t('col.line'), required: true },
  { header: 'sku_id', label: t('col.sku'), required: true },
  { header: 'pack_size_code', label: t('col.packSize'), required: true },
  { header: 'eligible', label: t('col.eligible'), required: true, kind: 'select', options: yesNo(t) }
]

export function parseLineProduct(record: Record<string, string>): LineProductCompatibility | RowError {
  const lineId = text(record, 'line_id', true)
  const skuId = text(record, 'sku_id', true)
  const packSizeCode = text(record, 'pack_size_code', true)
  const ok = eligible(record)
  if (failed(lineId)) return lineId
  if (failed(skuId)) return skuId
  if (failed(packSizeCode)) return packSizeCode
  if (failed(ok)) return ok
  return { lineId, skuId, packSizeCode, eligible: ok }
}

export const lineFinishedFields = (t: Translate): ImportField[] => [
  { header: 'line_id', label: t('col.line'), required: true },
  { header: 'finished_sku_id', label: t('col.finishedSku'), required: true },
  { header: 'liquid_sku_id', label: t('col.sku'), required: true },
  { header: 'pack_size_code', label: t('col.packSize'), required: true },
  { header: 'market_variant', label: t('col.market'), required: true },
  { header: 'eligible', label: t('col.eligible'), required: true, kind: 'select', options: yesNo(t) }
]

export function parseLineFinished(record: Record<string, string>): LineFinishedSkuCompatibility | RowError {
  const lineId = text(record, 'line_id', true)
  const finishedSkuId = text(record, 'finished_sku_id', true)
  const liquidSkuId = text(record, 'liquid_sku_id', true)
  const packSizeCode = text(record, 'pack_size_code', true)
  const marketVariant = text(record, 'market_variant', true)
  const ok = eligible(record)
  if (failed(lineId)) return lineId
  if (failed(finishedSkuId)) return finishedSkuId
  if (failed(liquidSkuId)) return liquidSkuId
  if (failed(packSizeCode)) return packSizeCode
  if (failed(marketVariant)) return marketVariant
  if (failed(ok)) return ok
  return { lineId, finishedSkuId, liquidSkuId, packSizeCode, marketVariant, eligible: ok }
}

export const constraintFields = (t: Translate): ImportField[] => [
  { header: 'rule_id', label: t('col.rule'), required: true },
  { header: 'scope', label: t('col.scope'), required: true },
  { header: 'description', label: t('col.description'), required: true }
]

export function parseConstraint(record: Record<string, string>): ConstraintRule | RowError {
  const ruleId = text(record, 'rule_id', true)
  const scope = text(record, 'scope', true)
  const description = text(record, 'description', true)
  if (failed(ruleId)) return ruleId
  if (failed(scope)) return scope
  if (failed(description)) return description
  return { ruleId, scope, description }
}

const CHANGEOVER_IDS = ['VARIANT', 'SIZE', 'PAPER', 'NONE'] as const

export const changeoverFields = (t: Translate): ImportField[] => [
  {
    header: 'rule_id',
    label: t('col.rule'),
    required: true,
    kind: 'select',
    options: CHANGEOVER_IDS.map((id) => ({ value: id, label: id }))
  },
  { header: 'precedence', label: t('col.precedence'), required: true },
  { header: 'condition', label: t('col.condition'), required: true },
  { header: 'activity', label: t('col.activity'), required: true },
  { header: 'duration_minutes', label: t('col.duration'), placeholder: 'X' },
  { header: 'additional_note', label: t('col.note') }
]

export function parseChangeover(record: Record<string, string>): ChangeoverRule | RowError {
  const ruleId = text(record, 'rule_id', true)
  const precedence = text(record, 'precedence', true)
  const condition = text(record, 'condition', true)
  const activity = text(record, 'activity', true)
  const note = text(record, 'additional_note')
  if (failed(ruleId)) return ruleId
  if (!CHANGEOVER_IDS.includes(ruleId as ChangeoverRule['ruleId'])) return { error: 'required', field: 'rule_id' }
  if (failed(precedence)) return precedence
  if (failed(condition)) return condition
  if (failed(activity)) return activity
  if (failed(note)) return note
  return { ruleId: ruleId as ChangeoverRule['ruleId'], precedence, condition, activity, duration: paramCell(record, 'duration_minutes'), note }
}

export const cipFields = (t: Translate): ImportField[] => [
  { header: 'rule_id', label: t('col.rule'), required: true },
  { header: 'trigger', label: t('col.trigger'), required: true },
  { header: 'asset_scope', label: t('col.scope'), required: true },
  { header: 'requirement', label: t('col.requirement'), required: true },
  { header: 'duration_minutes', label: t('col.duration'), placeholder: 'X' }
]

export function parseCip(record: Record<string, string>): CipRule | RowError {
  const ruleId = text(record, 'rule_id', true)
  const trigger = text(record, 'trigger', true)
  const requirement = text(record, 'requirement', true)
  if (failed(ruleId)) return ruleId
  if (failed(trigger)) return trigger
  if (failed(requirement)) return requirement
  return { ruleId, trigger, assetScope: list(record.asset_scope ?? ''), requirement, duration: paramCell(record, 'duration_minutes') }
}
