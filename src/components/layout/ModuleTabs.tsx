import React from 'react'
import { resolveNav } from '../../config/navigation'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/cn'
import { useNavigation } from './NavigationContext'

export const ModuleTabs: React.FC<{ className?: string }> = ({ className }) => {
  const { currentPage, navigate } = useNavigation()
  const { t } = useTranslation()
  const { module, activeTab } = resolveNav(currentPage)

  if (module.tabs.length === 0) return null

  return (
    <div className={cn('overflow-x-auto no-scrollbar -mx-1 px-1', className)}>
      <nav className="inline-flex min-w-full sm:min-w-0 border-b border-gray-200 gap-1">
        {module.tabs.map((tab) => {
          const active = tab.page === activeTab
          return (
            <button
              key={tab.page}
              type="button"
              onClick={() => navigate(tab.page)}
              className={cn(
                'relative px-3 pb-2.5 pt-1 text-sm whitespace-nowrap transition-colors',
                active ? 'text-ink-strong font-semibold' : 'text-ink font-medium hover:text-ink-strong'
              )}
            >
              {t(`nav.page.${tab.page}`)}
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand" />}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
