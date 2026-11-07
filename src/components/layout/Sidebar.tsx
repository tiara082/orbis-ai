import React, { useState } from 'react'
import { NAV_GROUPS, resolveNav, type NavPage } from '../../config/navigation'
import { cn } from '../../lib/cn'
import { SearchInput } from '../ui/SearchInput'

interface SidebarProps {
  currentPage: NavPage
  onNavigate: (page: NavPage) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const [query, setQuery] = useState('')
  const activeModuleId = resolveNav(currentPage).module.id
  const q = query.trim().toLowerCase()

  return (
    <aside className="w-64 h-full flex flex-col bg-gray-50 border border-gray-200 rounded-2xl shadow-sm select-none">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand to-brand-hover text-white font-bold text-lg flex items-center justify-center shadow-sm">
          O
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-wide text-ink-strong">ORBIS</p>
          <p className="text-[11px] text-ink">AI Production Intelligence</p>
        </div>
      </div>

      <div className="px-4 pb-3">
        <SearchInput
          size="sm"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 overflow-y-auto thin-scrollbar px-3 pb-3">
        {NAV_GROUPS.map((group) => {
          const modules = group.modules.filter((m) => !q || m.label.toLowerCase().includes(q))
          if (modules.length === 0) return null

          return (
            <div key={group.label} className="mt-3 first:mt-1">
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink/80">
                {group.label}
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
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors border',
                        active
                          ? 'bg-white border-gray-200 shadow-sm text-ink-strong font-semibold'
                          : 'border-transparent text-ink font-medium hover:bg-white/70 hover:text-ink-strong'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', active && 'text-brand')} />
                      <span className="truncate">{module.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-brand-muted text-brand text-xs font-bold flex items-center justify-center shrink-0">
            AP
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold text-ink-strong truncate">Ana Putri</p>
            <p className="text-[11px] text-ink truncate">30 Oct 2026 · Shift A</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
