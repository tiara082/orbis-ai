import { BAYS, DELIVERIES, LAB_RECORDS, SCENARIO, type BayConfig, type Delivery } from '../data/scenario'
import type { PlanDependencies } from './plan'
import type { Minutes } from './time'

export type DeliveryStatus = 'on the way' | 'lab pending' | 'rejected' | 'stored' | 'arrived'

export const labOf = (deliveryId: string, dependencies?: PlanDependencies) => (dependencies?.operational.labRecords ?? LAB_RECORDS).find((record) => record.deliveryId === deliveryId)

export function deliveryStatus(delivery: Delivery, dependencies?: PlanDependencies): DeliveryStatus {
  if (delivery.arrival === undefined) return 'on the way'
  const lab = labOf(delivery.id, dependencies)
  if (lab?.qcStatus === 'Rejected') return 'rejected'
  if (delivery.unloadEnd !== undefined) return 'stored'
  if (!lab || lab.qcStatus === 'Pending') return 'lab pending'
  return 'arrived'
}

/** Positive = late against ETA; on-the-way trucks are compared with the snapshot */
export function delayMin(delivery: Delivery, dependencies?: PlanDependencies): number | undefined {
  if (delivery.arrival !== undefined) return delivery.arrival - delivery.eta
  const snapshot = dependencies?.operational.snapshot ?? SCENARIO.snapshot
  return snapshot > delivery.eta ? snapshot - delivery.eta : undefined
}

export const unloadDurationMin = (delivery: Delivery) =>
  delivery.unloadStart !== undefined && delivery.unloadEnd !== undefined ? delivery.unloadEnd - delivery.unloadStart : undefined

/** Unloading time estimated from the bay pump rate */
export const estimatedUnloadMin = (volumeL: number, bay: BayConfig) => (volumeL / bay.pumpFlowLph) * 60

export type BayAvailability = 'available' | 'occupied' | 'cip' | 'maintenance'

export interface BayState {
  bay: BayConfig
  availability: BayAvailability
  current?: Delivery
  lastUnload?: Delivery
  /** Bay is free from this time (end of CIP after the last unload) */
  freeAt?: Minutes
  unloadCount: number
}

export function bayStates(now?: Minutes, dependencies?: PlanDependencies): BayState[] {
  const operational = dependencies?.operational
  const bays = operational?.bays ?? BAYS
  const deliveries = operational?.deliveries ?? DELIVERIES
  const effectiveNow = now ?? operational?.snapshot ?? SCENARIO.snapshot
  return bays.map((bay) => {
    const assigned = deliveries.filter((delivery) => delivery.bayId === bay.bayId)
    const unloaded = assigned.filter((delivery) => delivery.unloadEnd !== undefined).sort((a, b) => (b.unloadEnd ?? 0) - (a.unloadEnd ?? 0))
    const lastUnload = unloaded[0]
    const current = assigned.find((delivery) => delivery.arrival !== undefined && delivery.unloadEnd === undefined)
    const freeAt = lastUnload?.unloadEnd !== undefined ? lastUnload.unloadEnd + bay.cipMinutes : undefined
    const inMaintenance = Boolean(bay.maintenance && effectiveNow >= bay.maintenance.start && effectiveNow < bay.maintenance.end)
    const availability: BayAvailability = !bay.active || inMaintenance
      ? 'maintenance'
      : current
        ? 'occupied'
        : freeAt !== undefined && effectiveNow < freeAt
          ? 'cip'
          : 'available'
    return { bay, availability, current, lastUnload, freeAt, unloadCount: unloaded.length }
  })
}
