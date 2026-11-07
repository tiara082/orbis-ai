import { describe, expect, it } from 'vitest'
import { BAYS, DELIVERIES, LAB_RECORDS } from '../data/scenario'
import { createPlanningFixture } from './__fixtures__/planning.fixture'
import { bayStates, delayMin, deliveryStatus, labOf } from './receiving'

describe('receiving operational dependency boundary', () => {
  it('uses delivery and lab records from the supplied snapshot', () => {
    const fixture = createPlanningFixture()
    const delivery = { id: 'TEST-DELIVERY', farmId: 'TEST-FARM', truckCapacityL: 100, departure: 0, eta: 10, volumeL: 100, arrival: 20, unloadStart: 25, unloadEnd: undefined, bayId: 'BAY-01', destinations: [] }
    const dependencies = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, deliveries: [delivery], labRecords: [{ deliveryId: delivery.id, sampleId: 'TEST-SAMPLE', samplingStart: 0, samplingEnd: 1, labStart: 1, result: 'awaiting result' as const, qcStatus: 'Rejected' as const, releaseTime: 0 }] } }
    expect(deliveryStatus(delivery, dependencies)).toBe('rejected')
    expect(delayMin({ ...delivery, arrival: undefined }, { ...dependencies, operational: { ...dependencies.operational, snapshot: 30 } })).toBe(20)
  })

  it('uses supplied bays, deliveries, and snapshot time for bay state', () => {
    const fixture = createPlanningFixture()
    const dependencies = { ...fixture.dependencies, operational: { ...fixture.dependencies.operational, bays: [{ bayId: 'TEST-BAY', active: true, pumpFlowLph: 100, cipMinutes: 10, tankersPerBay: 1 }], deliveries: [], snapshot: 50 } }
    expect(bayStates(undefined, dependencies)).toHaveLength(1)
    expect(bayStates(undefined, dependencies)[0].bay.bayId).toBe('TEST-BAY')
  })

  it('keeps legacy lab lookup and delivery status on scenario data without dependencies', () => {
    const delivery = DELIVERIES.find((item) => item.id === LAB_RECORDS[0].deliveryId) ?? DELIVERIES[0]
    expect(labOf(delivery.id)).toEqual(LAB_RECORDS.find((record) => record.deliveryId === delivery.id))
    expect(deliveryStatus(delivery)).toBe(delivery.arrival === undefined ? 'on the way' : delivery.unloadEnd !== undefined ? 'stored' : 'lab pending')
  })

  it('keeps legacy delay and bay state on scenario defaults without dependencies', () => {
    const incoming = DELIVERIES.find((delivery) => delivery.arrival === undefined)
    expect(incoming).toBeDefined()
    expect(delayMin(incoming!)).toBeUndefined()
    expect(bayStates()).toHaveLength(BAYS.length)
  })
})
