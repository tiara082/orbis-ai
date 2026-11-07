import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CURRENT_USER } from '../config/alerts'
import { ASSET_STATES, BAYS, DELIVERIES, LAB_RECORDS, PRODUCTION_ORDERS, SCENARIO, type AuditEvent } from '../data/scenario'
import { useCatalog } from './catalog'
import { runPlanChecks, type CheckResult } from '../domain/checks'
import { buildPlan, DEFAULT_CONFIG, type Plan, type PlanConfig, type PlanDependencies } from '../domain/plan'
import { at, type Minutes } from '../domain/time'

export type RevisionStatus = 'approved' | 'pending approval' | 'rejected' | 'superseded'

export interface PlanRevision {
  id: string
  version: number
  config: PlanConfig
  generatedAt: Minutes
  generatedBy: string
  status: RevisionStatus
  decidedAt?: Minutes
  decidedBy?: string
  note?: string
  plan?: Plan
  diagnostics?: CheckResult[]
  catalogVersion: number
  operationalIdentity: string
  inputIdentity: string
}

interface PlanningContextValue {
  config: PlanConfig
  updateConfig: (update: (config: PlanConfig) => PlanConfig) => void
  resetConfig: () => void
  /** Config differs from the approved revision */
  configChanged: boolean
  revisions: PlanRevision[]
  activeRevision: PlanRevision
  pendingRevision?: PlanRevision
  activePlan: Plan
  previewPlan: Plan
  pendingPlan?: Plan
  generate: () => PlanRevision
  approve: (note?: string) => void
  reject: (reason: string) => void
  events: AuditEvent[]
}

const PlanningContext = createContext<PlanningContextValue | null>(null)

function plantNow(): Minutes {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false })
    .format(new Date())
    .split(':')
    .map(Number)
  return parts[0] * 60 + parts[1]
}

function identity(value: unknown): string {
  return JSON.stringify(value)
}

function freezeSnapshot<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value)
    for (const child of Object.values(value as Record<string, unknown>)) freezeSnapshot(child)
  }
  return value
}

export function revisionDiagnostics(revision: PlanRevision, fallbackPlan?: Plan): CheckResult[] {
  return revision.diagnostics ?? (fallbackPlan ? runPlanChecks(fallbackPlan) : [])
}

export function revisionSnapshot(plan: Plan, dependencies: PlanDependencies) {
  const frozenPlan = freezeSnapshot(structuredClone(plan))
  const diagnostics = freezeSnapshot(structuredClone(runPlanChecks(frozenPlan)))
  return {
    plan: frozenPlan,
    diagnostics,
    catalogVersion: 'version' in dependencies.catalog ? dependencies.catalog.version : 0,
    operationalIdentity: identity(dependencies.operational),
    inputIdentity: identity({ config: plan, catalog: dependencies.catalog, operational: dependencies.operational })
  }
}

const INITIAL_REVISION: PlanRevision = {
  id: 'PLAN-1030-v1',
  version: 1,
  config: DEFAULT_CONFIG,
  generatedAt: at('06:10'),
  generatedBy: CURRENT_USER.name,
  status: 'approved',
  decidedAt: at('06:30'),
  decidedBy: CURRENT_USER.name,
  catalogVersion: 0,
  operationalIdentity: identity({}),
  inputIdentity: identity(DEFAULT_CONFIG)
}

const INITIAL_EVENTS: AuditEvent[] = [
  { id: 'PL-001', time: at('06:10'), actor: CURRENT_USER.name, action: 'planGenerated', entity: INITIAL_REVISION.id },
  { id: 'PL-002', time: at('06:30'), actor: CURRENT_USER.name, action: 'planApproved', entity: INITIAL_REVISION.id }
]

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const catalogSnapshot = useCatalog()
  const [config, setConfig] = useState<PlanConfig>(DEFAULT_CONFIG)
  const [revisions, setRevisions] = useState<PlanRevision[]>([INITIAL_REVISION])
  const [events, setEvents] = useState<AuditEvent[]>(INITIAL_EVENTS)

  const activeRevision = useMemo(() => [...revisions].reverse().find((r) => r.status === 'approved') ?? INITIAL_REVISION, [revisions])
  const pendingRevision = useMemo(() => revisions.find((r) => r.status === 'pending approval'), [revisions])

  const log = useCallback((action: string, entity: string, note?: string) => {
    setEvents((current) => [
      ...current,
      { id: `PL-${String(current.length + 1).padStart(3, '0')}`, time: plantNow(), actor: CURRENT_USER.name, action, entity: note ? `${entity} · ${note}` : entity }
    ])
  }, [])

  const updateConfig = useCallback((update: (config: PlanConfig) => PlanConfig) => setConfig((current) => update(current)), [])

  const resetConfig = useCallback(() => setConfig(activeRevision.config), [activeRevision])

  const planningDependencies = useMemo(
    () => ({ catalog: catalogSnapshot, operational: { orders: PRODUCTION_ORDERS, assetStates: ASSET_STATES, deliveries: DELIVERIES, labRecords: LAB_RECORDS, bays: BAYS, snapshot: SCENARIO.snapshot } }),
    [catalogSnapshot]
  )

  const generate = useCallback(() => {
    const version = revisions.length + 1
    const generatedPlan = buildPlan(config, undefined, planningDependencies)
    const snapshot = revisionSnapshot(generatedPlan, planningDependencies)
    const revision: PlanRevision = {
      id: `PLAN-1030-v${version}`,
      version,
      config: structuredClone(config),
      generatedAt: plantNow(),
      generatedBy: CURRENT_USER.name,
      status: 'pending approval',
      ...snapshot
    }
    setRevisions((current) => [
      ...current.map((r) => (r.status === 'pending approval' ? { ...r, status: 'superseded' as const } : r)),
      revision
    ])
    log('planGenerated', revision.id)
    return revision
  }, [config, planningDependencies, revisions.length, log])

  const decide = useCallback(
    (status: 'approved' | 'rejected', note?: string) => {
      if (!pendingRevision) return
      setRevisions((current) =>
        current.map((r) => {
          if (r.id === pendingRevision.id) return { ...r, status, decidedAt: plantNow(), decidedBy: CURRENT_USER.name, note }
          if (status === 'approved' && r.status === 'approved') return { ...r, status: 'superseded' as const }
          return r
        })
      )
      log(status === 'approved' ? 'planApproved' : 'planRejected', pendingRevision.id, note)
    },
    [pendingRevision, log]
  )

  const activePlan = useMemo(() => activeRevision.plan ?? buildPlan(activeRevision.config, undefined, planningDependencies), [activeRevision, planningDependencies])
  const previewPlan = useMemo(() => buildPlan(config, undefined, planningDependencies), [config, planningDependencies])
  const pendingPlan = useMemo(() => (pendingRevision ? pendingRevision.plan ?? buildPlan(pendingRevision.config, undefined, planningDependencies) : undefined), [pendingRevision, planningDependencies])
  const configChanged = useMemo(() => JSON.stringify(config) !== JSON.stringify(activeRevision.config), [config, activeRevision])

  const value = useMemo<PlanningContextValue>(
    () => ({
      config,
      updateConfig,
      resetConfig,
      configChanged,
      revisions,
      activeRevision,
      pendingRevision,
      activePlan,
      previewPlan,
      pendingPlan,
      generate,
      approve: (note?: string) => decide('approved', note),
      reject: (reason: string) => decide('rejected', reason),
      events
    }),
    [config, updateConfig, resetConfig, configChanged, revisions, activeRevision, pendingRevision, activePlan, previewPlan, pendingPlan, generate, decide, events]
  )

  return <PlanningContext.Provider value={value}>{children}</PlanningContext.Provider>
}

export function usePlanning(): PlanningContextValue {
  const ctx = useContext(PlanningContext)
  if (!ctx) throw new Error('usePlanning must be used inside PlanningProvider')
  return ctx
}
