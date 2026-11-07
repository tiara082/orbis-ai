export type CsvRow = Record<string, string>

function splitLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        quoted = !quoted
      }
    } else if (char === ',' && !quoted) {
      cells.push(current)
      current = ''
    } else {
      current += char
    }
  }
  cells.push(current)
  return cells.map((cell) => cell.trim())
}

export function parseCsv(text: string): CsvRow[] {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
  const header = splitLine(lines[0])
  return lines.slice(1).map((line) => {
    const cells = splitLine(line)
    return Object.fromEntries(header.map((name, i) => [name, cells[i] ?? '']))
  })
}

/**
 * Catalog cells use `X` for "parameter applies, value not provided yet" and
 * `N/A` for "parameter does not apply to this asset".
 */
export type ParamCell = 'pending' | 'na' | 'empty' | number

export function parseParam(raw: string): ParamCell {
  const value = raw.trim()
  if (value === '') return 'empty'
  if (value.toUpperCase() === 'X') return 'pending'
  if (value.toUpperCase() === 'N/A') return 'na'
  const num = Number(value)
  return Number.isFinite(num) ? num : 'empty'
}

export const splitList = (raw: string) =>
  raw
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
