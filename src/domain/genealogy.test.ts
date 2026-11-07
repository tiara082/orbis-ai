import { describe, expect, it } from 'vitest'
import { BATCHES, DELIVERIES, SIDE_INPUTS, TRANSFERS } from '../data/scenario'
import { createScenarioTraceabilitySnapshot, createTraceabilitySnapshot } from '../data/traceability'
import { ancestors, contributionShares, descendants, farmOfTanker, getBatch, inflowL, transfersInto, transfersOutOf } from './genealogy'

describe('genealogy traceability snapshot boundary', () => {
  const snapshot = createScenarioTraceabilitySnapshot('genealogy-a')

  it('reads batches and transfers from the supplied snapshot', () => {
    const custom = createTraceabilitySnapshot({
      batches: [{ ...BATCHES[0], id: 'CUSTOM-BATCH' }],
      transfers: [{ ...TRANSFERS[0], fromBatch: 'CUSTOM-BATCH', toBatch: 'CUSTOM-TARGET', path: [...TRANSFERS[0].path] }],
      sideInputs: [],
      deliveryOrigins: [],
      identity: 'custom'
    })

    expect(getBatch('CUSTOM-BATCH', custom)?.id).toBe('CUSTOM-BATCH')
    expect(getBatch(BATCHES[0].id, custom)).toBeUndefined()
    expect(transfersInto('CUSTOM-TARGET', custom)).toHaveLength(1)
    expect(transfersOutOf('CUSTOM-BATCH', custom)).toHaveLength(1)
  })

  it('isolates ancestors and descendants between snapshots', () => {
    const reduced = createTraceabilitySnapshot({ batches: snapshot.batches.slice(0, 2), transfers: snapshot.transfers.slice(0, 1), sideInputs: [], deliveryOrigins: [], identity: 'reduced' })
    expect(ancestors('RMT01-1030', snapshot).batches.map((batch) => batch.id)).toContain('RT-A01-1030')
    expect(descendants('RT-A01-1030', snapshot).batches.map((batch) => batch.id)).toContain('RMT01-1030')
    expect(ancestors('RMT01-1030', reduced).batches.map((batch) => batch.id)).toContain('RT-A01-1030')
    expect(descendants('RT-A01-1030', reduced).batches.map((batch) => batch.id)).toEqual(['RT-A01-1030'])
  })

  it('preserves split and multi-source transfer behavior', () => {
    expect(transfersOutOf('RT-A02-1030', snapshot).map((transfer) => transfer.toBatch)).toEqual(['RMT01-1030', 'RMT02-1030'])
    expect(transfersInto('SEP1-1030', snapshot).map((transfer) => transfer.fromBatch)).toEqual(['RMT01-1030', 'RMT02-1030'])
  })

  it('uses snapshot side inputs and transfer volumes for inflow and contribution shares', () => {
    expect(inflowL('MIX01-1030', snapshot)).toBe(10000)
    expect(contributionShares('RT-A01-1030', snapshot).get('RMT01-1030')).toBeCloseTo(10000 / 15000)
    const withoutSideInput = createTraceabilitySnapshot({ batches: snapshot.batches, transfers: snapshot.transfers, sideInputs: [], deliveryOrigins: snapshot.deliveryOrigins, identity: 'without-side-input' })
    expect(inflowL('MIX01-1030', withoutSideInput)).toBe(9000)
  })

  it('resolves tanker origin from snapshot delivery provenance', () => {
    const changed = createTraceabilitySnapshot({ batches: snapshot.batches, transfers: snapshot.transfers, sideInputs: snapshot.sideInputs, deliveryOrigins: snapshot.deliveryOrigins.map((origin) => origin.deliveryId === 'TRK-A01' ? { ...origin, farmId: 'FARM-CHANGED', destinations: origin.destinations.map((destination) => ({ ...destination })) } : { ...origin, destinations: origin.destinations.map((destination) => ({ ...destination })) }), identity: 'changed-origin' })
    const tanker = BATCHES.find((batch) => batch.deliveryId === 'TRK-A01')!
    expect(farmOfTanker(tanker, changed)).toBe('FARM-CHANGED')
    expect(farmOfTanker(tanker, snapshot)).toBe(DELIVERIES.find((delivery) => delivery.id === tanker.deliveryId)?.farmId)
  })

  it('keeps legacy callers working through the compatibility path', () => {
    expect(getBatch(BATCHES[0].id)?.id).toBe(BATCHES[0].id)
    expect(transfersInto('RMT01-1030')).toHaveLength(2)
    expect(farmOfTanker(BATCHES[0])).toBe(DELIVERIES[0].farmId)
    expect(SIDE_INPUTS[0].batchId).toBe('MIX01-1030')
  })
})
