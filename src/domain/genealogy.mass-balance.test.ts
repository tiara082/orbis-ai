import { describe, expect, it } from 'vitest'
import { ASSET_STATES, BATCHES, TRANSFERS } from '../data/scenario'
import { createScenarioTraceabilitySnapshot, createTraceabilitySnapshot } from '../data/traceability'
import { historicalMassBalance, massBalance } from './genealogy'

describe('historical mass balance boundary', () => {
  it('returns historical opening, inflow, output, and co-product values', () => {
    const snapshot = createScenarioTraceabilitySnapshot('mass-balance')
    const result = historicalMassBalance('SEP1-1030', snapshot)

    expect(result.opening.status).toBe('unavailable')
    expect(result.inflow).toEqual({ status: 'known', value: 20600 })
    expect(result.output).toEqual({ status: 'known', value: 20000 })
    expect(result.coProduct).toEqual({ status: 'known', value: 600 })
    expect(result.closing.status).toBe('unavailable')
    expect(result.variance.status).toBe('unavailable')
  })

  it('does not use current asset volume for historical closing or variance', () => {
    const snapshot = createScenarioTraceabilitySnapshot('mass-balance-isolation')
    const before = historicalMassBalance('SEP1-1030', snapshot)
    const state = ASSET_STATES.find((item) => item.batchId === 'SEP1-1030')
    if (state) state.volumeL = (state.volumeL ?? 0) + 999999

    expect(historicalMassBalance('SEP1-1030', snapshot)).toEqual(before)
    expect(before.closing).toEqual({ status: 'unavailable' })
    expect(before.variance).toEqual({ status: 'unavailable' })
  })

  it('does not infer tanker closing from the absence of outgoing transfers', () => {
    const snapshot = createScenarioTraceabilitySnapshot('tanker-closing')
    const result = historicalMassBalance('RT-A03-1030', snapshot)

    expect(result.opening).toEqual({ status: 'known', value: 10500 })
    expect(result.output).toEqual({ status: 'known', value: 0 })
    expect(result.closing).toEqual({ status: 'unavailable' })
    expect(result.variance).toEqual({ status: 'unavailable' })
  })

  it('isolates historical results between snapshots', () => {
    const base = createScenarioTraceabilitySnapshot('mass-a')
    const changed = createTraceabilitySnapshot({
      batches: base.batches,
      transfers: base.transfers.filter((transfer) => transfer.id !== 'TR-09'),
      sideInputs: base.sideInputs,
      deliveryOrigins: base.deliveryOrigins,
      identity: 'mass-b'
    })

    expect(historicalMassBalance('SEP1-1030', base).coProduct).toEqual({ status: 'known', value: 600 })
    expect(historicalMassBalance('SEP1-1030', changed).coProduct).toEqual({ status: 'known', value: 0 })
  })

  it('keeps the legacy massBalance compatibility API available', () => {
    const result = massBalance(BATCHES[0].id)
    expect(result).toHaveProperty('variance')
    expect(TRANSFERS.length).toBeGreaterThan(0)
  })

  it('keeps explicit historical mass balance independent from the legacy compatibility path', () => {
    const snapshot = createScenarioTraceabilitySnapshot('historical-explicit')
    expect(historicalMassBalance('RT-A03-1030', snapshot).closing).toEqual({ status: 'unavailable' })
    expect(massBalance('RT-A03-1030').closing).toBe(10500)
  })
})