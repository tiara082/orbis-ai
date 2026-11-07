/** Scenario times are minutes from 00:00 on the scenario day; negative values belong to the previous day. */
export type Minutes = number

export const DAY: Minutes = 24 * 60

export function at(hhmm: string, dayOffset = 0): Minutes {
  const [h, m] = hhmm.split(':').map(Number)
  return dayOffset * DAY + h * 60 + m
}

export function clock(minutes: Minutes): string {
  const inDay = ((minutes % DAY) + DAY) % DAY
  const h = Math.floor(inDay / 60)
  const m = Math.round(inDay % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export const dayOffsetOf = (minutes: Minutes) => Math.floor(minutes / DAY)

export const overlaps = (aStart: Minutes, aEnd: Minutes, bStart: Minutes, bEnd: Minutes) =>
  aStart < bEnd && bStart < aEnd
