import { describe, expect, it } from 'vitest'
import { getSnapshot } from './catalog/repository'
import { createScenarioTraceabilitySnapshot } from './traceability'
import {
  EVIDENCE_SOURCES,
  createCatalogReferenceAdapter,
  createOperationalObservationAdapter,
  createTraceabilityEvidenceAdapter
} from './evidence'
import { ASSET_STATES, BAYS, DELIVERIES, LAB_RECORDS, PRODUCTION_ORDERS, SCENARIO } from './scenario'

describe('evidence adapter contracts', () => {
  it('keeps historical traceability separate and stable', () => {
    const snapshot = createScenarioTraceabilitySnapshot('evidence-test')
    const adapter = createTraceabilityEvidenceAdapter(snapshot)

    expect(adapter.source.kind).toBe('historical-evidence')
    expect(adapter.read()).toBe(snapshot)
    expect(adapter.source.boundary).toContain('TraceabilitySnapshot')
  })

  it('classifies catalog and operational adapters distinctly', () => {
    const catalog = getSnapshot()
    const operational = {
      orders: PRODUCTION_ORDERS,
      assetStates: ASSET_STATES,
      deliveries: DELIVERIES,
      labRecords: LAB_RECORDS,
      bays: BAYS,
      snapshot: SCENARIO.snapshot
    }

    expect(createCatalogReferenceAdapter(catalog).source.kind).toBe('catalog-reference')
    expect(createOperationalObservationAdapter(operational).source.kind).toBe('current-observation')
    expect(EVIDENCE_SOURCES.derived.kind).toBe('derived-result')
    expect(EVIDENCE_SOURCES.compatibility.kind).toBe('compatibility')
  })
})
