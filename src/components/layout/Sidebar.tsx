import React from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NAV_GROUPS, resolveNav, type NavPage } from '../../config/navigation'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/cn'

interface SidebarProps {
  currentPage: NavPage
  onNavigate: (page: NavPage) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, collapsed, onToggleCollapsed }) => {
  const { t } = useTranslation()
  const activeModuleId = resolveNav(currentPage).module.id

  return (
    <aside
      className={cn(
        'h-full flex flex-col bg-gray-50 border-r border-gray-200 select-none transition-[width] duration-200',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className={cn('flex items-center gap-3 pt-4 pb-3', collapsed ? 'px-3 justify-center' : 'px-5')}>
        <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-brand to-brand-hover text-white font-bold text-lg flex items-center justify-center shadow-sm">
          O
        </div>
        {!collapsed && (
          <div className="leading-tight min-w-0">
            <p className="text-[15px] font-extrabold tracking-wide text-ink-strong">{t('brand.name')}</p>
            <p className="text-[11px] text-ink truncate">{t('brand.tagline')}</p>
          </div>
        )}
      </div>

      <nav className={cn('flex-1 min-h-0 overflow-y-auto thin-scrollbar pb-3', collapsed ? 'px-2' : 'px-3')}>
        {NAV_GROUPS.map((group) => {
          const modules = group.modules.filter((m) => !m.hidden)
          if (modules.length === 0) return null

          return (
            <div key={group.id} className="mt-3 first:mt-1">
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink/80">
                  {t(`nav.group.${group.id}`)}
                </p>
              )}
              <div className="space-y-0.5">
                {modules.map((module) => {
                  const Icon = module.icon
                  const active = module.id === activeModuleId
                  const label = t(`nav.module.${module.id}`)
                  return (
                    <button
                      key={module.id}
                      type="button"
                      title={collapsed ? label : undefined}
                      onClick={() => onNavigate(module.entry)}
                      className={cn(
                        'w-full flex items-center rounded-lg text-sm text-left transition-colors',
                        collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2',
                        active
                          ? 'bg-white shadow-sm text-ink-strong font-semibold'
                          : 'text-ink font-medium hover:bg-white/70 hover:text-ink-strong'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', active && 'text-brand')} />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      <div className={cn('p-2', collapsed ? 'flex justify-center' : '')}>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={cn(
            'flex items-center gap-2 rounded-lg text-ink hover:bg-white hover:text-ink-strong transition-colors',
            collapsed ? 'w-10 h-10 justify-center' : 'w-full px-3 py-2 text-sm font-medium'
          )}
          aria-label={collapsed ? t('shell.expand') : t('shell.collapse')}
          title={collapsed ? t('shell.expand') : t('shell.collapse')}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          {!collapsed && <span>{t('shell.collapse')}</span>}
        </button>
      </div>
    </aside>
  )
}
