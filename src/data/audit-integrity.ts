import type { AuditEvent } from './scenario'

export type AuditEventSource = 'scenario' | 'planning-session'
export type IntegrityStatus = 'consistent' | 'broken' | 'unavailable'

export interface SourceAuditEvent {
  readonly source: AuditEventSource
  readonly event: AuditEvent
}

export interface AuditIntegrityRecord {
  readonly source: AuditEventSource
  readonly event: AuditEvent
  readonly sequence: number
  readonly previousDigest?: string
  readonly digest: string
}

export interface AuditIntegrityResult {
  readonly status: IntegrityStatus
  readonly records: readonly AuditIntegrityRecord[]
  readonly checkedCount: number
  readonly reason?: string
}

const sourceOrder: Record<AuditEventSource, number> = {
  scenario: 0,
  'planning-session': 1
}

export function orderAuditEvents(events: readonly SourceAuditEvent[]): SourceAuditEvent[] {
  return events
    .map((item) => ({ source: item.source, event: { ...item.event } }))
    .sort((a, b) => a.event.time - b.event.time || sourceOrder[a.source] - sourceOrder[b.source] || a.event.id.localeCompare(b.event.id))
}

export function canonicalAuditEvent(record: Omit<AuditIntegrityRecord, 'digest'>): string {
  return JSON.stringify({
    source: record.source,
    id: record.event.id,
    time: record.event.time,
    actor: record.event.actor,
    action: record.event.action,
    entity: record.event.entity,
    ruleId: record.event.ruleId ?? null,
    sequence: record.sequence,
    previousDigest: record.previousDigest ?? null
  })
}

function cryptoDigest(): SubtleCrypto | undefined {
  return typeof globalThis.crypto?.subtle?.digest === 'function' ? globalThis.crypto.subtle : undefined
}

async function sha256(value: string): Promise<string> {
  const subtle = cryptoDigest()
  if (!subtle) throw new Error('Web Crypto SHA-256 is unavailable')
  const bytes = new TextEncoder().encode(value)
  const digest = await subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function freeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as Record<string, unknown>)) freeze(child)
  }
  return value
}

export async function buildAuditIntegrity(events: readonly SourceAuditEvent[]): Promise<AuditIntegrityResult> {
  if (events.length === 0) return freeze({ status: 'unavailable', records: [], checkedCount: 0, reason: 'No audit events available' })
  if (!cryptoDigest()) return freeze({ status: 'unavailable', records: [], checkedCount: 0, reason: 'Web Crypto SHA-256 is unavailable' })
  const ordered = orderAuditEvents(events)
  const records: AuditIntegrityRecord[] = []
  let previousDigest: string | undefined
  for (const [sequence, item] of ordered.entries()) {
    const unsigned = { source: item.source, event: item.event, sequence, previousDigest }
    const digest = await sha256(canonicalAuditEvent(unsigned))
    records.push({ ...unsigned, digest })
    previousDigest = digest
  }
  return freeze({ status: 'consistent', records, checkedCount: records.length })
}

export async function verifyAuditIntegrity(result: AuditIntegrityResult): Promise<AuditIntegrityResult> {
  if (result.records.length === 0) return freeze({ status: 'unavailable', records: [], checkedCount: 0, reason: 'No audit events available' })
  if (!cryptoDigest()) return freeze({ status: 'unavailable', records: [...result.records], checkedCount: 0, reason: 'Web Crypto SHA-256 is unavailable' })
  for (let index = 0; index < result.records.length; index++) {
    const record = result.records[index]
    const expectedPrevious = index === 0 ? undefined : result.records[index - 1].digest
    if (record.previousDigest !== expectedPrevious || await sha256(canonicalAuditEvent(record)) !== record.digest) {
      return freeze({ status: 'broken', records: result.records.map((item) => ({ ...item, event: { ...item.event } })), checkedCount: index + 1, reason: `Integrity mismatch at sequence ${record.sequence}` })
    }
  }
  return freeze({ status: 'consistent', records: result.records.map((item) => ({ ...item, event: { ...item.event } })), checkedCount: result.records.length })
}
