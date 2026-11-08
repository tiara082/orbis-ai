import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..')
const refDir = path.join(rootDir, 'src', 'data', 'reference')
const docsDir = path.join(rootDir, 'docs')

function parseCsv(content) {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim().length > 0)
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map(h => h.trim())
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i]
    const cols = []
    let current = ''
    let inQuotes = false
    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        cols.push(current)
        current = ''
      } else {
        current += char
      }
    }
    cols.push(current)
    const obj = {}
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? '').trim()
    })
    rows.push(obj)
  }
  return rows
}

function escapeSql(val) {
  if (val === null || val === undefined || val === '' || val === 'X' || val === 'N/A') return 'NULL'
  return `'${String(val).replace(/'/g, "''")}'`
}

function sqlArray(listStr) {
  if (!listStr || listStr.trim() === '' || listStr === 'X' || listStr === 'N/A') return "'{}'::text[]"
  const items = listStr.split(/[;,]/).map(s => s.trim()).filter(Boolean)
  if (items.length === 0) return "'{}'::text[]"
  return `ARRAY[${items.map(i => `'${i.replace(/'/g, "''")}'`).join(', ')}]::text[]`
}

// 1. Generate Schema
const schemaSql = `-- =============================================================================
-- ORBIS AI - Supabase Production Database Schema
-- Greenfields Better Planning & Milk Volume Traceability
--
-- Target  : PostgreSQL 15+ / Supabase
-- Tables  : All 13 Master Reference Datasets + 5 Operational & Traceability Layers
-- Security: Row Level Security (RLS) enabled with public demo policies
-- =============================================================================

-- Extension for cryptographic hashes (Audit trail hash chain)
create extension if not exists "pgcrypto";

-- Clean existing schema if re-running
drop table if exists audit_events cascade;
drop table if exists volume_balance_periods cascade;
drop table if exists ai_recommendations cascade;
drop table if exists production_events cascade;
drop table if exists finished_goods_batches cascade;
drop table if exists production_schedule_runs cascade;
drop table if exists cip_events cascade;
drop table if exists lab_tests cascade;
drop table if exists batch_genealogy cascade;
drop table if exists batch_transfers cascade;
drop table if exists tank_current_states cascade;
drop table if exists batches cascade;
drop table if exists production_orders cascade;
drop table if exists asset_availability_windows cascade;
drop table if exists tanker_deliveries cascade;
drop table if exists farms cascade;
drop table if exists cip_durations cascade;
drop table if exists changeover_durations cascade;
drop table if exists asset_parameters cascade;
drop table if exists constraint_catalog cascade;
drop table if exists cip_rules cascade;
drop table if exists changeover_rules cascade;
drop table if exists line_finished_compatibility cascade;
drop table if exists line_product_compatibility cascade;
drop table if exists line_dedications cascade;
drop table if exists finished_skus cascade;
drop table if exists products cascade;
drop table if exists market_variants cascade;
drop table if exists pack_sizes cascade;
drop table if exists asset_units cascade;
drop table if exists asset_connections cascade;
drop table if exists assets cascade;

-- =============================================================================
-- LAYER 1 - MASTER DATA (from 13 Reference CSVs)
-- =============================================================================

-- 1. Asset Units (from asset_units.csv)
create table asset_units (
  field       text primary key,
  applies_to  text not null,
  unit        text not null,
  definition  text not null
);

-- 2. Assets (from asset_configuration.csv)
create table assets (
  asset_id                  text primary key,
  asset_type                text not null,
  asset_name                text not null,
  node_role                 text not null check (node_role in (
                              'process_asset', 'physical_pipe', 'logical_junction',
                              'material_source', 'delivery_source', 'finished_goods_sink')),
  compatible_product_family text[] not null default '{}',
  is_tank                   boolean not null default false
);

-- 3. Asset Connections / Perpipaan (from asset_connections.csv)
create table asset_connections (
  connection_id        text primary key,
  source_asset_id      text not null references assets(asset_id) on delete cascade,
  destination_asset_id text not null references assets(asset_id) on delete cascade,
  via_asset_id         text references assets(asset_id) on delete set null,
  flow_type            text not null check (flow_type in (
                         'main_milk', 'cream', 'premix', 'mixed_product',
                         'to_sterilization', 'sterilized_product', 'aseptic_supply', 'finished_goods')),
  max_flow_lph         numeric(12,2),
  routing_condition    text
);
create index asset_connections_src_idx on asset_connections (source_asset_id);
create index asset_connections_dst_idx on asset_connections (destination_asset_id);

-- 4. Pack Sizes (from pack_size_codes.csv)
create table pack_sizes (
  pack_size_code text primary key,
  description    text,
  exact_size_ml  integer not null check (exact_size_ml > 0)
);

-- 5. Market Variants (from market_variants.csv)
create table market_variants (
  market_variant         text primary key,
  market_name            text not null,
  applicable_liquid_skus text default 'ALL_ACTIVE_SKUS'
);

-- 6. Products / Liquid SKU (from product_catalog.csv)
create table products (
  sku_id                  text primary key,
  product_name            text not null,
  product_family          text not null check (product_family in ('UHT', 'ESL', 'UHT Skim')),
  flavour                 text not null,
  is_flavoured            boolean not null default false,
  milk_ratio              numeric(4,3) not null default 1.000 check (milk_ratio > 0 and milk_ratio <= 1),
  allowed_pack_size_codes text[] not null default '{}',
  market_variants         text[] not null default '{}'
);

-- 7. Finished SKUs (from finished_sku_catalog.csv)
create table finished_skus (
  finished_sku_id text primary key,
  liquid_sku_id   text not null references products(sku_id) on delete cascade,
  pack_size_code  text not null references pack_sizes(pack_size_code) on delete cascade,
  market_variant  text not null references market_variants(market_variant) on delete cascade,
  unique (liquid_sku_id, pack_size_code, market_variant)
);
create index finished_skus_liquid_idx on finished_skus (liquid_sku_id);

-- 8. Line Dedications (from line_dedication.csv)
-- Relasi fisik: 1 Tangki Aseptik (AT) menyuplai 2 Filling Line (FL)
create table line_dedications (
  line_id                text primary key references assets(asset_id) on delete cascade,
  source_aseptic_tank_id text not null references assets(asset_id) on delete cascade,
  allowed_sku_ids        text[] not null default '{}',
  pack_size_codes        text[] not null default '{}',
  speed_packph           numeric(12,2)
);

-- 9. Line Product Compatibility (from line_product_compatibility.csv)
create table line_product_compatibility (
  line_id        text not null references assets(asset_id) on delete cascade,
  sku_id         text not null references products(sku_id) on delete cascade,
  pack_size_code text not null references pack_sizes(pack_size_code) on delete cascade,
  eligible       boolean not null default true,
  primary key (line_id, sku_id, pack_size_code)
);

-- 10. Line Finished SKU Compatibility (from line_finished_sku_compatibility.csv)
create table line_finished_compatibility (
  line_id         text not null references assets(asset_id) on delete cascade,
  finished_sku_id text not null references finished_skus(finished_sku_id) on delete cascade,
  liquid_sku_id   text not null references products(sku_id) on delete cascade,
  pack_size_code  text not null references pack_sizes(pack_size_code) on delete cascade,
  market_variant  text not null references market_variants(market_variant) on delete cascade,
  eligible        boolean not null default true,
  primary key (line_id, finished_sku_id)
);

-- 11. Changeover Rules (from changeover_rules.csv)
create table changeover_rules (
  rule_id          text primary key,
  precedence       smallint not null unique,
  condition        text not null,
  activity         text not null,
  duration_minutes integer,
  additional_note  text
);

-- 12. CIP Rules (from cip_rules.csv)
create table cip_rules (
  rule_id          text primary key,
  trigger          text not null,
  asset_scope      text not null,
  requirement      text not null,
  duration_minutes integer
);

-- 13. Constraint Catalog (from constraint_catalog.csv)
create table constraint_catalog (
  rule_id     text primary key,
  scope       text not null,
  description text not null
);

-- =============================================================================
-- LAYER 2 - NUMERIC PARAMETERS (Scenario & Simulation Tuning)
-- =============================================================================

create table asset_parameters (
  id                     bigint generated always as identity primary key,
  asset_id               text not null references assets(asset_id) on delete cascade,
  capacity_l             numeric(12,2) check (capacity_l >= 0),
  min_operating_level_l  numeric(12,2) check (min_operating_level_l >= 0),
  input_flow_lph         numeric(12,2) check (input_flow_lph >= 0),
  output_flow_lph        numeric(12,2) check (output_flow_lph >= 0),
  process_speed_lph      numeric(12,2) check (process_speed_lph >= 0),
  speed_packph           numeric(12,2) check (speed_packph >= 0),
  holding_time_hours     numeric(6,2)  check (holding_time_hours >= 0),
  cip_duration_min       integer       check (cip_duration_min >= 0),
  utilization_target_pct numeric(5,2)  check (utilization_target_pct between 0 and 100),
  effective_at           timestamptz not null default now(),
  unique (asset_id, effective_at)
);

create table changeover_durations (
  id           bigint generated always as identity primary key,
  rule_id      text not null references changeover_rules(rule_id) on delete cascade,
  line_id      text references assets(asset_id) on delete cascade,
  duration_min integer not null check (duration_min >= 0),
  notes        text,
  effective_at timestamptz not null default now()
);

create table cip_durations (
  id           bigint generated always as identity primary key,
  rule_id      text not null references cip_rules(rule_id) on delete cascade,
  asset_id     text references assets(asset_id) on delete cascade,
  duration_min integer not null check (duration_min >= 0),
  effective_at timestamptz not null default now()
);

-- =============================================================================
-- LAYER 3 - OPERATIONAL & TRANSACTIONAL (Daily Incoming, Orders, Batches)
-- =============================================================================

create table farms (
  farm_id   text primary key,
  farm_name text not null,
  location  text,
  active    boolean not null default true
);

create table tanker_deliveries (
  tanker_id      text primary key,
  farm_id        text not null references farms(farm_id),
  plate_number   text,
  volume_l       numeric(12,2) not null check (volume_l > 0),
  truck_capacity numeric(12,2) default 15000,
  departure_time timestamptz not null,
  eta            timestamptz not null,
  actual_arrival timestamptz,
  bay_id         text references assets(asset_id),
  unload_start   timestamptz,
  unload_end     timestamptz,
  status         text not null default 'on_the_way' check (status in (
                   'on_the_way', 'arrived', 'sampling', 'lab_test', 'released',
                   'unloading', 'stored', 'rejected', 'delayed'))
);

create table lab_tests (
  test_id           bigint generated always as identity primary key,
  tanker_id         text not null references tanker_deliveries(tanker_id) on delete cascade,
  sample_taken_at   timestamptz not null default now(),
  test_completed_at timestamptz,
  result            text not null default 'pending' check (result in ('pending', 'pass', 'fail')),
  parameters        jsonb default '{}'::jsonb,
  release_status    text not null default 'pending' check (release_status in ('pending', 'released', 'rejected', 'on_hold')),
  analyst_id        text,
  blockchain_hash   text
);

create table production_orders (
  order_id          text primary key,
  finished_sku_id   text not null references finished_skus(finished_sku_id) on delete cascade,
  volume_target_l   numeric(12,2) not null check (volume_target_l > 0),
  pack_count_target integer check (pack_count_target > 0),
  deadline          timestamptz not null,
  priority          smallint not null default 2 check (priority between 1 and 3),
  status            text not null default 'pending' check (status in (
                      'pending', 'scheduled', 'in_progress', 'done', 'cancelled')),
  created_at        timestamptz not null default now()
);

create table batches (
  batch_id        text primary key,
  asset_id        text not null references assets(asset_id),
  sku_id          text references products(sku_id),
  material_state  text not null check (material_state in (
                    'raw', 'thermized', 'standardized', 'cream', 'premix', 'mixed', 'sterilized')),
  tanker_id       text references tanker_deliveries(tanker_id),
  production_date date not null default current_date,
  volume_l        numeric(12,2) not null check (volume_l >= 0),
  started_at      timestamptz not null default now(),
  status          text not null default 'active' check (status in (
                    'active', 'consumed', 'expired', 'on_hold', 'released', 'rejected')),
  created_at      timestamptz not null default now(),
  blockchain_hash text
);

create table tank_current_states (
  id                  bigint generated always as identity primary key,
  asset_id            text not null references assets(asset_id) on delete cascade,
  current_volume_l    numeric(12,2) not null check (current_volume_l >= 0),
  sku_id              text references products(sku_id),
  material_state      text check (material_state in (
                        'raw', 'thermized', 'standardized', 'cream', 'premix', 'mixed', 'sterilized')),
  batch_id            text references batches(batch_id),
  material_entry_time timestamptz,
  last_cip_completed  timestamptz,
  status              text not null check (status in (
                        'available', 'in_use', 'cip_required', 'in_cip', 'maintenance')),
  recorded_at         timestamptz not null default now()
);

create table batch_transfers (
  transfer_id          bigint generated always as identity primary key,
  source_batch_id      text not null references batches(batch_id) on delete cascade,
  dest_batch_id        text not null references batches(batch_id) on delete cascade,
  via_connection_id    text references asset_connections(connection_id),
  volume_transferred_l numeric(12,2) not null check (volume_transferred_l > 0),
  transfer_start       timestamptz not null,
  transfer_end         timestamptz,
  event_type           text not null check (event_type in (
                         'unloading', 'transfer', 'processing', 'separation',
                         'mixing', 'splitting', 'sterilization', 'filling')),
  operator_id          text,
  notes                text,
  blockchain_hash      text
);

create table batch_genealogy (
  child_batch_id        text not null references batches(batch_id) on delete cascade,
  parent_batch_id       text not null references batches(batch_id) on delete cascade,
  volume_contribution_l numeric(12,2) not null check (volume_contribution_l > 0),
  contribution_pct      numeric(5,2) check (contribution_pct between 0 and 100),
  relation_type         text not null check (relation_type in ('transfer', 'mixing', 'splitting', 'co_product')),
  primary key (child_batch_id, parent_batch_id)
);

-- =============================================================================
-- LAYER 4 - FINISHED GOODS & PLANNING
-- =============================================================================

create table production_schedule_runs (
  run_id                    bigint generated always as identity primary key,
  production_order_id       text not null references production_orders(order_id) on delete cascade,
  filling_line_id           text references assets(asset_id),
  asset_sequence            jsonb not null default '[]'::jsonb,
  scheduled_start           timestamptz not null,
  scheduled_end             timestamptz not null,
  changeover_min            integer not null default 0,
  cip_min                   integer not null default 0,
  ai_recommended            boolean not null default false,
  estimated_output_l        numeric(12,2),
  estimated_utilization_pct numeric(5,2),
  status                    text not null default 'draft' check (status in (
                              'draft', 'approved', 'rejected', 'running', 'done', 'superseded')),
  approved_by               text,
  approved_at               timestamptz,
  rejection_reason          text
);

create table finished_goods_batches (
  fg_batch_id         text primary key,
  liquid_batch_id     text not null references batches(batch_id) on delete cascade,
  finished_sku_id     text not null references finished_skus(finished_sku_id) on delete cascade,
  filling_line_id     text not null references assets(asset_id),
  production_order_id text references production_orders(order_id) on delete set null,
  schedule_run_id     bigint references production_schedule_runs(run_id) on delete set null,
  volume_filled_l     numeric(12,2) not null check (volume_filled_l >= 0),
  good_packs          integer not null default 0,
  reject_packs        integer not null default 0,
  production_start    timestamptz not null,
  production_end      timestamptz,
  status              text not null default 'released' check (status in ('released', 'on_hold', 'recalled')),
  blockchain_hash     text
);

-- =============================================================================
-- LAYER 5 - VOLUME BALANCE & AUDIT TRAIL
-- =============================================================================

-- Neraca Volume Harian 06:00 -> 06:00 berikutnya (Slide 14)
-- Stok awal + Milk In = Output + Leftover Akhir (+ Co-product + Loss)
create table volume_balance_periods (
  period_id       bigint generated always as identity primary key,
  period_start    timestamptz not null unique,
  period_end      timestamptz not null,
  opening_stock_l numeric(14,2) not null,
  milk_in_l       numeric(14,2) not null,
  premix_in_l     numeric(14,2) not null default 0,
  output_l        numeric(14,2) not null,
  closing_stock_l numeric(14,2) not null,
  co_product_l    numeric(14,2) not null default 0,
  recorded_loss_l numeric(14,2) not null default 0,
  variance_l      numeric(14,2) generated always as (
                    opening_stock_l + milk_in_l + premix_in_l
                    - output_l - closing_stock_l - co_product_l - recorded_loss_l) stored,
  tolerance_l     numeric(14,2) not null default 0,
  balance_status  text not null default 'pending' check (balance_status in ('pending', 'balanced', 'variance_detected'))
);

create table audit_events (
  audit_id           bigint generated always as identity primary key,
  entity_type        text not null check (entity_type in (
                       'tanker', 'lab_test', 'batch', 'transfer', 'genealogy', 'cip',
                       'fg_batch', 'schedule', 'recommendation', 'investigation', 'volume_balance', 'master_data')),
  entity_id          text not null,
  event_type         text not null check (event_type in (
                       'created', 'updated', 'approved', 'rejected', 'flagged', 'released', 'on_hold')),
  previous_hash      text,
  current_hash       text not null unique,
  actor_id           text not null,
  occurred_at        timestamptz not null default now(),
  data_snapshot      jsonb not null default '{}'::jsonb
);

-- =============================================================================
-- SECURITY & ACCESS CONTROL (Supabase RLS & Grants)
-- =============================================================================

-- Grant access on all tables to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- Enable RLS and add public CRUD policies for prototype / demonstration
do $$
declare
  t text;
begin
  for t in
    select tablename from pg_tables where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "allow_public_all" on public.%I;', t);
    execute format('create policy "allow_public_all" on public.%I for all to anon, authenticated using (true) with check (true);', t);
  end loop;
end $$;
`

fs.writeFileSync(path.join(docsDir, 'supabase-schema-migration.sql'), schemaSql, 'utf8')
console.log('Generated docs/supabase-schema-migration.sql successfully!')

// 2. Read and Generate Seed SQL
const packSizes = parseCsv(fs.readFileSync(path.join(refDir, 'pack_size_codes.csv'), 'utf8'))
const marketVariants = parseCsv(fs.readFileSync(path.join(refDir, 'market_variants.csv'), 'utf8'))
const products = parseCsv(fs.readFileSync(path.join(refDir, 'product_catalog.csv'), 'utf8'))
const finishedSkus = parseCsv(fs.readFileSync(path.join(refDir, 'finished_sku_catalog.csv'), 'utf8'))
const assets = parseCsv(fs.readFileSync(path.join(refDir, 'asset_configuration.csv'), 'utf8'))
const assetUnits = parseCsv(fs.readFileSync(path.join(refDir, 'asset_units.csv'), 'utf8'))
const connections = parseCsv(fs.readFileSync(path.join(refDir, 'asset_connections.csv'), 'utf8'))
const lineDedication = parseCsv(fs.readFileSync(path.join(refDir, 'line_dedication.csv'), 'utf8'))
const lineProdComp = parseCsv(fs.readFileSync(path.join(refDir, 'line_product_compatibility.csv'), 'utf8'))
const lineFinComp = parseCsv(fs.readFileSync(path.join(refDir, 'line_finished_sku_compatibility.csv'), 'utf8'))
const changeoverRules = parseCsv(fs.readFileSync(path.join(refDir, 'changeover_rules.csv'), 'utf8'))
const cipRules = parseCsv(fs.readFileSync(path.join(refDir, 'cip_rules.csv'), 'utf8'))
const constraints = parseCsv(fs.readFileSync(path.join(refDir, 'constraint_catalog.csv'), 'utf8'))

let seedSql = `-- =============================================================================
-- ORBIS AI - Supabase Seed Data
-- Automatically generated from the 13 Official Greenfields Ideation CSV files
-- + Sample Operational Data (Farms, Deliveries, Orders, Batches, Traceability)
-- =============================================================================

begin;

-- 1. Asset Units
insert into asset_units (field, applies_to, unit, definition) values
${assetUnits.map(u => `  (${escapeSql(u.field)}, ${escapeSql(u.applies_to)}, ${escapeSql(u.unit)}, ${escapeSql(u.definition)})`).join(',\n')}
on conflict (field) do update set applies_to = excluded.applies_to, unit = excluded.unit, definition = excluded.definition;

-- 2. Assets
insert into assets (asset_id, asset_type, asset_name, node_role, compatible_product_family, is_tank) values
${assets.map(a => {
  const isTank = ['Raw Milk Tank', 'SFP Storage Tank', 'Cream Tank', 'Premix Tank', 'Mixing Tank', 'Aseptic Tank'].includes(a.asset_type)
  return `  (${escapeSql(a.asset_id)}, ${escapeSql(a.asset_type)}, ${escapeSql(a.asset_name)}, ${escapeSql(a.node_role)}, ${sqlArray(a.compatible_product_family)}, ${isTank ? 'true' : 'false'})`
}).join(',\n')}
on conflict (asset_id) do update set asset_type = excluded.asset_type, asset_name = excluded.asset_name, node_role = excluded.node_role, compatible_product_family = excluded.compatible_product_family, is_tank = excluded.is_tank;

-- 3. Asset Connections
insert into asset_connections (connection_id, source_asset_id, destination_asset_id, via_asset_id, flow_type, max_flow_lph, routing_condition) values
${connections.map(c => `  (${escapeSql(c.connection_id)}, ${escapeSql(c.source_asset_id)}, ${escapeSql(c.destination_asset_id)}, ${escapeSql(c.via_asset_id)}, ${escapeSql(c.flow_type)}, NULL, ${escapeSql(c.routing_condition)})`).join(',\n')}
on conflict (connection_id) do update set source_asset_id = excluded.source_asset_id, destination_asset_id = excluded.destination_asset_id, via_asset_id = excluded.via_asset_id, flow_type = excluded.flow_type, routing_condition = excluded.routing_condition;

-- 4. Pack Sizes
insert into pack_sizes (pack_size_code, description, exact_size_ml) values
${packSizes.map(p => `  (${escapeSql(p.pack_size_code)}, ${escapeSql(p.description)}, ${parseInt(p.exact_size_ml, 10)})`).join(',\n')}
on conflict (pack_size_code) do update set description = excluded.description, exact_size_ml = excluded.exact_size_ml;

-- 5. Market Variants
insert into market_variants (market_variant, market_name, applicable_liquid_skus) values
${marketVariants.map(m => `  (${escapeSql(m.market_variant)}, ${escapeSql(m.market_name)}, ${escapeSql(m.applicable_liquid_skus)})`).join(',\n')}
on conflict (market_variant) do update set market_name = excluded.market_name, applicable_liquid_skus = excluded.applicable_liquid_skus;

-- 6. Products
insert into products (sku_id, product_name, product_family, flavour, is_flavoured, milk_ratio, allowed_pack_size_codes, market_variants) values
${products.map(p => {
  const isFlav = ['Chocolate', 'Strawberry'].includes(p.flavour)
  const milkRatio = isFlav ? '0.900' : '1.000'
  return `  (${escapeSql(p.sku_id)}, ${escapeSql(p.product_name)}, ${escapeSql(p.product_family)}, ${escapeSql(p.flavour)}, ${isFlav ? 'true' : 'false'}, ${milkRatio}, ${sqlArray(p.allowed_pack_size_codes)}, ${sqlArray(p.market_variants)})`
}).join(',\n')}
on conflict (sku_id) do update set product_name = excluded.product_name, product_family = excluded.product_family, flavour = excluded.flavour, is_flavoured = excluded.is_flavoured, milk_ratio = excluded.milk_ratio, allowed_pack_size_codes = excluded.allowed_pack_size_codes, market_variants = excluded.market_variants;

-- 7. Finished SKUs
insert into finished_skus (finished_sku_id, liquid_sku_id, pack_size_code, market_variant) values
${finishedSkus.map(f => `  (${escapeSql(f.finished_sku_id)}, ${escapeSql(f.liquid_sku_id)}, ${escapeSql(f.pack_size_code)}, ${escapeSql(f.market_variant)})`).join(',\n')}
on conflict (finished_sku_id) do update set liquid_sku_id = excluded.liquid_sku_id, pack_size_code = excluded.pack_size_code, market_variant = excluded.market_variant;

-- 8. Line Dedications
insert into line_dedications (line_id, source_aseptic_tank_id, allowed_sku_ids, pack_size_codes, speed_packph) values
${lineDedication.map(l => `  (${escapeSql(l.line_id)}, ${escapeSql(l.source_aseptic_tank_id)}, ${sqlArray(l.allowed_sku_ids)}, ${sqlArray(l.pack_size_codes)}, NULL)`).join(',\n')}
on conflict (line_id) do update set source_aseptic_tank_id = excluded.source_aseptic_tank_id, allowed_sku_ids = excluded.allowed_sku_ids, pack_size_codes = excluded.pack_size_codes;

-- 9. Line Product Compatibility
insert into line_product_compatibility (line_id, sku_id, pack_size_code, eligible) values
${lineProdComp.map(c => `  (${escapeSql(c.line_id)}, ${escapeSql(c.sku_id)}, ${escapeSql(c.pack_size_code)}, ${c.eligible === 'Y' ? 'true' : 'false'})`).join(',\n')}
on conflict (line_id, sku_id, pack_size_code) do update set eligible = excluded.eligible;

-- 10. Line Finished SKU Compatibility
insert into line_finished_compatibility (line_id, finished_sku_id, liquid_sku_id, pack_size_code, market_variant, eligible) values
${lineFinComp.map(c => `  (${escapeSql(c.line_id)}, ${escapeSql(c.finished_sku_id)}, ${escapeSql(c.liquid_sku_id)}, ${escapeSql(c.pack_size_code)}, ${escapeSql(c.market_variant)}, ${c.eligible === 'Y' ? 'true' : 'false'})`).join(',\n')}
on conflict (line_id, finished_sku_id) do update set eligible = excluded.eligible;

-- 11. Changeover Rules
insert into changeover_rules (rule_id, precedence, condition, activity, duration_minutes, additional_note) values
${changeoverRules.map(r => {
  const precedenceMap = { 'FIRST': 1, 'SECOND': 2, 'THIRD': 3, 'LAST': 4 }
  const prec = precedenceMap[r.precedence] ?? 99
  return `  (${escapeSql(r.rule_id)}, ${prec}, ${escapeSql(r.condition)}, ${escapeSql(r.activity)}, NULL, ${escapeSql(r.additional_note)})`
}).join(',\n')}
on conflict (rule_id) do update set precedence = excluded.precedence, condition = excluded.condition, activity = excluded.activity, additional_note = excluded.additional_note;

-- 12. CIP Rules
insert into cip_rules (rule_id, trigger, asset_scope, requirement, duration_minutes) values
${cipRules.map(r => `  (${escapeSql(r.rule_id)}, ${escapeSql(r.trigger)}, ${escapeSql(r.asset_scope)}, ${escapeSql(r.requirement)}, NULL)`).join(',\n')}
on conflict (rule_id) do update set trigger = excluded.trigger, asset_scope = excluded.asset_scope, requirement = excluded.requirement;

-- 13. Constraint Catalog
insert into constraint_catalog (rule_id, scope, description) values
${constraints.map(c => `  (${escapeSql(c.rule_id)}, ${escapeSql(c.scope)}, ${escapeSql(c.description)})`).join(',\n')}
on conflict (rule_id) do update set scope = excluded.scope, description = excluded.description;

-- =============================================================================
-- SAMPLE OPERATIONAL SEED DATA
-- =============================================================================

-- Farms
insert into farms (farm_id, farm_name, location) values
  ('FARM-A', 'Peternakan Greenfields A', 'Malang Barat'),
  ('FARM-B', 'Peternakan Greenfields B', 'Malang Timur')
on conflict (farm_id) do nothing;

-- Production Orders Sample
insert into production_orders (order_id, finished_sku_id, volume_target_l, pack_count_target, deadline, priority, status) values
  ('ORD-1030-01', 'ESL-FC-1000-LOCAL', 15000, 15000, now() + interval '8 hours', 1, 'scheduled'),
  ('ORD-1030-02', 'ESL-CH-1000-LOCAL', 12000, 12000, now() + interval '10 hours', 2, 'pending'),
  ('ORD-1030-03', 'UHT-FC-1000-LOCAL', 20000, 20000, now() + interval '12 hours', 1, 'in_progress'),
  ('ORD-1030-04', 'UHT-ST-250-LOCAL',  10000, 40000, now() + interval '14 hours', 2, 'pending'),
  ('ORD-1030-05', 'UHT-CH-250-LOCAL',  8000,  32000, now() + interval '16 hours', 3, 'pending')
on conflict (order_id) do nothing;

-- Tanker Deliveries Sample
insert into tanker_deliveries (tanker_id, farm_id, plate_number, volume_l, truck_capacity, departure_time, eta, actual_arrival, bay_id, status) values
  ('TRK-A01', 'FARM-A', 'N 8921 AB', 10000, 12000, now() - interval '4 hours', now() - interval '2 hours', now() - interval '1 hour 45 minutes', 'UB-01', 'stored'),
  ('TRK-A02', 'FARM-A', 'N 8922 AB', 12000, 15000, now() - interval '3 hours', now() - interval '1 hour', now() - interval '50 minutes', 'UB-02', 'stored'),
  ('TRK-B01', 'FARM-B', 'N 9104 CD', 13000, 15000, now() - interval '2 hours', now() + interval '30 minutes', null, 'UB-01', 'on_the_way'),
  ('TRK-A03', 'FARM-A', 'N 8925 AB', 10500, 12000, now() - interval '1 hour', now() + interval '1 hour', null, 'UB-03', 'on_the_way')
on conflict (tanker_id) do nothing;

-- Tank Current States Sample
insert into tank_current_states (asset_id, current_volume_l, sku_id, material_state, status) values
  ('RMT-01', 15000, null, 'raw', 'in_use'),
  ('RMT-02', 20000, null, 'raw', 'in_use'),
  ('SFP-01', 12000, 'ESL-FC', 'standardized', 'in_use'),
  ('SFP-04', 18000, 'UHT-FC', 'standardized', 'in_use'),
  ('AT-01',  8000,  'ESL-FC', 'sterilized', 'in_use'),
  ('AT-03',  10000, 'UHT-FC', 'sterilized', 'in_use');

commit;
`

fs.writeFileSync(path.join(docsDir, 'supabase-seed-data.sql'), seedSql, 'utf8')
console.log('Generated docs/supabase-seed-data.sql successfully!')
