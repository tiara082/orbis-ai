import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const config = {
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.wfvduonyanoipsubvibs',
  password: 'Xb&xAb5Uy9Vi%Z-',
  ssl: { rejectUnauthorized: false }
}

async function run() {
  console.log('Connecting to Supabase PostgreSQL at:', config.host)
  const client = new Client(config)
  try {
    await client.connect()
    console.log('Connected to Supabase PostgreSQL successfully!')

    // 1. Run Schema Migration
    const schemaPath = path.join(rootDir, 'docs', 'supabase-schema-migration.sql')
    console.log('Reading migration file:', schemaPath)
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    console.log('Executing schema migration...')
    await client.query(schemaSql)
    console.log('Schema migration completed successfully!')

    // 2. Run Seed Data
    const seedPath = path.join(rootDir, 'docs', 'supabase-seed-data.sql')
    console.log('Reading seed file:', seedPath)
    const seedSql = fs.readFileSync(seedPath, 'utf8')
    console.log('Executing seed data...')
    await client.query(seedSql)
    console.log('Seed data completed successfully!')

    // 3. Verify row counts
    const checks = [
      'asset_units',
      'assets',
      'asset_connections',
      'products',
      'finished_skus',
      'pack_sizes',
      'market_variants',
      'line_dedications',
      'line_product_compatibility',
      'line_finished_compatibility',
      'changeover_rules',
      'cip_rules',
      'constraint_catalog',
      'farms',
      'tanker_deliveries',
      'production_orders',
      'tank_current_states'
    ]

    console.log('\n--- VERIFICATION OF LIVE TABLES IN SUPABASE ---')
    for (const table of checks) {
      const res = await client.query(`SELECT count(*) FROM public.${table};`)
      console.log(`Table ${table.padEnd(30)}: ${res.rows[0].count} rows`)
    }

    console.log('\nALL 13 MASTER DATASETS & OPERATIONAL DATA ARE LIVE IN SUPABASE!')
  } catch (err) {
    console.error('Migration error:', err)
  } finally {
    await client.end()
  }
}

run()
