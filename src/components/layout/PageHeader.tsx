import React from 'react'
import { ChevronRight } from 'lucide-react'
import { resolveNav } from '../../config/navigation'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/cn'
import { ModuleTabs } from './ModuleTabs'
import { useNavigation } from './NavigationContext'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  /** Overrides the module meta from config/navigation.ts */
  meta?: { label: string; value: string } | null
  /** Optional badge shown next to the title, e.g. a status chip */
  titleAddon?: React.ReactNode
  hideTabs?: boolean
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  meta,
  titleAddon,
  hideTabs,
  className
}) => {
  const { currentPage, navigate } = useNavigation()
  const { t } = useTranslation()
  const { module, pageLabel } = resolveNav(currentPage)
  const ModuleIcon = module.icon
  const headerMeta = meta === null ? undefined : meta ?? module.meta
  const moduleLabel = t(`nav.module.${module.id}`)
  const translatedPage = t(`nav.page.${currentPage}`)
  const showPageCrumb = pageLabel !== module.label

  return (
    <header className={cn('mb-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <nav className="flex items-center gap-1.5 text-xs text-ink">
          <ModuleIcon className="w-3.5 h-3.5" />
          <button
            type="button"
            onClick={() => navigate(module.entry)}
            className={cn('hover:text-ink-strong transition-colors', !showPageCrumb && 'text-ink-strong font-medium')}
          >
            {moduleLabel}
          </button>
          {showPageCrumb && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-ink-strong font-medium">{translatedPage}</span>
            </>
          )}
        </nav>
        {headerMeta && (
          <p className="text-xs text-ink">
            {t(`nav.meta.${module.id}`)} <span className="font-semibold text-ink-strong">{headerMeta.value}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-strong">{title}</h1>
            {titleAddon}
          </div>
          {description && <p className="text-sm text-ink mt-1">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {!hideTabs && <ModuleTabs className="mt-5" />}
    </header>
  )
}
