import { useCallback } from 'react'
import type { CheckResult } from '../domain/checks'
import { useFormat } from './format'
import { useTranslation } from './i18n'

/** Formats check vars by suffix: *L liters, *Lph L/hour, *Time clock, *Min duration */
export function useCheckText() {
  const { t } = useTranslation()
  const fmt = useFormat()

  const formatVars = useCallback(
    (vars: CheckResult['vars'] = {}) =>
      Object.fromEntries(
        Object.entries(vars).map(([key, value]) => {
          if (typeof value !== 'number') return [key, value]
          if (key.endsWith('Lph')) return [key, fmt.lph(value)]
          if (key.endsWith('L')) return [key, fmt.liters(value)]
          if (key.endsWith('Time')) return [key, fmt.time(value)]
          if (key.endsWith('Min')) return [key, fmt.duration(value)]
          return [key, fmt.num(value)]
        })
      ),
    [fmt]
  )

  return useCallback(
    (check: CheckResult) => ({
      title: t(`checks.${check.ruleId}.title`),
      message: t(`checks.${check.ruleId}.${check.variant}`, formatVars(check.vars))
    }),
    [t, formatVars]
  )
}
