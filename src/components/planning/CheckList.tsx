import React from 'react'
import type { CheckResult } from '../../domain/checks'
import { useCheckText } from '../../lib/checkText'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { Badge } from '../ui/Badge'

interface CheckListProps {
  checks: CheckResult[]
  /** Show only warnings, violations, and not-computable rules */
  issuesOnly?: boolean
  className?: string
  filter?: 'all' | CheckResult['status']
}

const ORDER = { violation: 0, warning: 1, 'not computable': 2, pass: 3 }

/** Rule checks from the official constraint catalog; project assumptions are labelled */
export const CheckList: React.FC<CheckListProps> = ({ checks, issuesOnly, className, filter = 'all' }) => {
  const { t } = useTranslation()
  const checkText = useCheckText()
  const rows = [...checks]
    .filter((check) => !issuesOnly || check.status !== 'pass')
    .filter((check) => filter === 'all' || check.status === filter)
    .sort((a, b) => ORDER[a.status] - ORDER[b.status])

  if (rows.length === 0) {
    return <p className={cn('text-sm text-ink px-1 py-2', className)}>{t('checks.allPass')}</p>
  }

  return (
    <ul className={cn('divide-y divide-gray-100', className)}>
      {rows.map((check, i) => {
        const text = checkText(check)
        return (
          <li key={`${check.ruleId}-${check.variant}-${i}`} className="flex items-start gap-3 py-2.5">
            <Badge status={check.status} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-strong">
                {text.title}
                <span className="ml-2 font-mono text-[11px] font-normal text-ink">{check.ruleId}</span>
              </p>
              <p className="text-xs text-ink mt-0.5">{text.message}</p>
            </div>
            {check.source === 'assumption' && (
              <Badge tone="neutral" variant="outline" icon={null} className="shrink-0">
                {t('checks.assumption')}
              </Badge>
            )}
          </li>
        )
      })}
    </ul>
  )
}
