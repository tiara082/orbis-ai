import type { CatalogData, CatalogSnapshot } from './catalog/types'
import type { TraceabilitySnapshot } from './traceability'
import type { PlanDependencies } from '../domain/plan'

/** Classification for data ownership and historical/current semantics. */
export type EvidenceSourceKind =
  | 'scenario-seed'
  | 'historical-evidence'
  | 'current-observation'
  | 'catalog-reference'
  | 'derived-result'
  | 'compatibility'

export interface EvidenceSourceDescriptor {
  readonly id: string
  readonly kind: EvidenceSourceKind
  readonly responsibility: string
  readonly boundary: string
}

/** Minimal adapter contract: domain code consumes a boundary, not a source module. */
export interface EvidenceAdapter<Output> {
  readonly source: EvidenceSourceDescriptor
  read(): Output
}

export interface TraceabilityEvidenceAdapter extends EvidenceAdapter<TraceabilitySnapshot> {
  readonly source: EvidenceSourceDescriptor & { readonly kind: 'historical-evidence' }
}

export interface CatalogReferenceAdapter extends EvidenceAdapter<CatalogSnapshot> {
  readonly source: EvidenceSourceDescriptor & { readonly kind: 'catalog-reference' }
}

export interface OperationalObservationAdapter extends EvidenceAdapter<PlanDependencies['operational']> {
  readonly source: EvidenceSourceDescriptor & { readonly kind: 'current-observation' }
}

export const EVIDENCE_SOURCES = {
  scenario: {
    id: 'scenario-seed',
    kind: 'scenario-seed',
    responsibility: 'Provides synthetic demo inputs and compatibility defaults.',
    boundary: 'src/data/scenario.ts'
  },
  traceability: {
    id: 'traceability-snapshot',
    kind: 'historical-evidence',
    responsibility: 'Provides immutable historical batches, transfers, side inputs, and delivery origins.',
    boundary: 'TraceabilitySnapshot in src/data/traceability.ts'
  },
  operational: {
    id: 'operational-snapshot',
    kind: 'current-observation',
    responsibility: 'Provides current asset, delivery, laboratory, bay, and planning observations.',
    boundary: 'PlanDependencies.operational'
  },
  catalog: {
    id: 'catalog-snapshot',
    kind: 'catalog-reference',
    responsibility: 'Provides current reference metadata and validation rules.',
    boundary: 'CatalogSnapshot in src/data/catalog/types.ts'
  },
  derived: {
    id: 'derived-domain-result',
    kind: 'derived-result',
    responsibility: 'Represents calculated domain output and is not source evidence.',
    boundary: 'Domain functions under src/domain/'
  },
  compatibility: {
    id: 'legacy-compatibility',
    kind: 'compatibility',
    responsibility: 'Preserves behavior for callers not yet migrated to explicit boundaries.',
    boundary: 'Compatibility wrappers in domain modules'
  }
} as const satisfies Record<string, EvidenceSourceDescriptor>

export function createTraceabilityEvidenceAdapter(snapshot: TraceabilitySnapshot): TraceabilityEvidenceAdapter {
  return { source: EVIDENCE_SOURCES.traceability, read: () => snapshot }
}

export function createCatalogReferenceAdapter(snapshot: CatalogSnapshot): CatalogReferenceAdapter {
  return { source: EVIDENCE_SOURCES.catalog, read: () => snapshot }
}

export function createOperationalObservationAdapter(observations: PlanDependencies['operational']): OperationalObservationAdapter {
  return { source: EVIDENCE_SOURCES.operational, read: () => observations }
}

export type ScenarioSeed = {
  readonly catalog: CatalogData
  readonly operational: PlanDependencies['operational']
  readonly traceability: TraceabilitySnapshot
}
