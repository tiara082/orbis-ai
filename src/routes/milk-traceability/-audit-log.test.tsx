// @vitest-environment jsdom
import { LanguageProvider } from '../../lib/i18n/LanguageContext'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SCENARIO_AUDIT_EVENTS, type AuditEvent } from '../../data/scenario'
import { buildAuditIntegrity, verifyAuditIntegrity } from '../../data/audit-integrity'
import { AuditLogPage } from './audit-log'

const planningEvents: AuditEvent[] = [{ id: 'PL-TEST', time: 999, actor: 'Planner', action: 'planGenerated', entity: 'PLAN-TEST' }]

vi.mock('../../state/planning', () => ({
  usePlanning: () => ({ events: planningEvents })
}))

vi.mock('../../components/layout/PageHeader', () => ({ PageHeader: () => <h1>Audit log</h1> }))

vi.mock('../../lib/format', () => ({ useFormat: () => ({ time: (value: number) => String(value) }) }))

vi.mock('../../components/common/SourceNote', () => ({ ScenarioNote: () => null }))

vi.mock('../../components/ui/Badge', () => ({ Badge: ({ children, status }: { children?: React.ReactNode; status?: string }) => <span>{children ?? status}</span> }))

vi.mock('../../components/ui/SegmentedFilter', () => ({ SegmentedFilter: ({ options, onChange }: { options: { value: string; label: string }[]; onChange: (value: string) => void }) => <div>{options.map((option) => <button key={option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div> }))

vi.mock('../../components/common/DataTable', () => ({ DataTable: ({ rows, columns, toolbar, searchText }: { rows: AuditEvent[]; columns: { key: string; render?: (row: AuditEvent) => React.ReactNode }[]; toolbar: React.ReactNode; searchText?: (row: AuditEvent) => string }) => <div><div>{toolbar}</div><input aria-label="Search" onChange={(event) => { const query = event.target.value.toLowerCase(); document.querySelectorAll('[data-audit-row]').forEach((node) => { (node as HTMLElement).hidden = !!searchText && !rows.find((row) => node.textContent?.includes(row.id) && searchText(row).toLowerCase().includes(query)) }) }} />{rows.map((row) => <div data-audit-row key={row.id}>{columns.map((column) => <span key={column.key}>{column.render ? column.render(row) : String(row[column.key as keyof AuditEvent] ?? '')}</span>)}</div>)}</div> }))

import type React from 'react'

vi.mock('../../data/audit-integrity', async () => {
  const actual = await vi.importActual<typeof import('../../data/audit-integrity')>('../../data/audit-integrity')
  return { ...actual, buildAuditIntegrity: vi.fn(), verifyAuditIntegrity: vi.fn() }
})

const renderPage = () => render(<LanguageProvider><AuditLogPage /></LanguageProvider>)

beforeEach(() => {
  vi.mocked(buildAuditIntegrity).mockReset()
  vi.mocked(verifyAuditIntegrity).mockReset()
})

describe('AuditLogPage integrity UI', () => {
  it('shows checking before verification and then the consistent count', async () => {
    let resolveBuild!: (value: Awaited<ReturnType<typeof buildAuditIntegrity>>) => void
    const pending = new Promise<Awaited<ReturnType<typeof buildAuditIntegrity>>>((resolve) => { resolveBuild = resolve })
    vi.mocked(buildAuditIntegrity).mockReturnValue(pending)
    const result = { status: 'consistent', records: [], checkedCount: SCENARIO_AUDIT_EVENTS.length + planningEvents.length } as const
    vi.mocked(verifyAuditIntegrity).mockResolvedValue(result)

    renderPage()
    expect(screen.getByText('Checking local integrity')).toBeDefined()
    expect(screen.queryByText('Locally consistent')).toBeNull()
    resolveBuild(result)
    expect(await screen.findByText('Locally consistent')).toBeDefined()
    expect(screen.getByText(`Checked events: ${result.checkedCount}`)).toBeDefined()
  })

  it('renders broken status and its reason', async () => {
    const result = { status: 'broken', records: [], checkedCount: 2, reason: 'Integrity mismatch at sequence 2' } as const
    vi.mocked(buildAuditIntegrity).mockResolvedValue(result)
    vi.mocked(verifyAuditIntegrity).mockResolvedValue(result)
    renderPage()
    expect(await screen.findByText('Integrity check failed')).toBeDefined()
    expect(screen.getByText(result.reason)).toBeDefined()
  })

  it('renders unavailable when verification is unavailable', async () => {
    const result = { status: 'unavailable', records: [], checkedCount: 0, reason: 'Web Crypto SHA-256 is unavailable' } as const
    vi.mocked(buildAuditIntegrity).mockResolvedValue(result)
    vi.mocked(verifyAuditIntegrity).mockResolvedValue(result)
    renderPage()
    expect(await screen.findByText('Integrity unavailable')).toBeDefined()
    expect(screen.queryByText('Locally consistent')).toBeNull()
  })

  it('keeps an older verification result from updating after unmount', async () => {
    let resolveBuild!: (value: Awaited<ReturnType<typeof buildAuditIntegrity>>) => void
    vi.mocked(buildAuditIntegrity).mockReturnValue(new Promise((resolve) => { resolveBuild = resolve }))
    const { unmount } = renderPage()
    unmount()
    resolveBuild({ status: 'consistent', records: [], checkedCount: 1 })
    await Promise.resolve()
    expect(buildAuditIntegrity).toHaveBeenCalledTimes(1)
  })

  it('attributes scenario and planning-session events and filters displayed rows', async () => {
    vi.mocked(buildAuditIntegrity).mockImplementation(async (events) => {
      expect(events.some((item) => item.source === 'scenario' && item.event.id === SCENARIO_AUDIT_EVENTS[0].id)).toBe(true)
      expect(events.some((item) => item.source === 'planning-session' && item.event.id === 'PL-TEST')).toBe(true)
      return { status: 'consistent', records: [], checkedCount: events.length }
    })
    vi.mocked(verifyAuditIntegrity).mockResolvedValue({ status: 'consistent', records: [], checkedCount: 1 })
    const user = userEvent.setup()
    renderPage()
    expect(await screen.findByText('Locally consistent')).toBeDefined()
    const search = screen.getByRole('textbox', { name: 'Search' })
    await user.type(search, 'PL-TEST')
    expect(screen.getByText('PL-TEST')).toBeDefined()
    const scenarioRow = screen.getByText(SCENARIO_AUDIT_EVENTS[0].id).closest('[data-audit-row]')
    expect(scenarioRow).toHaveProperty('hidden', true)
    await user.clear(search)
    await user.click(screen.getByRole('button', { name: /planning/i }))
    expect(screen.getByText('PL-TEST').closest('[data-audit-row]')).toHaveProperty('hidden', false)
    expect(screen.queryByText(SCENARIO_AUDIT_EVENTS[0].id)).toBeNull()
  })
})
