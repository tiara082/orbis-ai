import { BATCHES, DELIVERIES, SIDE_INPUTS, TRANSFERS, getAssetState, type Batch, type Transfer } from '../data/scenario'

const batchIndex = new Map(BATCHES.map((batch) => [batch.id, batch]))
export const getBatch = (id: string) => batchIndex.get(id)

export const transfersInto = (batchId: string) => TRANSFERS.filter((transfer) => transfer.toBatch === batchId)
export const transfersOutOf = (batchId: string) => TRANSFERS.filter((transfer) => transfer.fromBatch === batchId)

export interface Lineage {
  batches: Batch[]
  transfers: Transfer[]
}

function walk(startId: string, direction: 'up' | 'down'): Lineage {
  const seen = new Set<string>([startId])
  const transfers: Transfer[] = []
  const queue = [startId]
  while (queue.length) {
    const id = queue.shift() as string
    const edges = direction === 'up' ? transfersInto(id) : transfersOutOf(id)
    for (const edge of edges) {
      if (!transfers.includes(edge)) transfers.push(edge)
      const next = direction === 'up' ? edge.fromBatch : edge.toBatch
      if (!seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }
  return { batches: [...seen].map((id) => batchIndex.get(id)).filter((b): b is Batch => Boolean(b)), transfers }
}

/** Backward trace: everything the batch was made from, back to the farm boundary */
export const ancestors = (batchId: string) => walk(batchId, 'up')

/** Forward trace: everything made from the batch, up to finished goods */
export const descendants = (batchId: string) => walk(batchId, 'down')

/** Total recorded inflow of a batch, including side inputs such as premix */
export function inflowL(batchId: string) {
  const side = SIDE_INPUTS.filter((input) => input.batchId === batchId).reduce((sum, input) => sum + input.volumeL, 0)
  return transfersInto(batchId).reduce((sum, transfer) => sum + transfer.volumeL, 0) + side
}

/**
 * Share of each downstream batch that originates from the source batch,
 * propagated proportionally by volume through every mix and split.
 */
export function contributionShares(sourceBatchId: string) {
  const lineage = descendants(sourceBatchId)
  const shares = new Map<string, number>([[sourceBatchId, 1]])
  const ordered = [...lineage.transfers].sort((a, b) => a.time - b.time)
  // Repeat until stable so a later-timed upstream transfer still propagates
  for (let pass = 0; pass < ordered.length; pass++) {
    let changed = false
    for (const batch of lineage.batches) {
      if (batch.id === sourceBatchId) continue
      const total = inflowL(batch.id)
      const share = transfersInto(batch.id).reduce((sum, transfer) => sum + (shares.get(transfer.fromBatch) ?? 0) * transfer.volumeL, 0)
      const next = total > 0 ? share / total : 0
      if (Math.abs((shares.get(batch.id) ?? 0) - next) > 1e-9) {
        shares.set(batch.id, next)
        changed = true
      }
    }
    if (!changed) break
  }
  return shares
}

export function farmOfTanker(batch: Batch) {
  return DELIVERIES.find((delivery) => delivery.id === batch.deliveryId)?.farmId
}

/** MASS_BALANCE for one batch: opening + inflow = closing + output + co-product + loss/variance */
export function massBalance(batchId: string) {
  const inflow = inflowL(batchId)
  const outgoing = transfersOutOf(batchId)
  const output = outgoing.filter((transfer) => transfer.type !== 'co-product').reduce((sum, transfer) => sum + transfer.volumeL, 0)
  const coProduct = outgoing.filter((transfer) => transfer.type === 'co-product').reduce((sum, transfer) => sum + transfer.volumeL, 0)
  const batch = batchIndex.get(batchId)
  const state = batch ? getAssetState(batch.assetId) : undefined
  const opening = batch?.kind === 'tanker' ? batch.volumeL : 0
  const stillOnTruck = batch?.kind === 'tanker' && outgoing.length === 0
  const closing = stillOnTruck ? opening : state?.batchId === batchId ? state.volumeL ?? 0 : 0
  return { opening, inflow, output, coProduct, closing, variance: opening + inflow - output - coProduct - closing }
}
