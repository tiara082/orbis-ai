/**
 * Scenario for one plant day. Every asset, SKU, and route ID comes from the
 * official catalog in ./reference. Volumes, times, and statuses are scenario
 * values: the catalog marks them `X` (applies, value not provided yet).
 */
import { at, type Minutes } from '../domain/time'

export const SCENARIO = {
  id: 'SCN-1030',
  date: '2026-10-30',
  snapshot: at('12:30'),
  planWindow: { start: at('08:00'), end: at('16:00') }
}

// ---------- Farms and deliveries ----------

export interface Farm {
  id: string
  name: string
}

export const FARMS: Farm[] = [
  { id: 'FARM-A', name: 'Farm A' },
  { id: 'FARM-B', name: 'Farm B' }
]

export type QcStatus = 'Pending' | 'Passed' | 'Rejected'

export interface Delivery {
  id: string
  farmId: string
  volumeL: number
  truckCapacityL: number
  departure: Minutes
  eta: Minutes
  arrival?: Minutes
  bayId?: string
  unloadStart?: Minutes
  unloadEnd?: Minutes
  /** Destination raw milk tanks; more than one entry is a split */
  destinations: { tankId: string; volumeL: number }[]
}

export const DELIVERIES: Delivery[] = [
  {
    id: 'TRK-A01',
    farmId: 'FARM-A',
    volumeL: 10000,
    truckCapacityL: 12000,
    departure: at('01:00'),
    eta: at('03:00'),
    arrival: at('03:15'),
    bayId: 'UB-01',
    unloadStart: at('03:30'),
    unloadEnd: at('04:15'),
    destinations: [{ tankId: 'RMT-01', volumeL: 10000 }]
  },
  {
    id: 'TRK-A02',
    farmId: 'FARM-A',
    volumeL: 12000,
    truckCapacityL: 15000,
    departure: at('01:30'),
    eta: at('03:30'),
    arrival: at('03:25'),
    bayId: 'UB-02',
    unloadStart: at('03:45'),
    unloadEnd: at('04:30'),
    destinations: [
      { tankId: 'RMT-01', volumeL: 5000 },
      { tankId: 'RMT-02', volumeL: 7000 }
    ]
  },
  {
    id: 'TRK-B01',
    farmId: 'FARM-B',
    volumeL: 13000,
    truckCapacityL: 15000,
    departure: at('02:00'),
    eta: at('04:00'),
    arrival: at('04:20'),
    bayId: 'UB-01',
    unloadStart: at('04:40'),
    unloadEnd: at('05:25'),
    destinations: [{ tankId: 'RMT-02', volumeL: 13000 }]
  },
  {
    id: 'TRK-A03',
    farmId: 'FARM-A',
    volumeL: 10500,
    truckCapacityL: 12000,
    departure: at('07:00'),
    eta: at('09:00'),
    arrival: at('09:10'),
    bayId: 'UB-03',
    destinations: []
  },
  {
    id: 'TRK-B02',
    farmId: 'FARM-B',
    volumeL: 9000,
    truckCapacityL: 12000,
    departure: at('11:00'),
    eta: at('13:15'),
    destinations: []
  }
]

export interface LabRecord {
  deliveryId: string
  sampleId: string
  samplingStart: Minutes
  samplingEnd: Minutes
  labStart: Minutes
  labEnd?: Minutes
  /** Status-map key, translated in the UI */
  result: 'within spec' | 'awaiting result'
  qcStatus: QcStatus
  releaseTime?: Minutes
  releasedBy?: string
}

export const LAB_RECORDS: LabRecord[] = [
  {
    deliveryId: 'TRK-A01',
    sampleId: 'S-A01-1030',
    samplingStart: at('03:15'),
    samplingEnd: at('03:18'),
    labStart: at('03:18'),
    labEnd: at('03:28'),
    result: 'within spec',
    qcStatus: 'Passed',
    releaseTime: at('03:29'),
    releasedBy: 'Rina S. (QA)'
  },
  {
    deliveryId: 'TRK-A02',
    sampleId: 'S-A02-1030',
    samplingStart: at('03:25'),
    samplingEnd: at('03:28'),
    labStart: at('03:28'),
    labEnd: at('03:40'),
    result: 'within spec',
    qcStatus: 'Passed',
    releaseTime: at('03:41'),
    releasedBy: 'Rina S. (QA)'
  },
  {
    deliveryId: 'TRK-B01',
    sampleId: 'S-B01-1030',
    samplingStart: at('04:20'),
    samplingEnd: at('04:24'),
    labStart: at('04:24'),
    labEnd: at('04:36'),
    result: 'within spec',
    qcStatus: 'Passed',
    releaseTime: at('04:37'),
    releasedBy: 'Rina S. (QA)'
  },
  {
    deliveryId: 'TRK-A03',
    sampleId: 'S-A03-1030',
    samplingStart: at('09:10'),
    samplingEnd: at('09:14'),
    labStart: at('09:14'),
    result: 'awaiting result',
    qcStatus: 'Pending'
  }
]

// ---------- Unloading bays ----------

export interface BayConfig {
  bayId: string
  active: boolean
  tankersPerBay: number
  pumpFlowLph: number
  cipMinutes: number
  maintenance?: { start: Minutes; end: Minutes }
}

export const BAYS: BayConfig[] = [
  { bayId: 'UB-01', active: true, tankersPerBay: 1, pumpFlowLph: 20000, cipMinutes: 20 },
  { bayId: 'UB-02', active: true, tankersPerBay: 1, pumpFlowLph: 20000, cipMinutes: 20 },
  { bayId: 'UB-03', active: true, tankersPerBay: 1, pumpFlowLph: 20000, cipMinutes: 20 },
  {
    bayId: 'UB-04',
    active: false,
    tankersPerBay: 1,
    pumpFlowLph: 20000,
    cipMinutes: 20,
    maintenance: { start: at('06:00'), end: at('14:00') }
  }
]

// ---------- Asset states at the snapshot ----------

export type AssetStatus = 'running' | 'ready' | 'idle' | 'cip' | 'cip required' | 'maintenance' | 'holding risk'

export interface AssetState {
  assetId: string
  status: AssetStatus
  capacityL?: number
  volumeL?: number
  inflowLph?: number
  outflowLph?: number
  speedLph?: number
  /** Filling lines only */
  speedPackph?: number
  holdingLimitH?: number
  /** Age of the material is counted from this time; refill does not reset it (HOLDING) */
  batchStart?: Minutes
  batchId?: string
  /** Liquid SKU id, or 'RAW' / 'CREAM' for intermediate material */
  material?: string
  cipMinutes?: number
  maintenance?: { start: Minutes; end: Minutes }
  /** Aseptic tanks: minimum level per number of running filling lines */
  minLevelPct?: { oneLine: number; twoLines: number }
  activeLines?: number
  /** Filling lines: finished SKU currently running */
  runningSku?: string
}

const tank = (state: AssetState): AssetState => state

export const ASSET_STATES: AssetState[] = [
  // Receiving and raw milk
  { assetId: 'DG-01', status: 'idle', speedLph: 20000, cipMinutes: 30 },
  { assetId: 'DG-02', status: 'idle', speedLph: 20000, cipMinutes: 30 },
  tank({
    assetId: 'RMT-01',
    status: 'ready',
    capacityL: 25000,
    volumeL: 3000,
    inflowLph: 20000,
    outflowLph: 15000,
    holdingLimitH: 24,
    batchStart: at('03:30'),
    batchId: 'RMT01-1030',
    material: 'RAW',
    cipMinutes: 30
  }),
  tank({
    assetId: 'RMT-02',
    status: 'ready',
    capacityL: 25000,
    volumeL: 2400,
    inflowLph: 20000,
    outflowLph: 15000,
    holdingLimitH: 24,
    batchStart: at('03:45'),
    batchId: 'RMT02-1030',
    material: 'RAW',
    cipMinutes: 30
  }),
  tank({
    assetId: 'RMT-03',
    status: 'cip required',
    capacityL: 25000,
    volumeL: 0,
    inflowLph: 20000,
    outflowLph: 15000,
    holdingLimitH: 24,
    cipMinutes: 30
  }),

  // Thermization and separation
  { assetId: 'TH-01', status: 'ready', speedLph: 15000, cipMinutes: 40 },
  {
    assetId: 'TH-02',
    status: 'ready',
    speedLph: 15000,
    cipMinutes: 40,
    maintenance: { start: at('06:00'), end: at('10:00') }
  },
  { assetId: '1-Sep', status: 'ready', speedLph: 20000, cipMinutes: 40 },
  { assetId: '2-Sep', status: 'idle', speedLph: 20000, cipMinutes: 40 },
  tank({
    assetId: 'CRT-01',
    status: 'ready',
    capacityL: 5000,
    volumeL: 600,
    holdingLimitH: 48,
    batchStart: at('05:35'),
    batchId: 'CRT01-1030',
    material: 'CREAM',
    cipMinutes: 30
  }),
  tank({ assetId: 'CRT-02', status: 'ready', capacityL: 5000, volumeL: 0, holdingLimitH: 48, cipMinutes: 30 }),
  tank({ assetId: 'PREMIX-01', status: 'ready', capacityL: 3000, volumeL: 0, cipMinutes: 30 }),
  tank({ assetId: 'MIX-01', status: 'ready', capacityL: 15000, volumeL: 0, cipMinutes: 30 }),
  tank({ assetId: 'MIX-02', status: 'ready', capacityL: 15000, volumeL: 0, cipMinutes: 30 }),

  // SFP storage (15 tanks)
  ...['SFP-01', 'SFP-02', 'SFP-03'].map((assetId) =>
    tank({ assetId, status: 'ready', capacityL: 15000, volumeL: 0, inflowLph: 20000, outflowLph: 15000, holdingLimitH: 24, cipMinutes: 30 })
  ),
  tank({
    assetId: 'SFP-04',
    status: 'cip required',
    capacityL: 15000,
    volumeL: 0,
    inflowLph: 20000,
    outflowLph: 15000,
    holdingLimitH: 24,
    cipMinutes: 30
  }),
  tank({
    assetId: 'SFP-05',
    status: 'holding risk',
    capacityL: 15000,
    volumeL: 4000,
    inflowLph: 20000,
    outflowLph: 15000,
    holdingLimitH: 24,
    batchStart: at('14:00', -1),
    batchId: 'SFP05-1029',
    material: 'UHT-FC',
    cipMinutes: 30
  }),
  ...['SFP-06', 'SFP-07', 'SFP-08', 'SFP-09', 'SFP-10', 'SFP-11', 'SFP-12', 'SFP-14', 'SFP-15'].map((assetId) =>
    tank({ assetId, status: 'ready', capacityL: 15000, volumeL: 0, inflowLph: 20000, outflowLph: 15000, holdingLimitH: 24, cipMinutes: 30 })
  ),
  tank({
    assetId: 'SFP-13',
    status: 'cip',
    capacityL: 15000,
    volumeL: 0,
    inflowLph: 20000,
    outflowLph: 15000,
    holdingLimitH: 24,
    cipMinutes: 30
  }),

  // Sterilizers
  { assetId: 'ST-01', status: 'running', speedLph: 9000, cipMinutes: 60, material: 'ESL-CH' },
  { assetId: 'ST-02', status: 'ready', speedLph: 9000, cipMinutes: 60 },
  { assetId: 'ST-03', status: 'ready', speedLph: 12000, cipMinutes: 60 },
  { assetId: 'ST-04', status: 'idle', speedLph: 12000, cipMinutes: 60 },
  { assetId: 'ST-05', status: 'maintenance', speedLph: 12000, cipMinutes: 60, maintenance: { start: at('08:00'), end: at('16:00') } },

  // Aseptic tanks
  tank({
    assetId: 'AT-01',
    status: 'running',
    capacityL: 12000,
    volumeL: 6670,
    inflowLph: 9000,
    outflowLph: 9000,
    holdingLimitH: 48,
    batchStart: at('11:20'),
    batchId: 'AT01-1030-CH',
    material: 'ESL-CH',
    cipMinutes: 20,
    minLevelPct: { oneLine: 25, twoLines: 50 },
    activeLines: 1
  }),
  tank({
    assetId: 'AT-02',
    status: 'ready',
    capacityL: 12000,
    volumeL: 0,
    inflowLph: 9000,
    outflowLph: 9000,
    holdingLimitH: 48,
    cipMinutes: 20,
    minLevelPct: { oneLine: 25, twoLines: 50 },
    activeLines: 0
  }),
  tank({
    assetId: 'AT-03',
    status: 'ready',
    capacityL: 15000,
    volumeL: 0,
    inflowLph: 12000,
    outflowLph: 12000,
    holdingLimitH: 48,
    cipMinutes: 20,
    minLevelPct: { oneLine: 25, twoLines: 50 },
    activeLines: 0
  }),
  tank({
    assetId: 'AT-04',
    status: 'idle',
    capacityL: 15000,
    volumeL: 0,
    inflowLph: 12000,
    outflowLph: 12000,
    holdingLimitH: 48,
    cipMinutes: 20,
    minLevelPct: { oneLine: 25, twoLines: 50 },
    activeLines: 0
  }),
  tank({
    assetId: 'AT-05',
    status: 'maintenance',
    capacityL: 15000,
    volumeL: 0,
    inflowLph: 12000,
    outflowLph: 12000,
    holdingLimitH: 48,
    cipMinutes: 20,
    minLevelPct: { oneLine: 25, twoLines: 50 },
    activeLines: 0,
    maintenance: { start: at('08:00'), end: at('16:00') }
  }),

  // Filling lines
  { assetId: 'FL-01', status: 'running', speedPackph: 4000, cipMinutes: 60, runningSku: 'ESL-CH-1000-LOCAL' },
  { assetId: 'FL-02', status: 'ready', speedPackph: 4000, cipMinutes: 60 },
  { assetId: 'FL-03', status: 'ready', speedPackph: 4000, cipMinutes: 60 },
  { assetId: 'FL-04', status: 'ready', speedPackph: 4000, cipMinutes: 60 },
  { assetId: 'FL-05', status: 'idle', speedPackph: 6000, cipMinutes: 60 },
  { assetId: 'FL-06', status: 'idle', speedPackph: 6000, cipMinutes: 60 },
  { assetId: 'FL-07', status: 'maintenance', speedPackph: 6000, cipMinutes: 60, maintenance: { start: at('13:00'), end: at('17:00') } },
  { assetId: 'FL-08', status: 'idle', speedPackph: 9000, cipMinutes: 60 },
  { assetId: 'FL-09', status: 'idle', speedPackph: 9000, cipMinutes: 60 },
  { assetId: 'FL-10', status: 'idle', speedPackph: 9000, cipMinutes: 60 }
]

const stateIndex = new Map(ASSET_STATES.map((state) => [state.assetId, state]))
export const getAssetState = (assetId: string) => stateIndex.get(assetId)

/** Aseptic tank output limit to its filling lines (AT_SHARED_FLOW) */
export const asepticOutflowLimit = (asepticTankId: string) => getAssetState(asepticTankId)?.outflowLph ?? 0

// ---------- Production orders and actuals ----------

export type Priority = 'high' | 'medium' | 'low'

export interface ProductionOrder {
  id: string
  finishedSkuId: string
  packs: number
  priority: Priority
  /** Production date as day offset from the scenario day */
  dayOffset: number
  due: Minutes
}

export const PRODUCTION_ORDERS: ProductionOrder[] = [
  { id: 'PO-1030-01', finishedSkuId: 'ESL-FC-1000-LOCAL', packs: 12000, priority: 'high', dayOffset: 0, due: at('12:00') },
  { id: 'PO-1030-02', finishedSkuId: 'ESL-FC-1000-EXP', packs: 8000, priority: 'medium', dayOffset: 0, due: at('14:00') },
  { id: 'PO-1030-03', finishedSkuId: 'ESL-CH-1000-LOCAL', packs: 10000, priority: 'medium', dayOffset: 0, due: at('16:00') },
  { id: 'PO-1031-01', finishedSkuId: 'UHT-FC-250-LOCAL', packs: 40000, priority: 'low', dayOffset: 1, due: at('18:00', 1) }
]

export interface ProductionActual {
  orderId: string
  lineId: string
  start: Minutes
  end?: Minutes
  goodPacks: number
  rejectPacks: number
  note?: 'atMinLevel'
}

export const PRODUCTION_ACTUALS: ProductionActual[] = [
  { orderId: 'PO-1030-01', lineId: 'FL-01', start: at('08:02'), end: at('11:00'), goodPacks: 11720, rejectPacks: 95 },
  { orderId: 'PO-1030-02', lineId: 'FL-02', start: at('08:00'), end: at('10:04'), goodPacks: 7930, rejectPacks: 52 },
  { orderId: 'PO-1030-03', lineId: 'FL-01', start: at('11:40'), goodPacks: 3300, rejectPacks: 30, note: 'atMinLevel' }
]

// ---------- Batches and transfers (genealogy) ----------

export type BatchKind = 'tanker' | 'raw' | 'process' | 'storage' | 'cream' | 'mix' | 'aseptic' | 'finished'

export interface Batch {
  id: string
  kind: BatchKind
  assetId: string
  /** Liquid SKU, 'RAW', or 'CREAM' */
  material: string
  volumeL: number
  dayOffset: number
  status: 'stored' | 'lab pending' | 'completed' | 'running' | 'released' | 'pending qa' | 'holding risk'
  deliveryId?: string
  finishedSkuId?: string
}

export const BATCHES: Batch[] = [
  { id: 'RT-A01-1030', kind: 'tanker', assetId: 'RT-INPUT', material: 'RAW', volumeL: 10000, dayOffset: 0, status: 'stored', deliveryId: 'TRK-A01' },
  { id: 'RT-A02-1030', kind: 'tanker', assetId: 'RT-INPUT', material: 'RAW', volumeL: 12000, dayOffset: 0, status: 'stored', deliveryId: 'TRK-A02' },
  { id: 'RT-B01-1030', kind: 'tanker', assetId: 'RT-INPUT', material: 'RAW', volumeL: 13000, dayOffset: 0, status: 'stored', deliveryId: 'TRK-B01' },
  { id: 'RT-A03-1030', kind: 'tanker', assetId: 'RT-INPUT', material: 'RAW', volumeL: 10500, dayOffset: 0, status: 'lab pending', deliveryId: 'TRK-A03' },
  { id: 'RMT01-1030', kind: 'raw', assetId: 'RMT-01', material: 'RAW', volumeL: 15000, dayOffset: 0, status: 'stored' },
  { id: 'RMT02-1030', kind: 'raw', assetId: 'RMT-02', material: 'RAW', volumeL: 20000, dayOffset: 0, status: 'stored' },
  { id: 'SEP1-1030', kind: 'process', assetId: '1-Sep', material: 'ESL-FC', volumeL: 20600, dayOffset: 0, status: 'completed' },
  { id: 'SFP01-1030', kind: 'storage', assetId: 'SFP-01', material: 'ESL-FC', volumeL: 12000, dayOffset: 0, status: 'completed' },
  { id: 'SFP02-1030', kind: 'storage', assetId: 'SFP-02', material: 'ESL-FC', volumeL: 8000, dayOffset: 0, status: 'completed' },
  { id: 'CRT01-1030', kind: 'cream', assetId: 'CRT-01', material: 'CREAM', volumeL: 600, dayOffset: 0, status: 'stored' },
  { id: 'SFP03-1030', kind: 'storage', assetId: 'SFP-03', material: 'ESL-CH', volumeL: 9000, dayOffset: 0, status: 'completed' },
  { id: 'MIX01-1030', kind: 'mix', assetId: 'MIX-01', material: 'ESL-CH', volumeL: 10000, dayOffset: 0, status: 'completed' },
  { id: 'SFP04-1030', kind: 'storage', assetId: 'SFP-04', material: 'ESL-CH', volumeL: 10000, dayOffset: 0, status: 'completed' },
  { id: 'AT01-1030-FC', kind: 'aseptic', assetId: 'AT-01', material: 'ESL-FC', volumeL: 20000, dayOffset: 0, status: 'completed' },
  { id: 'AT01-1030-CH', kind: 'aseptic', assetId: 'AT-01', material: 'ESL-CH', volumeL: 10000, dayOffset: 0, status: 'running' },
  { id: 'FG-1030-FL01-FC', kind: 'finished', assetId: 'FL-01', material: 'ESL-FC', volumeL: 11720, dayOffset: 0, status: 'pending qa', finishedSkuId: 'ESL-FC-1000-LOCAL' },
  { id: 'FG-1030-FL02-FC', kind: 'finished', assetId: 'FL-02', material: 'ESL-FC', volumeL: 7930, dayOffset: 0, status: 'pending qa', finishedSkuId: 'ESL-FC-1000-EXP' },
  { id: 'FG-1030-FL01-CH', kind: 'finished', assetId: 'FL-01', material: 'ESL-CH', volumeL: 3300, dayOffset: 0, status: 'running', finishedSkuId: 'ESL-CH-1000-LOCAL' },
  { id: 'SFP05-1029', kind: 'storage', assetId: 'SFP-05', material: 'UHT-FC', volumeL: 4000, dayOffset: -1, status: 'holding risk' }
]

export type TransferType = 'receive' | 'split' | 'mix' | 'separation' | 'co-product' | 'transform' | 'sterilize' | 'fill'

export interface Transfer {
  id: string
  fromBatch: string
  toBatch: string
  /** Assets in flow order; each consecutive pair must be an edge in asset_connections */
  path: string[]
  time: Minutes
  volumeL: number
  type: TransferType
}

export const TRANSFERS: Transfer[] = [
  { id: 'TR-01', fromBatch: 'RT-A01-1030', toBatch: 'RMT01-1030', path: ['RT-INPUT', 'UB-01', 'RECEIVING-HDR', 'DG-01', 'RMT-01'], time: at('03:30'), volumeL: 10000, type: 'receive' },
  { id: 'TR-02', fromBatch: 'RT-A02-1030', toBatch: 'RMT01-1030', path: ['RT-INPUT', 'UB-02', 'RECEIVING-HDR', 'DG-01', 'RMT-01'], time: at('03:45'), volumeL: 5000, type: 'split' },
  { id: 'TR-03', fromBatch: 'RT-A02-1030', toBatch: 'RMT02-1030', path: ['RT-INPUT', 'UB-02', 'RECEIVING-HDR', 'DG-01', 'RMT-02'], time: at('03:45'), volumeL: 7000, type: 'split' },
  { id: 'TR-04', fromBatch: 'RT-B01-1030', toBatch: 'RMT02-1030', path: ['RT-INPUT', 'UB-01', 'RECEIVING-HDR', 'DG-01', 'RMT-02'], time: at('04:40'), volumeL: 13000, type: 'receive' },
  { id: 'TR-05', fromBatch: 'RMT01-1030', toBatch: 'SEP1-1030', path: ['RMT-01', 'TH-01', 'THERM-OUT-HDR', '1-Sep'], time: at('05:30'), volumeL: 12000, type: 'mix' },
  { id: 'TR-06', fromBatch: 'RMT02-1030', toBatch: 'SEP1-1030', path: ['RMT-02', 'TH-01', 'THERM-OUT-HDR', '1-Sep'], time: at('05:30'), volumeL: 8600, type: 'mix' },
  { id: 'TR-07', fromBatch: 'SEP1-1030', toBatch: 'SFP01-1030', path: ['1-Sep', 'SFP-IN-HDR', 'SFP-01'], time: at('05:35'), volumeL: 12000, type: 'separation' },
  { id: 'TR-08', fromBatch: 'SEP1-1030', toBatch: 'SFP02-1030', path: ['1-Sep', 'SFP-IN-HDR', 'SFP-02'], time: at('06:20'), volumeL: 8000, type: 'separation' },
  { id: 'TR-09', fromBatch: 'SEP1-1030', toBatch: 'CRT01-1030', path: ['1-Sep', 'CREAM-IN-HDR', 'CRT-01'], time: at('05:35'), volumeL: 600, type: 'co-product' },
  { id: 'TR-10', fromBatch: 'RMT02-1030', toBatch: 'SFP03-1030', path: ['RMT-02', 'TH-01', 'THERM-OUT-HDR', 'SFP-IN-HDR', 'SFP-03'], time: at('06:45'), volumeL: 9000, type: 'receive' },
  { id: 'TR-11', fromBatch: 'SFP03-1030', toBatch: 'MIX01-1030', path: ['SFP-03', 'SFP-OUT-HDR', 'PREMIX-01', 'MIX-01'], time: at('07:30'), volumeL: 9000, type: 'transform' },
  { id: 'TR-12', fromBatch: 'MIX01-1030', toBatch: 'SFP04-1030', path: ['MIX-01', 'MIXED-OUT-HDR', 'SFP-04'], time: at('08:30'), volumeL: 10000, type: 'transform' },
  { id: 'TR-13', fromBatch: 'SFP01-1030', toBatch: 'AT01-1030-FC', path: ['SFP-01', 'SFP-OUT-HDR', 'ST-01', 'AT-01'], time: at('07:00'), volumeL: 12000, type: 'sterilize' },
  { id: 'TR-14', fromBatch: 'SFP02-1030', toBatch: 'AT01-1030-FC', path: ['SFP-02', 'SFP-OUT-HDR', 'ST-01', 'AT-01'], time: at('08:30'), volumeL: 8000, type: 'sterilize' },
  { id: 'TR-15', fromBatch: 'SFP04-1030', toBatch: 'AT01-1030-CH', path: ['SFP-04', 'SFP-OUT-HDR', 'ST-01', 'AT-01'], time: at('11:20'), volumeL: 10000, type: 'sterilize' },
  { id: 'TR-16', fromBatch: 'AT01-1030-FC', toBatch: 'FG-1030-FL01-FC', path: ['AT-01', 'FL-01', 'FG-OUTPUT'], time: at('08:02'), volumeL: 11720, type: 'fill' },
  { id: 'TR-17', fromBatch: 'AT01-1030-FC', toBatch: 'FG-1030-FL02-FC', path: ['AT-01', 'FL-02', 'FG-OUTPUT'], time: at('08:00'), volumeL: 7930, type: 'fill' },
  { id: 'TR-18', fromBatch: 'AT01-1030-CH', toBatch: 'FG-1030-FL01-CH', path: ['AT-01', 'FL-01', 'FG-OUTPUT'], time: at('11:40'), volumeL: 3300, type: 'fill' }
]

/** Ingredients that enter a batch from outside the milk genealogy (premix), recorded separately */
export const SIDE_INPUTS = [{ batchId: 'MIX01-1030', label: 'premix', volumeL: 1000 }]

// ---------- Forecast (model output) ----------

export interface DailyIntake {
  dayOffset: number
  volumeL: number
  forecast?: boolean
}

export const MILK_INTAKE_HISTORY: DailyIntake[] = [
  { dayOffset: -6, volumeL: 33800 },
  { dayOffset: -5, volumeL: 36200 },
  { dayOffset: -4, volumeL: 34900 },
  { dayOffset: -3, volumeL: 35600 },
  { dayOffset: -2, volumeL: 32700 },
  { dayOffset: -1, volumeL: 34400 },
  { dayOffset: 0, volumeL: 35000 },
  { dayOffset: 1, volumeL: 33500, forecast: true }
]

export const FORECAST = {
  modelRefreshed: at('06:00'),
  /** Predicted milk available for today's plan */
  availableTodayL: 35000,
  availableTodayConfidencePct: 92,
  tomorrowL: 33500,
  tomorrowRangeL: [31000, 36000] as [number, number],
  trkB02Eta: { predicted: at('13:25'), planned: at('13:15') },
  trkA03ResultExpected: at('12:45')
}

// ---------- Static audit events ----------

export interface AuditEvent {
  id: string
  time: Minutes
  actor: string
  /** Translation key under audit.action */
  action: string
  entity: string
  ruleId?: string
}

export const SCENARIO_AUDIT_EVENTS: AuditEvent[] = [
  { id: 'EV-001', time: at('03:29'), actor: 'Rina S. (QA)', action: 'labRelease', entity: 'TRK-A01', ruleId: 'RECEIVING_GATE' },
  { id: 'EV-002', time: at('03:30'), actor: 'System', action: 'transfer', entity: 'TR-01' },
  { id: 'EV-003', time: at('03:41'), actor: 'Rina S. (QA)', action: 'labRelease', entity: 'TRK-A02', ruleId: 'RECEIVING_GATE' },
  { id: 'EV-004', time: at('03:45'), actor: 'System', action: 'split', entity: 'TR-02 / TR-03' },
  { id: 'EV-005', time: at('04:37'), actor: 'Rina S. (QA)', action: 'labRelease', entity: 'TRK-B01', ruleId: 'RECEIVING_GATE' },
  { id: 'EV-006', time: at('05:30'), actor: 'System', action: 'batchCreated', entity: 'SEP1-1030', ruleId: 'TRANSFORM_BATCH' },
  { id: 'EV-007', time: at('05:35'), actor: 'System', action: 'coProduct', entity: 'CRT01-1030', ruleId: 'CO_PRODUCT' },
  { id: 'EV-008', time: at('07:30'), actor: 'System', action: 'batchCreated', entity: 'MIX01-1030', ruleId: 'TRANSFORM_BATCH' },
  { id: 'EV-009', time: at('09:10'), actor: 'Budi H. (Receiving)', action: 'tankerArrived', entity: 'TRK-A03' },
  { id: 'EV-010', time: at('11:00'), actor: 'System', action: 'cipStarted', entity: 'AT-01', ruleId: 'CIP_EMPTY' },
  { id: 'EV-011', time: at('11:40'), actor: 'System', action: 'productionStarted', entity: 'PO-1030-03 · FL-01' }
]
