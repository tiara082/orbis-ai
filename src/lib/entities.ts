import { Cylinder, Factory, FlaskConical, Package, Tractor, Truck, type LucideIcon } from 'lucide-react'

export type EntityKind = 'farm' | 'tanker' | 'tank' | 'batch' | 'finished' | 'lab'

export const ENTITY_META: Record<EntityKind, { icon: LucideIcon; label: string }> = {
  farm: { icon: Tractor, label: 'Farm' },
  tanker: { icon: Truck, label: 'Tanker' },
  tank: { icon: Cylinder, label: 'Storage tank' },
  batch: { icon: Factory, label: 'Production batch' },
  finished: { icon: Package, label: 'Finished lot' },
  lab: { icon: FlaskConical, label: 'Lab sample' }
}
