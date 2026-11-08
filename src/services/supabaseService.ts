import { supabase } from '../utils/supabase'
import {
  ASSETS,
  CHANGEOVER_RULES,
  CIP_RULES,
  CONNECTIONS,
  CONSTRAINTS,
  FINISHED_SKUS,
  LINE_DEDICATION,
  LINE_FINISHED_SKU_COMPATIBILITY,
  LINE_PRODUCT_COMPATIBILITY,
  LIQUID_SKUS,
  MARKET_VARIANTS,
  PACK_SIZES,
  type Asset,
  type ChangeoverRule,
  type CipRule,
  type Connection,
  type ConstraintRule,
  type FinishedSku,
  type LineDedication,
  type LineFinishedSkuCompatibility,
  type LineProductCompatibility,
  type LiquidSku,
  type MarketVariant,
  type PackSize
} from '../data/reference'

export interface SupabaseHealth {
  connected: boolean
  tablesExist: boolean
  message: string
}

/** Check if Supabase connection and tables are ready */
export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  try {
    const { data: _data, error } = await supabase.from('products').select('sku_id').limit(1)
    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
        return {
          connected: true,
          tablesExist: false,
          message: 'Terhubung ke Supabase, namun tabel belum dibuat. Jalankan file docs/supabase-schema-migration.sql di Supabase SQL Editor.'
        }
      }
      return { connected: false, tablesExist: false, message: error.message }
    }
    return {
      connected: true,
      tablesExist: true,
      message: 'Supabase terhubung aktif dan tabel siap digunakan.'
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { connected: false, tablesExist: false, message: msg }
  }
}

// ============================================================================
// MASTER DATA FETCH & UPSERT
// ============================================================================

export async function fetchRemoteCatalog() {
  const [
    productsRes,
    finishedRes,
    packSizesRes,
    marketsRes,
    assetsRes,
    connectionsRes,
    lineDedRes,
    lineProdRes,
    lineFinRes,
    constraintsRes,
    changeoverRes,
    cipRes
  ] = await Promise.all([
    supabase.from('products').select('*'),
    supabase.from('finished_skus').select('*'),
    supabase.from('pack_sizes').select('*'),
    supabase.from('market_variants').select('*'),
    supabase.from('assets').select('*'),
    supabase.from('asset_connections').select('*'),
    supabase.from('line_dedications').select('*'),
    supabase.from('line_product_compatibility').select('*'),
    supabase.from('line_finished_compatibility').select('*'),
    supabase.from('constraint_catalog').select('*'),
    supabase.from('changeover_rules').select('*'),
    supabase.from('cip_rules').select('*')
  ])

  if (productsRes.error || !productsRes.data || productsRes.data.length === 0) {
    return null
  }

  const liquidSkus: LiquidSku[] = (productsRes.data || []).map((row) => ({
    skuId: row.sku_id,
    productName: row.product_name,
    family: row.product_family,
    flavour: row.flavour,
    packSizeCodes: row.allowed_pack_size_codes || [],
    marketVariants: row.market_variants || []
  }))

  const finishedSkus: FinishedSku[] = (finishedRes.data || []).map((row) => ({
    finishedSkuId: row.finished_sku_id,
    liquidSkuId: row.liquid_sku_id,
    packSizeCode: row.pack_size_code,
    marketVariant: row.market_variant
  }))

  const packSizes: PackSize[] = (packSizesRes.data || []).map((row) => ({
    code: row.pack_size_code,
    description: row.description || '',
    sizeMl: Number(row.exact_size_ml)
  }))

  const markets: MarketVariant[] = (marketsRes.data || []).map((row) => ({
    code: row.market_variant,
    name: row.market_name,
    applicableLiquidSkus: row.applicable_liquid_skus || 'ALL_ACTIVE_SKUS'
  }))

  const assets: Asset[] = (assetsRes.data || []).map((row) => ({
    id: row.asset_id,
    type: row.asset_type,
    name: row.asset_name,
    nodeRole: row.node_role,
    compatibleFamilies: row.compatible_product_family || [],
    params: {
      capacity_l: 'pending',
      input_flow_lph: 'pending',
      output_flow_lph: 'pending',
      process_speed_lph: 'pending',
      holding_time_limit_hours: 'pending',
      cip_duration_minutes: 'pending',
      speed_packph: 'pending'
    }
  }))

  const connections: Connection[] = (connectionsRes.data || []).map((row) => ({
    id: row.connection_id,
    source: row.source_asset_id,
    destination: row.destination_asset_id,
    via: row.via_asset_id || undefined,
    flowType: row.flow_type,
    maxFlow: 'pending',
    condition: row.routing_condition || ''
  }))

  const lineDedication: LineDedication[] = (lineDedRes.data || []).map((row) => ({
    lineId: row.line_id,
    allowedSkuIds: row.allowed_sku_ids || [],
    packSizeCodes: row.pack_size_codes || [],
    sourceAsepticTankId: row.source_aseptic_tank_id,
    speed: 'pending'
  }))

  const lineProducts: LineProductCompatibility[] = (lineProdRes.data || []).map((row) => ({
    lineId: row.line_id,
    skuId: row.sku_id,
    packSizeCode: row.pack_size_code,
    eligible: row.eligible
  }))

  const lineFinished: LineFinishedSkuCompatibility[] = (lineFinRes.data || []).map((row) => ({
    lineId: row.line_id,
    finishedSkuId: row.finished_sku_id,
    liquidSkuId: row.liquid_sku_id,
    packSizeCode: row.pack_size_code,
    marketVariant: row.market_variant,
    eligible: row.eligible
  }))

  const constraints: ConstraintRule[] = (constraintsRes.data || []).map((row) => ({
    ruleId: row.rule_id,
    scope: row.scope,
    description: row.description
  }))

  const changeovers: ChangeoverRule[] = (changeoverRes.data || []).map((row) => ({
    ruleId: row.rule_id as 'VARIANT' | 'SIZE' | 'PAPER' | 'NONE',
    precedence: row.precedence === 1 ? 'FIRST' : row.precedence === 2 ? 'SECOND' : row.precedence === 3 ? 'THIRD' : 'LAST',
    condition: row.condition,
    activity: row.activity,
    duration:
      row.duration_minutes != null
        ? Number(row.duration_minutes)
        : row.rule_id === 'VARIANT'
          ? 60
          : row.rule_id === 'SIZE'
            ? 40
            : row.rule_id === 'PAPER'
              ? 15
              : 0,
    note: row.additional_note || ''
  }))

  const cipRules: CipRule[] = (cipRes.data || []).map((row) => ({
    ruleId: row.rule_id,
    trigger: row.trigger,
    assetScope: (row.asset_scope || '').split(';'),
    requirement: row.requirement,
    duration: 'pending'
  }))

  return {
    liquidSkus,
    finishedSkus,
    packSizes,
    markets,
    assets,
    connections,
    lineDedication,
    lineProducts,
    lineFinished,
    constraints,
    changeovers,
    cipRules
  }
}

/** Sync a modified Master Data collection to Supabase */
export async function syncCollectionToSupabase(key: string, rows: unknown[]) {
  try {
    switch (key) {
      case 'liquidSkus': {
        const payload = (rows as LiquidSku[]).map((r) => {
          const isFlav = ['Chocolate', 'Strawberry'].includes(r.flavour)
          return {
            sku_id: r.skuId,
            product_name: r.productName,
            product_family: r.family,
            flavour: r.flavour,
            is_flavoured: isFlav,
            milk_ratio: isFlav ? 0.9 : 1.0,
            allowed_pack_size_codes: r.packSizeCodes,
            market_variants: r.marketVariants
          }
        })
        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'sku_id' })
        if (error) throw error
        break
      }
      case 'finishedSkus': {
        const payload = (rows as FinishedSku[]).map((r) => ({
          finished_sku_id: r.finishedSkuId,
          liquid_sku_id: r.liquidSkuId,
          pack_size_code: r.packSizeCode,
          market_variant: r.marketVariant
        }))
        const { error } = await supabase.from('finished_skus').upsert(payload, { onConflict: 'finished_sku_id' })
        if (error) throw error
        break
      }
      case 'packSizes': {
        const payload = (rows as PackSize[]).map((r) => ({
          pack_size_code: r.code,
          description: r.description,
          exact_size_ml: r.sizeMl
        }))
        const { error } = await supabase.from('pack_sizes').upsert(payload, { onConflict: 'pack_size_code' })
        if (error) throw error
        break
      }
      case 'markets': {
        const payload = (rows as MarketVariant[]).map((r) => ({
          market_variant: r.code,
          market_name: r.name,
          applicable_liquid_skus: r.applicableLiquidSkus
        }))
        const { error } = await supabase.from('market_variants').upsert(payload, { onConflict: 'market_variant' })
        if (error) throw error
        break
      }
      case 'assets': {
        const payload = (rows as Asset[]).map((r) => ({
          asset_id: r.id,
          asset_type: r.type,
          asset_name: r.name,
          node_role: r.nodeRole,
          compatible_product_family: r.compatibleFamilies
        }))
        const { error } = await supabase.from('assets').upsert(payload, { onConflict: 'asset_id' })
        if (error) throw error
        break
      }
      case 'connections': {
        const payload = (rows as Connection[]).map((r) => ({
          connection_id: r.id,
          source_asset_id: r.source,
          destination_asset_id: r.destination,
          via_asset_id: r.via || null,
          flow_type: r.flowType,
          routing_condition: r.condition
        }))
        const { error } = await supabase.from('asset_connections').upsert(payload, { onConflict: 'connection_id' })
        if (error) throw error
        break
      }
      case 'lineDedication': {
        const payload = (rows as LineDedication[]).map((r) => ({
          line_id: r.lineId,
          source_aseptic_tank_id: r.sourceAsepticTankId,
          allowed_sku_ids: r.allowedSkuIds,
          pack_size_codes: r.packSizeCodes
        }))
        const { error } = await supabase.from('line_dedications').upsert(payload, { onConflict: 'line_id' })
        if (error) throw error
        break
      }
      case 'lineProducts': {
        const payload = (rows as LineProductCompatibility[]).map((r) => ({
          line_id: r.lineId,
          sku_id: r.skuId,
          pack_size_code: r.packSizeCode,
          eligible: r.eligible
        }))
        const { error } = await supabase
          .from('line_product_compatibility')
          .upsert(payload, { onConflict: 'line_id,sku_id,pack_size_code' })
        if (error) throw error
        break
      }
      case 'lineFinished': {
        const payload = (rows as LineFinishedSkuCompatibility[]).map((r) => ({
          line_id: r.lineId,
          finished_sku_id: r.finishedSkuId,
          liquid_sku_id: r.liquidSkuId,
          pack_size_code: r.packSizeCode,
          market_variant: r.marketVariant,
          eligible: r.eligible
        }))
        const { error } = await supabase
          .from('line_finished_compatibility')
          .upsert(payload, { onConflict: 'line_id,finished_sku_id' })
        if (error) throw error
        break
      }
      case 'changeovers': {
        const payload = (rows as ChangeoverRule[]).map((r) => {
          const prec = r.precedence === 'FIRST' ? 1 : r.precedence === 'SECOND' ? 2 : r.precedence === 'THIRD' ? 3 : 4
          const durationVal =
            typeof r.duration === 'number'
              ? r.duration
              : r.ruleId === 'VARIANT'
                ? 60
                : r.ruleId === 'SIZE'
                  ? 40
                  : r.ruleId === 'PAPER'
                    ? 15
                    : 0
          return {
            rule_id: r.ruleId,
            precedence: prec,
            condition: r.condition,
            activity: r.activity,
            duration_minutes: durationVal,
            additional_note: r.note
          }
        })
        const { error } = await supabase.from('changeover_rules').upsert(payload, { onConflict: 'rule_id' })
        if (error) throw error
        break
      }
      case 'cipRules': {
        const payload = (rows as CipRule[]).map((r) => ({
          rule_id: r.ruleId,
          trigger: r.trigger,
          asset_scope: Array.isArray(r.assetScope) ? r.assetScope.join(';') : r.assetScope,
          requirement: r.requirement
        }))
        const { error } = await supabase.from('cip_rules').upsert(payload, { onConflict: 'rule_id' })
        if (error) throw error
        break
      }
      case 'constraints': {
        const payload = (rows as ConstraintRule[]).map((r) => ({
          rule_id: r.ruleId,
          scope: r.scope,
          description: r.description
        }))
        const { error } = await supabase.from('constraint_catalog').upsert(payload, { onConflict: 'rule_id' })
        if (error) throw error
        break
      }
    }
    return { success: true }
  } catch (err: unknown) {
    console.warn(`Supabase sync failed for ${key}:`, err)
    return { success: false, error: err }
  }
}

/** 1-Click Action to Seed Initial Data into Supabase from local CSVs */
export async function seedAllMasterDataToSupabase() {
  const steps = [
    { key: 'packSizes', data: PACK_SIZES },
    { key: 'markets', data: MARKET_VARIANTS },
    { key: 'liquidSkus', data: LIQUID_SKUS },
    { key: 'finishedSkus', data: FINISHED_SKUS },
    { key: 'assets', data: ASSETS },
    { key: 'connections', data: CONNECTIONS },
    { key: 'lineDedication', data: LINE_DEDICATION },
    { key: 'lineProducts', data: LINE_PRODUCT_COMPATIBILITY },
    { key: 'lineFinished', data: LINE_FINISHED_SKU_COMPATIBILITY },
    { key: 'changeovers', data: CHANGEOVER_RULES },
    { key: 'cipRules', data: CIP_RULES },
    { key: 'constraints', data: CONSTRAINTS }
  ]

  for (const step of steps) {
    const res = await syncCollectionToSupabase(step.key, step.data)
    if (!res.success) {
      throw new Error(`Failed to seed ${step.key}`)
    }
  }
  return { success: true }
}

// ============================================================================
// OPERATIONAL DATA (PRODUCTION ORDERS & TANKERS) CRUD
// ============================================================================

export interface RemoteProductionOrder {
  order_id: string
  finished_sku_id: string
  volume_target_l: number
  pack_count_target?: number
  deadline: string
  priority: number
  status: 'pending' | 'scheduled' | 'in_progress' | 'done' | 'cancelled'
  created_at?: string
}

export async function fetchProductionOrders(): Promise<RemoteProductionOrder[]> {
  const { data, error } = await supabase
    .from('production_orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('Failed to fetch production orders from Supabase:', error.message)
    return []
  }
  return data || []
}

export async function createProductionOrder(order: RemoteProductionOrder) {
  const { data, error } = await supabase.from('production_orders').insert([order]).select()
  if (error) throw error
  return data?.[0]
}

export async function updateProductionOrder(orderId: string, patch: Partial<RemoteProductionOrder>) {
  const { data, error } = await supabase.from('production_orders').update(patch).eq('order_id', orderId).select()
  if (error) throw error
  return data?.[0]
}

export async function deleteProductionOrder(orderId: string) {
  const { error } = await supabase.from('production_orders').delete().eq('order_id', orderId)
  if (error) throw error
  return true
}

export interface RemoteTankerDelivery {
  tanker_id: string
  farm_id: string
  plate_number?: string
  volume_l: number
  truck_capacity?: number
  departure_time: string
  eta: string
  actual_arrival?: string | null
  bay_id?: string | null
  status: string
}

export async function fetchTankerDeliveries(): Promise<RemoteTankerDelivery[]> {
  const { data, error } = await supabase
    .from('tanker_deliveries')
    .select('*')
    .order('eta', { ascending: true })
  if (error) {
    console.warn('Failed to fetch tanker deliveries from Supabase:', error.message)
    return []
  }
  return data || []
}

export async function createTankerDelivery(delivery: RemoteTankerDelivery) {
  const { data, error } = await supabase.from('tanker_deliveries').insert([delivery]).select()
  if (error) throw error
  return data?.[0]
}

export async function updateTankerDelivery(tankerId: string, patch: Partial<RemoteTankerDelivery>) {
  const { data, error } = await supabase.from('tanker_deliveries').update(patch).eq('tanker_id', tankerId).select()
  if (error) throw error
  return data?.[0]
}
