// @vitest-environment jsdom
import { LanguageProvider } from '../../../lib/i18n/LanguageContext'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RecordActions, type ImportField } from './RecordActions'
import { readSheet } from './sheets'

vi.mock('./sheets', async () => {
  const actual = await vi.importActual<typeof import('./sheets')>('./sheets')
  return { ...actual, readSheet: vi.fn() }
})

const fields: ImportField[] = [
  { header: 'sku_id', label: 'SKU', required: true },
  { header: 'product_name', label: 'Product name', required: true },
  { header: 'size_ml', label: 'Size', required: true, kind: 'number' }
]

function renderActions(onApply = vi.fn(() => ({ added: 1, updated: 0 }))) {
  return { onApply, ...render(<LanguageProvider><RecordActions title="Products" fileName="products" fields={fields} parse={(row) => row.sku_id && row.product_name && Number.isFinite(Number(row.size_ml)) ? { skuId: row.sku_id } : { error: 'required', field: 'size_ml' }} duplicateKey={(row) => row.skuId ?? ''} onApply={onApply} /></LanguageProvider>) }
}

beforeEach(() => vi.mocked(readSheet).mockReset())

describe('RecordActions import UI', () => {
  it('opens preview from file selection without applying and preserves file metadata', async () => {
    vi.mocked(readSheet).mockResolvedValue([{ sku_id: 'A', product_name: 'Milk', size_ml: '1000' }])
    const user = userEvent.setup()
    const { onApply } = renderActions()
    const file = new File(['data'], 'products.csv', { type: 'text/csv' })
    await user.upload(screen.getByLabelText(/file/i), file)
    expect(await screen.findByText(/products\.csv/)).toBeDefined()
    expect(screen.getByText(/1 valid/)).toBeDefined()
    expect(onApply).not.toHaveBeenCalled()
  })

  it('allows mapping changes and blocks duplicate source mapping', async () => {
    vi.mocked(readSheet).mockResolvedValue([{ sku_id: 'A', product_name: 'Milk', size_ml: '1000' }])
    const user = userEvent.setup()
    renderActions()
    await user.upload(screen.getByLabelText(/file/i), new File(['data'], 'products.csv', { type: 'text/csv' }))
    const selects = await screen.findAllByRole('combobox')
    await user.selectOptions(selects[1], 'sku_id')
    expect((await screen.findAllByText(/already mapped/i)).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /confirm import/i }).hasAttribute('disabled')).toBe(true)
  })

  it('edits an invalid row and revalidates the latest draft', async () => {
    vi.mocked(readSheet).mockResolvedValue([{ sku_id: 'A', product_name: 'Milk', size_ml: 'bad' }])
    const user = userEvent.setup()
    const { onApply } = renderActions()
    await user.upload(screen.getByLabelText(/file/i), new File(['data'], 'products.csv', { type: 'text/csv' }))
    expect(screen.getByText(/1 rows · 0 valid · 1 invalid/i)).toBeDefined()
    await user.click(screen.getByRole('button', { name: /correct/i }))
    const correctionInputs = screen.getAllByRole('textbox')
    await user.clear(correctionInputs[2])
    await user.type(correctionInputs[2], '1000')
    await user.click(screen.getByRole('button', { name: /save and revalidate/i }))
    expect(await screen.findByText(/1 rows · 1 valid · 0 invalid/i)).toBeDefined()
    expect(onApply).not.toHaveBeenCalled()
  })

  it('resolves a duplicate mapping and confirms the latest mapping once', async () => {
    vi.mocked(readSheet).mockResolvedValue([{ sku_id: 'A', product_name: 'Milk', size_ml: '1000' }])
    const user = userEvent.setup()
    const { onApply } = renderActions()
    await user.upload(screen.getByLabelText(/file/i), new File(['data'], 'products.csv', { type: 'text/csv' }))
    const selects = await screen.findAllByRole('combobox')
    await user.selectOptions(selects[1], 'sku_id')
    expect(screen.getByRole('button', { name: /confirm import/i }).hasAttribute('disabled')).toBe(true)
    await user.selectOptions(selects[1], 'product_name')
    expect((screen.queryAllByText(/already mapped/i)).length).toBe(0)
    await user.click(screen.getByRole('button', { name: /confirm import/i }))
    await waitFor(() => expect(onApply).toHaveBeenCalledTimes(1))
    expect(onApply).toHaveBeenCalledWith([{ skuId: 'A' }])
  })

  it('calls onApply once only after explicit confirmation', async () => {
    vi.mocked(readSheet).mockResolvedValue([{ sku_id: 'A', product_name: 'Milk', size_ml: '1000' }])
    const user = userEvent.setup()
    const { onApply } = renderActions()
    await user.upload(screen.getByLabelText(/file/i), new File(['data'], 'products.csv', { type: 'text/csv' }))
    expect(onApply).not.toHaveBeenCalled()
    await user.click(await screen.findByRole('button', { name: /confirm import/i }))
    await waitFor(() => expect(onApply).toHaveBeenCalledTimes(1))
  })

  it('shows the translated failure notice and keeps the preview open when apply throws', async () => {
    vi.mocked(readSheet).mockResolvedValue([{ sku_id: 'A', product_name: 'Milk', size_ml: '1000' }])
    const user = userEvent.setup()
    const onApply = vi.fn(() => { throw new Error('Apply failed') })
    renderActions(onApply)
    await user.upload(screen.getByLabelText(/file/i), new File(['data'], 'products.csv', { type: 'text/csv' }))
    await user.click(await screen.findByRole('button', { name: /confirm import/i }))
    expect(onApply).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Import could not be confirmed.')).toBeDefined()
    expect(screen.queryByText(/Import completed/i)).toBeNull()
    expect(screen.getByRole('button', { name: /confirm import/i })).toBeDefined()
  })

  it('does not show success when the apply callback reports rejected rows', async () => {
    vi.mocked(readSheet).mockResolvedValue([{ sku_id: 'A', product_name: 'Milk', size_ml: '1000' }])
    const user = userEvent.setup()
    const onApply = vi.fn(() => ({ added: 0, updated: 0 }))
    renderActions(onApply)
    await user.upload(screen.getByLabelText(/file/i), new File(['data'], 'products.csv', { type: 'text/csv' }))
    await user.click(await screen.findByRole('button', { name: /confirm import/i }))
    expect(onApply).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Import could not be confirmed.')).toBeDefined()
    expect(screen.queryByText(/Imported 1 row/)).toBeNull()
  })
})
