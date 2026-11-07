import { getAssetState, type Batch, type Transfer } from '../data/scenario'
import { createScenarioTraceabilitySnapshot, type TraceabilitySnapshot } from '../data/traceability'

/** Legacy fallback for callers that have not migrated to an explicit snapshot. */
function compatibilitySnapshot(): TraceabilitySnapshot {
  return createScenarioTraceabilitySnapshot('scenario-compatibility')
}

function batchIndex(snapshot: TraceabilitySnapshot) {
  return new Map(snapshot.batches.map((batch) => [batch.id, batch]))
}

export const getBatch = (id: string, snapshot?: TraceabilitySnapshot) => batchIndex(snapshot ?? compatibilitySnapshot()).get(id)

export const transfersInto = (batchId: string, snapshot?: TraceabilitySnapshot) => (snapshot ?? compatibilitySnapshot()).transfers.filter((transfer) => transfer.toBatch === batchId)
export const transfersOutOf = (batchId: string, snapshot?: TraceabilitySnapshot) => (snapshot ?? compatibilitySnapshot()).transfers.filter((transfer) => transfer.fromBatch === batchId)

export interface Lineage {
  batches: Batch[]
  transfers: Transfer[]
}

function walk(startId: string, direction: 'up' | 'down', snapshot: TraceabilitySnapshot): Lineage {
  const index = batchIndex(snapshot)
  const seen = new Set<string>([startId])
  const transfers: Transfer[] = []
  const queue = [startId]
  while (queue.length) {
    const id = queue.shift() as string
    const edges = direction === 'up' ? transfersInto(id, snapshot) : transfersOutOf(id, snapshot)
    for (const edge of edges) {
      if (!transfers.includes(edge)) transfers.push(edge)
      const next = direction === 'up' ? edge.fromBatch : edge.toBatch
      if (!seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }
  return { batches: [...seen].map((id) => index.get(id)).filter((b): b is Batch => Boolean(b)), transfers }
}

/** Backward trace: everything the batch was made from, back to the farm boundary */
export const ancestors = (batchId: string, snapshot?: TraceabilitySnapshot) => walk(batchId, 'up', snapshot ?? compatibilitySnapshot())

/** Forward trace: everything made from the batch, up to finished goods */
export const descendants = (batchId: string, snapshot?: TraceabilitySnapshot) => walk(batchId, 'down', snapshot ?? compatibilitySnapshot())

/** Total recorded inflow of a batch, including side inputs such as premix */
export function inflowL(batchId: string, snapshot?: TraceabilitySnapshot) {
  const source = snapshot ?? compatibilitySnapshot()
  const side = source.sideInputs.filter((input) => input.batchId === batchId).reduce((sum, input) => sum + input.volumeL, 0)
  return transfersInto(batchId, source).reduce((sum, transfer) => sum + transfer.volumeL, 0) + side
}

/**
 * Share of each downstream batch that originates from the source batch,
 * propagated proportionally by volume through every mix and split.
 */
export function contributionShares(sourceBatchId: string, snapshot?: TraceabilitySnapshot) {
  const source = snapshot ?? compatibilitySnapshot()
  const lineage = descendants(sourceBatchId, source)
  const shares = new Map<string, number>([[sourceBatchId, 1]])
  const ordered = [...lineage.transfers].sort((a, b) => a.time - b.time)
  // Repeat until stable so a later-timed upstream transfer still propagates
  for (let pass = 0; pass < ordered.length; pass++) {
    let changed = false
    for (const batch of lineage.batches) {
      if (batch.id === sourceBatchId) continue
      const total = inflowL(batch.id, source)
      const share = transfersInto(batch.id, source).reduce((sum, transfer) => sum + (shares.get(transfer.fromBatch) ?? 0) * transfer.volumeL, 0)
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

export function farmOfTanker(batch: Batch, snapshot?: TraceabilitySnapshot) {
  return (snapshot ?? compatibilitySnapshot()).deliveryOrigins.find((origin) => origin.deliveryId === batch.deliveryId)?.farmId
}

export type HistoricalQuantity = { status: 'known'; value: number } | { status: 'unavailable' }

export interface HistoricalMassBalance {
  opening: HistoricalQuantity
  inflow: HistoricalQuantity
  output: HistoricalQuantity
  coProduct: HistoricalQuantity
  closing: HistoricalQuantity
  variance: HistoricalQuantity
}

const known = (value: number): HistoricalQuantity => ({ status: 'known', value })
const unavailable = (): HistoricalQuantity => ({ status: 'unavailable' })

/** Historical mass balance. Current asset state is intentionally not consulted. */
export function historicalMassBalance(batchId: string, snapshot?: TraceabilitySnapshot): HistoricalMassBalance {
  const source = snapshot ?? compatibilitySnapshot()
  const index = batchIndex(source)
  const inflow = inflowL(batchId, source)
  const outgoing = transfersOutOf(batchId, source)
  const output = outgoing.filter((transfer) => transfer.type !== 'co-product').reduce((sum, transfer) => sum + transfer.volumeL, 0)
  const coProduct = outgoing.filter((transfer) => transfer.type === 'co-product').reduce((sum, transfer) => sum + transfer.volumeL, 0)
  const batch = index.get(batchId)
  const opening = batch?.kind === 'tanker' ? known(batch.volumeL) : unavailable()
  // No outgoing transfer does not prove that the historical volume remained in the tanker.
  const closing = unavailable()
  const variance = opening.status === 'known' && closing.status === 'known'
      ? known(opening.value + inflow - output - coProduct - closing.value)
    : unavailable()
  return { opening, inflow: known(inflow), output: known(output), coProduct: known(coProduct), closing, variance }
}

/** Legacy compatibility API; retains current-state closing semantics for existing callers. */
export function massBalance(batchId: string, snapshot?: TraceabilitySnapshot) {
  const source = snapshot ?? compatibilitySnapshot()
  const index = batchIndex(source)
  const inflow = inflowL(batchId, source)
  const outgoing = transfersOutOf(batchId, source)
  const output = outgoing.filter((transfer) => transfer.type !== 'co-product').reduce((sum, transfer) => sum + transfer.volumeL, 0)
  const coProduct = outgoing.filter((transfer) => transfer.type === 'co-product').reduce((sum, transfer) => sum + transfer.volumeL, 0)
  const batch = index.get(batchId)
  const state = batch ? getAssetState(batch.assetId) : undefined
  const opening = batch?.kind === 'tanker' ? batch.volumeL : 0
  const stillOnTruck = batch?.kind === 'tanker' && outgoing.length === 0
  const closing = stillOnTruck ? opening : state?.batchId === batchId ? state.volumeL ?? 0 : 0
  return { opening, inflow, output, coProduct, closing, variance: opening + inflow - output - coProduct - closing }
}
