import React, { useState } from 'react'
import { NAV_GROUPS, resolveNav, type NavPage } from '../../config/navigation'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/cn'
import { SearchInput } from '../ui/SearchInput'
import { LanguageToggle } from './LanguageToggle'

interface SidebarProps {
  currentPage: NavPage
  onNavigate: (page: NavPage) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const [query, setQuery] = useState('')
  const { t } = useTranslation()
  const activeModuleId = resolveNav(currentPage).module.id
  const q = query.trim().toLowerCase()

  return (
    <aside className="w-64 h-full flex flex-col bg-gray-50 rounded-2xl md:rounded-none select-none">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand to-brand-hover text-white font-bold text-lg flex items-center justify-center shadow-sm">
          O
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-wide text-ink-strong">{t('brand.name')}</p>
          <p className="text-[11px] text-ink">{t('brand.tagline')}</p>
        </div>
      </div>

      <div className="px-4 pb-3">
        <SearchInput size="sm" placeholder={t('shell.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto thin-scrollbar px-3 pb-3">
        {NAV_GROUPS.map((group) => {
          const modules = group.modules.filter((m) => {
            const label = t(`nav.module.${m.id}`)
            return !q || label.toLowerCase().includes(q) || m.label.toLowerCase().includes(q)
          })
          if (modules.length === 0) return null

          return (
            <div key={group.id} className="mt-3 first:mt-1">
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink/80">
                {t(`nav.group.${group.id}`)}
              </p>
              <div className="space-y-0.5">
                {modules.map((module) => {
                  const Icon = module.icon
                  const active = module.id === activeModuleId
                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => onNavigate(module.entry)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors',
                        active
                          ? 'bg-white shadow-sm text-ink-strong font-semibold'
                          : 'text-ink font-medium hover:bg-white/70 hover:text-ink-strong'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', active && 'text-brand')} />
                      <span className="truncate">{t(`nav.module.${module.id}`)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-medium text-ink">{t('shell.language')}</span>
          <LanguageToggle />
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white">
          <div className="w-9 h-9 rounded-full bg-brand-muted text-brand text-xs font-bold flex items-center justify-center shrink-0">
            AP
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold text-ink-strong truncate">Ana Putri</p>
            <p className="text-[11px] text-ink truncate">{t('shell.userMeta')}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
