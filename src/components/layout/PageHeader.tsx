import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight, Database, Library } from 'lucide-react'
import { resolveNav } from '../../config/navigation'
import { CATALOG_FILE_COUNT } from '../../data/reference'
import { SCENARIO } from '../../data/scenario'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/cn'
import { ModuleTabs } from './ModuleTabs'

interface PageHeaderProps {
  /** Defaults to the title of the active tab (or module) in config/navigation.ts */
  title?: string
  description?: string
  actions?: React.ReactNode
  titleAddon?: React.ReactNode
  hideTabs?: boolean
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, titleAddon, hideTabs, className }) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { t } = useTranslation()
  const fmt = useFormat()
  const { module, tab } = resolveNav(pathname)
  const ModuleIcon = module.icon
  const moduleLabel = t(`nav.module.${module.id}`)
  const base = tab ? `nav.tab.${module.id}.${tab.id}` : `nav.moduleInfo.${module.id}`

  const source =
    module.source === 'scenario'
      ? { icon: Database, text: t('source.scenario', { date: fmt.scenarioDate(), time: fmt.time(SCENARIO.snapshot) }) }
      : module.source === 'catalog'
        ? { icon: Library, text: t('source.catalog', { count: CATALOG_FILE_COUNT }) }
        : undefined

  return (
    <header className={cn('mb-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <nav className="flex items-center gap-1.5 text-xs text-ink">
          <ModuleIcon className="w-3.5 h-3.5" />
          <Link to={module.path} className={cn('hover:text-ink-strong transition-colors', !tab && 'text-ink-strong font-medium')}>
            {moduleLabel}
          </Link>
          {tab && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-ink-strong font-medium">{t(`${base}.label`)}</span>
            </>
          )}
        </nav>
        {source && (
          <p className="inline-flex items-center gap-1.5 text-[11px] text-ink rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5">
            <source.icon className="w-3 h-3" />
            {source.text}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-strong">{title ?? t(`${base}.title`)}</h1>
            {titleAddon}
          </div>
          <p className="text-sm text-ink mt-1 max-w-3xl">{description ?? t(`${base}.description`)}</p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {!hideTabs && <ModuleTabs className="mt-5" />}
    </header>
  )
}
