import { useMemo } from 'react'
import { SCENARIO } from '../data/scenario'
import { clock, dayOffsetOf, type Minutes } from '../domain/time'
import { useTranslation } from './i18n'

/** Locale-aware formatters for liters, durations, and scenario clock times */
export function useFormat() {
  const { locale, t } = useTranslation()

  return useMemo(() => {
    const intlLocale = locale === 'id' ? 'id-ID' : 'en-GB'
    const number = new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 1 })
    const dateFormat = new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short', year: 'numeric' })
    const shortDate = new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short' })

    const dateOf = (offset: number) => {
      const base = new Date(`${SCENARIO.date}T00:00:00`)
      base.setDate(base.getDate() + offset)
      return base
    }

    const duration = (minutes: Minutes) => {
      const rounded = Math.round(minutes)
      const h = Math.floor(Math.abs(rounded) / 60)
      const m = Math.abs(rounded) % 60
      const sign = rounded < 0 ? '−' : ''
      if (h === 0) return `${sign}${m} ${t('units.min')}`
      if (m === 0) return `${sign}${h} ${t('units.h')}`
      return `${sign}${h} ${t('units.h')} ${m} ${t('units.min')}`
    }

    return {
      num: (value: number) => number.format(value),
      liters: (value: number) => `${number.format(value)} L`,
      lph: (value: number) => `${number.format(value)} L/${t('units.hShort')}`,
      packs: (value: number) => `${number.format(value)} ${t('units.packs')}`,
      pct: (value: number) => `${number.format(value)}%`,
      duration,
      /** HH:MM, prefixed with the date when the time is not on the scenario day */
      time: (minutes: Minutes) => {
        const offset = dayOffsetOf(minutes)
        return offset === 0 ? clock(minutes) : `${shortDate.format(dateOf(offset))} ${clock(minutes)}`
      },
      range: (start: Minutes, end: Minutes) => `${clock(start)}–${clock(end)}`,
      scenarioDate: (offset = 0) => dateFormat.format(dateOf(offset)),
      shortDate: (offset = 0) => shortDate.format(dateOf(offset))
    }
  }, [locale, t])
}

export type Formatter = ReturnType<typeof useFormat>
