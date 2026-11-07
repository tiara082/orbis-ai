import { afterEach, describe, expect, it, vi } from 'vitest'
import { catalogRepository } from './repository'
import { validateCatalog } from './validation'

const unique = 'TEST-LIQUID-20261107-01'

afterEach(() => {
  catalogRepository.reset()
})

describe('shared catalog repository', () => {
  it('initializes from the CSV catalog and exposes a snapshot', () => {
    const snapshot = catalogRepository.getSnapshot()
    expect(snapshot.data.liquidSkus.length).toBeGreaterThan(0)
    expect(snapshot.data.finishedSkus.length).toBeGreaterThan(0)
    expect(snapshot.version).toBeGreaterThanOrEqual(0)
  })

  it('notifies subscribers and reports added and updated rows', () => {
    const listener = vi.fn()
    const unsubscribe = catalogRepository.subscribe(listener)
    const base = catalogRepository.getSnapshot().data.liquidSkus[0]
    const row = { ...base, skuId: unique }

    const added = catalogRepository.upsert('liquidSkus', [row], (item) => item.skuId)
    const updated = catalogRepository.upsert('liquidSkus', [{ ...row, productName: 'Updated TEST' }], (item) => item.skuId)
    expect(added.added).toBe(1)
    expect(updated.updated).toBe(1)
    expect(listener).toHaveBeenCalled()
    unsubscribe()
  })

  it('rejects invalid cross-category data without changing the active snapshot', () => {
    const before = catalogRepository.getSnapshot()
    const invalid = structuredClone(before.data)
    invalid.finishedSkus = [
      ...invalid.finishedSkus,
      {
        finishedSkuId: 'TEST-FINISHED-INVALID-20261107-01',
        liquidSkuId: 'MISSING-LIQUID',
        packSizeCode: 'MISSING-PACK',
        marketVariant: 'MISSING-MARKET'
      }
    ]

    const result = catalogRepository.publish(invalid)
    const after = catalogRepository.getSnapshot()

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(after.version).toBe(before.version)
    expect(after.data.finishedSkus.some((row) => row.finishedSkuId === 'TEST-FINISHED-INVALID-20261107-01')).toBe(false)
  })

  it('resets local changes to the CSV seed', () => {
    const base = catalogRepository.getSnapshot().data.liquidSkus[0]
    catalogRepository.upsert('liquidSkus', [{ ...base, skuId: unique }], (item) => item.skuId)
    expect(catalogRepository.getSnapshot().data.liquidSkus.some((row) => row.skuId === unique)).toBe(true)

    catalogRepository.reset()
    expect(catalogRepository.getSnapshot().data.liquidSkus.some((row) => row.skuId === unique)).toBe(false)
  })

  it('validates duplicate identifiers', () => {
    const data = catalogRepository.getSnapshot().data
    const duplicate = structuredClone(data)
    duplicate.liquidSkus = [duplicate.liquidSkus[0], duplicate.liquidSkus[0]]
    const result = validateCatalog(duplicate)
    expect(result.valid).toBe(false)
    expect(result.errors.some((error) => error.message.includes('Duplicate identifier'))).toBe(true)
  })
})
