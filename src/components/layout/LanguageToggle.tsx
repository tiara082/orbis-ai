import React from 'react'
import { useTranslation, type Locale } from '../../lib/i18n'
import { cn } from '../../lib/cn'

const OPTIONS: Locale[] = ['en', 'id']

export const LanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { locale, setLocale, t } = useTranslation()

  return (
    <div
      className={cn('flex items-center rounded-full bg-white p-0.5 border border-gray-200', className)}
      role="group"
      aria-label={t('shell.language')}
    >
      {OPTIONS.map((option) => {
        const active = locale === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLocale(option)}
            className={cn(
              'h-7 min-w-9 px-2.5 rounded-full text-[11px] font-semibold tracking-wide transition-colors',
              active ? 'bg-brand text-white shadow-sm' : 'text-ink hover:text-ink-strong'
            )}
            aria-pressed={active}
          >
            {t(`lang.${option}`)}
          </button>
        )
      })}
    </div>
  )
}
