import { describe, expect, it } from 'vitest'
import { BATCHES, DELIVERIES, SIDE_INPUTS, TRANSFERS } from './scenario'
import { createScenarioTraceabilitySnapshot, createTraceabilitySnapshot } from './traceability'

describe('traceability snapshot factory', () => {
  it('creates evidence from scenario data and preserves split destinations', () => {
    const snapshot = createScenarioTraceabilitySnapshot('trace-v1', '2026-10-30')
    const origin = snapshot.deliveryOrigins.find((item) => item.deliveryId === 'TRK-A02')

    expect(snapshot.batches).toHaveLength(BATCHES.length)
    expect(snapshot.transfers).toHaveLength(TRANSFERS.length)
    expect(snapshot.sideInputs).toHaveLength(SIDE_INPUTS.length)
    expect(origin?.destinations).toEqual(DELIVERIES.find((item) => item.id === 'TRK-A02')?.destinations)
  })

  it('defensively copies source and nested evidence', () => {
    const sourceBatch = { ...BATCHES[0] }
    const sourceTransfer = { ...TRANSFERS[0], path: [...TRANSFERS[0].path] }
    const sourceSideInput = { ...SIDE_INPUTS[0] }
    const sourceOrigin = { deliveryId: 'D', farmId: 'F', destinations: [{ tankId: 'T', volumeL: 10 }] }
    const snapshot = createTraceabilitySnapshot({ batches: [sourceBatch], transfers: [sourceTransfer], sideInputs: [sourceSideInput], deliveryOrigins: [sourceOrigin], identity: 'copy' })

    sourceBatch.volumeL = 1
    sourceTransfer.path[0] = 'CHANGED'
    sourceSideInput.volumeL = 1
    sourceOrigin.destinations[0].volumeL = 1

    expect(snapshot.batches[0].volumeL).not.toBe(1)
    expect(snapshot.transfers[0].path[0]).not.toBe('CHANGED')
    expect(snapshot.sideInputs[0].volumeL).not.toBe(1)
    expect(snapshot.deliveryOrigins[0].destinations[0].volumeL).toBe(10)
  })

  it('freezes the snapshot and keeps identities and optional dates distinct', () => {
    const first = createScenarioTraceabilitySnapshot('trace-v1')
    const second = createScenarioTraceabilitySnapshot('trace-v2', '2026-10-30')

    expect(first.identity).toBe('trace-v1')
    expect(second.identity).toBe('trace-v2')
    expect(first.sourceDate).toBeUndefined()
    expect(Object.isFrozen(first)).toBe(true)
    expect(Object.isFrozen(first.transfers[0])).toBe(true)
    expect(Object.isFrozen(first.transfers[0].path)).toBe(true)
    expect(Object.isFrozen(first.deliveryOrigins[0].destinations)).toBe(true)
    expect(() => ((first.transfers[0].path as string[])[0] = 'CHANGED')).toThrow()
  })

  it('does not mutate scenario sources during creation', () => {
    const beforePath = [...TRANSFERS[0].path]
    const beforeDestinations = DELIVERIES[1].destinations.map((destination) => ({ ...destination }))

    createScenarioTraceabilitySnapshot('trace-source-check')

    expect(TRANSFERS[0].path).toEqual(beforePath)
    expect(DELIVERIES[1].destinations).toEqual(beforeDestinations)
  })
})