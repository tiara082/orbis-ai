import { describe, expect, it } from 'vitest'
import { buildPlan } from '../domain/plan'
import { createPlanningFixture } from '../domain/__fixtures__/planning.fixture'
import { buildPlantAlerts } from './alerts'

function planWithSnapshot(snapshot?: number) {
  const fixture = createPlanningFixture()
  const dependencies = {
    ...fixture.dependencies,
    operational: { ...fixture.dependencies.operational, snapshot }
  }
  return buildPlan(fixture.config, undefined, dependencies)
}

function ruleAlerts(snapshot?: number, generatedAt?: number) {
  return buildPlantAlerts(planWithSnapshot(snapshot), generatedAt === undefined ? undefined : { generatedAt })
    .filter((alert) => alert.check !== undefined)
}

describe('alert dependency boundary', () => {
  it('uses the operational snapshot as the timestamp for rule alerts', () => {
    const alertsAt100 = ruleAlerts(100)
    const alertsAt200 = ruleAlerts(200)

    expect(alertsAt100.length).toBeGreaterThan(0)
    expect(alertsAt200.map((alert) => alert.id)).toEqual(alertsAt100.map((alert) => alert.id))
    expect(alertsAt100.every((alert) => alert.time === 100)).toBe(true)
    expect(alertsAt200.every((alert) => alert.time === 200)).toBe(true)
  })

  it('changes only alert timestamps when the snapshot changes', () => {
    const alertsAt100 = ruleAlerts(100)
    const alertsAt200 = ruleAlerts(200)

    expect(alertsAt200.map(({ id, tone, path, check }) => ({ id, tone, path, check }))).toEqual(
      alertsAt100.map(({ id, tone, path, check }) => ({ id, tone, path, check }))
    )
  })

  it('uses pending revision time when the operational snapshot is unavailable', () => {
    const alerts = ruleAlerts(undefined, 345)

    expect(alerts.length).toBeGreaterThan(0)
    expect(alerts.every((alert) => alert.time === 345)).toBe(true)
  })

  it('uses zero when both operational and pending revision timestamps are unavailable', () => {
    const alerts = ruleAlerts()

    expect(alerts.length).toBeGreaterThan(0)
    expect(alerts.every((alert) => alert.time === 0)).toBe(true)
  })

  it('evaluates conditions from the supplied plan and operational dependency snapshot', () => {
    const fixture = createPlanningFixture()
    const baseline = buildPlantAlerts(buildPlan(fixture.config, undefined, fixture.dependencies)).filter((alert) => alert.check !== undefined)
    const changedDependencies = {
      ...fixture.dependencies,
      operational: {
        ...fixture.dependencies.operational,
        snapshot: 100,
        deliveries: []
      }
    }
    const changed = buildPlantAlerts(buildPlan(fixture.config, undefined, changedDependencies)).filter((alert) => alert.check !== undefined)

    expect(changed.map((alert) => ({ id: alert.id, status: alert.check?.status, variant: alert.check?.variant }))).not.toEqual(
      baseline.map((alert) => ({ id: alert.id, status: alert.check?.status, variant: alert.check?.variant }))
    )
    expect(changed.every((alert) => alert.time === 100)).toBe(true)
  })
})
