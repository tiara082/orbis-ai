import { parseCsv } from '../../../data/reference/csv'

/** Reads the first sheet of an Excel file, or a CSV, into header-keyed rows. */
export async function readSheet(file: File): Promise<Record<string, string>[]> {
  const name = file.name.toLowerCase()
  if (name.endsWith('.csv')) return parseCsv(await file.text())

  const XLSX = await import('xlsx')
  const book = XLSX.read(await file.arrayBuffer(), { type: 'array' })
  const sheet = book.Sheets[book.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false })
  return rows.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [String(key).trim(), String(value).trim()])))
}

export async function downloadTemplate(fileName: string, headers: string[]) {
  const XLSX = await import('xlsx')
  const sheet = XLSX.utils.aoa_to_sheet([headers])
  sheet['!cols'] = headers.map((header) => ({ wch: Math.max(header.length + 2, 16) }))
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, 'data')
  XLSX.writeFile(book, `${fileName}.xlsx`)
}

export const headerKey = (header: string) => header.trim().toLowerCase().replace(/[\s-]+/g, '_')
