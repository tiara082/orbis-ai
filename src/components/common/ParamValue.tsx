import React from 'react'
import type { ParamCell } from '../../data/reference'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'

/** Catalog cell: number, `X` (applies, value pending), or `N/A` (does not apply) */
export const ParamValue: React.FC<{ value: ParamCell; unit?: string }> = ({ value, unit }) => {
  const { t } = useTranslation()
  const fmt = useFormat()

  if (typeof value === 'number') {
    return (
      <span className="tabular-nums">
        {fmt.num(value)}
        {unit && <span className="text-ink"> {unit}</span>}
      </span>
    )
  }
  if (value === 'pending') {
    return (
      <span
        title={t('catalog.pendingHint')}
        className="inline-flex items-center rounded-md border border-dashed border-warning-subtle bg-warning-muted px-1.5 py-0.5 text-[11px] font-medium text-warning"
      >
        {t('catalog.pending')}
      </span>
    )
  }
  return <span className="text-gray-300" title={value === 'na' ? t('catalog.naHint') : undefined}>—</span>
}
