import { describe, expect, it } from 'vitest'
import { SCENARIO_AUDIT_EVENTS, type AuditEvent } from './scenario'
import { buildAuditIntegrity, canonicalAuditEvent, orderAuditEvents, verifyAuditIntegrity, type SourceAuditEvent } from './audit-integrity'

const event = (id: string, time: number, source: SourceAuditEvent['source'], ruleId?: string): SourceAuditEvent => ({ source, event: { id, time, actor: 'Tester', action: 'transfer', entity: id, ...(ruleId ? { ruleId } : {}) } })

describe('audit integrity core', () => {
  it('orders by time, source, then stable id', () => {
    expect(orderAuditEvents([event('B', 1, 'planning-session'), event('A', 1, 'scenario'), event('C', 1, 'scenario')]).map((item) => `${item.source}:${item.event.id}`)).toEqual(['scenario:A', 'scenario:C', 'planning-session:B'])
  })

  it('canonicalizes optional ruleId consistently', () => {
    const withoutRule = { ...event('A', 1, 'scenario'), sequence: 0 }
    const withNull = { ...withoutRule, previousDigest: undefined }
    expect(canonicalAuditEvent(withoutRule)).toBe(canonicalAuditEvent(withNull))
    expect(canonicalAuditEvent(withoutRule)).toContain('"ruleId":null')
  })

  it('builds and verifies a mixed SHA-256 chain', async () => {
    const result = await buildAuditIntegrity([event('B', 2, 'planning-session'), event('A', 1, 'scenario')])
    expect(result.status).toBe('consistent')
    expect(result.records).toHaveLength(2)
    expect(result.records[1].previousDigest).toBe(result.records[0].digest)
    expect((await verifyAuditIntegrity(result)).status).toBe('consistent')
  })

  it('detects event, digest, and previous-link changes', async () => {
    const result = await buildAuditIntegrity([event('A', 1, 'scenario'), event('B', 2, 'planning-session')])
    const eventChanged = structuredClone(result)
    eventChanged.records[0].event.entity = 'changed'
    expect((await verifyAuditIntegrity(eventChanged)).status).toBe('broken')
    const digestChanged = structuredClone(result) as any
    digestChanged.records[0].digest = '00'
    expect((await verifyAuditIntegrity(digestChanged)).status).toBe('broken')
    const linkChanged = structuredClone(result) as any
    linkChanged.records[1].previousDigest = '00'
    expect((await verifyAuditIntegrity(linkChanged)).status).toBe('broken')
  })

  it('returns unavailable for empty input and preserves original events', async () => {
    expect((await buildAuditIntegrity([])).status).toBe('unavailable')
    const original: AuditEvent = SCENARIO_AUDIT_EVENTS[0]
    const result = await buildAuditIntegrity([{ source: 'scenario', event: original }])
    const copied = structuredClone(result) as any
    copied.records[0].event.entity = 'attempted mutation'
    expect(original.entity).not.toBe('attempted mutation')
  })

  it('returns unavailable when Web Crypto is unavailable', async () => {
    const original = globalThis.crypto
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined })
    try {
      await expect(buildAuditIntegrity([event('A', 1, 'scenario')])).resolves.toMatchObject({ status: 'unavailable' })
    } finally {
      Object.defineProperty(globalThis, 'crypto', { configurable: true, value: original })
    }
  })
})
