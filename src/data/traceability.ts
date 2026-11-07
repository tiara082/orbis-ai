import { BATCHES, DELIVERIES, SIDE_INPUTS, TRANSFERS, type Batch, type Delivery, type Transfer } from './scenario'

export interface SideInputEvidence {
  batchId: string
  label: string
  volumeL: number
}

export interface DeliveryOriginEvidence {
  deliveryId: string
  farmId: string
  destinations: {
    tankId: string
    volumeL: number
  }[]
}

export interface TraceabilitySnapshot {
  readonly batches: readonly Batch[]
  readonly transfers: readonly Transfer[]
  readonly sideInputs: readonly SideInputEvidence[]
  readonly deliveryOrigins: readonly DeliveryOriginEvidence[]
  readonly identity: string
  readonly sourceDate?: string
}

function freeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as Record<string, unknown>)) freeze(child)
  }
  return value
}

function cloneBatch(batch: Batch): Batch {
  return { ...batch }
}

function cloneTransfer(transfer: Transfer): Transfer {
  return { ...transfer, path: [...transfer.path] }
}

function cloneDeliveryOrigin(delivery: Delivery): DeliveryOriginEvidence {
  return {
    deliveryId: delivery.id,
    farmId: delivery.farmId,
    destinations: delivery.destinations.map((destination) => ({ ...destination }))
  }
}

export function createTraceabilitySnapshot(input: {
  batches: readonly Batch[]
  transfers: readonly Transfer[]
  sideInputs: readonly SideInputEvidence[]
  deliveryOrigins: readonly DeliveryOriginEvidence[]
  identity: string
  sourceDate?: string
}): TraceabilitySnapshot {
  return freeze({
    batches: input.batches.map(cloneBatch),
    transfers: input.transfers.map(cloneTransfer),
    sideInputs: input.sideInputs.map((sideInput) => ({ ...sideInput })),
    deliveryOrigins: input.deliveryOrigins.map((origin) => ({
      ...origin,
      destinations: origin.destinations.map((destination) => ({ ...destination }))
    })),
    identity: input.identity,
    sourceDate: input.sourceDate
  })
}

export function createScenarioTraceabilitySnapshot(identity: string, sourceDate?: string): TraceabilitySnapshot {
  return createTraceabilitySnapshot({
    batches: BATCHES,
    transfers: TRANSFERS,
    sideInputs: SIDE_INPUTS,
    deliveryOrigins: DELIVERIES.map(cloneDeliveryOrigin),
    identity,
    sourceDate
  })
}