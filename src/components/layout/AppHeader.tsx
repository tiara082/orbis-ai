import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Globe, LogOut, Search, Settings, UserRound } from 'lucide-react'
import { APP_ALERTS, CURRENT_USER } from '../../config/alerts'
import { NAV_MODULES, type NavPage } from '../../config/navigation'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { useClickOutside } from '../../lib/useClickOutside'
import { IconTile } from '../ui/IconTile'
import { SearchInput } from '../ui/SearchInput'
import { LanguageToggle } from './LanguageToggle'
import { useNavigation } from './NavigationContext'

type MenuId = 'alerts' | 'lang' | 'profile' | null

const HeaderIconButton: React.FC<{
  label: string
  active?: boolean
  onClick: () => void
  badge?: number
  children: React.ReactNode
}> = ({ label, active, onClick, badge, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={cn(
      'relative w-9 h-9 rounded-lg inline-flex items-center justify-center transition-colors',
      active ? 'bg-brand-muted text-brand' : 'text-ink hover:bg-gray-100 hover:text-ink-strong'
    )}
  >
    {children}
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-danger text-white text-[10px] font-bold leading-4 text-center">
        {badge > 9 ? '9+' : badge}
      </span>
    )}
  </button>
)

const PlantClock: React.FC = () => {
  const { locale, t } = useTranslation()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now)

  const date = new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(now)

  return (
    <div className="hidden sm:flex flex-col items-end justify-center px-1 min-w-[5.5rem]" title={`${t('shell.timezone')} · Asia/Jakarta`}>
      <p className="text-sm font-semibold tabular-nums text-ink-strong leading-none">{time}</p>
      <p className="text-[10px] text-ink mt-0.5 tabular-nums">
        {t('shell.timezone')} · {date}
      </p>
    </div>
  )
}

const MenuPanel: React.FC<{ children: React.ReactNode; className?: string; align?: 'right' | 'left' }> = ({
  children,
  className,
  align = 'right'
}) => (
  <div
    className={cn(
      'absolute top-[calc(100%+8px)] z-50 w-72 rounded-xl border border-gray-200 bg-white shadow-sm p-1.5',
      align === 'right' ? 'right-0' : 'left-0',
      className
    )}
  >
    {children}
  </div>
)

export const AppHeader: React.FC = () => {
  const { t } = useTranslation()
  const { navigate, logout } = useNavigation()
  const [menu, setMenu] = useState<MenuId>(null)
  const [query, setQuery] = useState('')
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const rootRef = useRef<HTMLElement>(null)

  const close = useCallback(() => {
    setMenu(null)
    setQuery('')
  }, [])
  useClickOutside(rootRef, close, menu !== null || query.trim().length > 0)

  const unread = APP_ALERTS.filter((alert) => !readIds.has(alert.id)).length
  const q = query.trim().toLowerCase()
  const matches = useMemo(() => {
    if (!q) return []
    return NAV_MODULES.filter((module) => {
      const label = t(`nav.module.${module.id}`)
      return label.toLowerCase().includes(q) || module.label.toLowerCase().includes(q)
    }).slice(0, 6)
  }, [q, t])

  const open = (id: MenuId) => setMenu((current) => (current === id ? null : id))

  const go = (page: NavPage) => {
    navigate(page)
    setMenu(null)
    setQuery('')
  }

  return (
    <header ref={rootRef} className="h-14 shrink-0 flex items-center gap-3 px-3 md:px-5 bg-white">
      <div className="relative flex-1 min-w-0 max-w-md">
        <SearchInput
          size="sm"
          placeholder={t('shell.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setMenu(null)}
        />
        {matches.length > 0 && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-xl border border-gray-200 bg-white shadow-sm p-1.5">
            {matches.map((module) => {
              const Icon = module.icon
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => go(module.entry)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left text-ink-strong hover:bg-gray-50"
                >
                  <Icon className="w-4 h-4 text-ink shrink-0" />
                  <span className="truncate">{t(`nav.module.${module.id}`)}</span>
                </button>
              )
            })}
          </div>
        )}
        {q && matches.length === 0 && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-xl border border-gray-200 bg-white shadow-sm px-3 py-2.5 text-xs text-ink flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            {t('shell.search')}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
        <PlantClock />

        <div className="relative">
          <HeaderIconButton
            label={t('shell.notifications')}
            active={menu === 'alerts'}
            badge={unread}
            onClick={() => open('alerts')}
          >
            <Bell className="w-4 h-4" />
          </HeaderIconButton>
          {menu === 'alerts' && (
            <MenuPanel className="w-80">
              <div className="flex items-center justify-between px-2.5 py-1.5">
                <p className="text-xs font-semibold text-ink-strong">{t('shell.notifications')}</p>
                {unread > 0 && (
                  <button
                    type="button"
                    className="text-[11px] font-medium text-brand hover:text-brand-hover"
                    onClick={() => setReadIds(new Set(APP_ALERTS.map((a) => a.id)))}
                  >
                    {t('shell.markAllRead')}
                  </button>
                )}
              </div>
              {APP_ALERTS.length === 0 ? (
                <p className="px-2.5 py-3 text-xs text-ink">{t('shell.noAlerts')}</p>
              ) : (
                <div className="max-h-80 overflow-y-auto thin-scrollbar">
                  {APP_ALERTS.map((alert) => (
                    <button
                      key={alert.id}
                      type="button"
                      onClick={() => {
                        setReadIds((prev) => new Set(prev).add(alert.id))
                        go(alert.page)
                      }}
                      className={cn(
                        'w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-gray-50',
                        !readIds.has(alert.id) && 'bg-brand-muted/40'
                      )}
                    >
                      <IconTile tone={alert.tone} size="sm" icon={Bell} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-ink-strong truncate">{t(alert.titleKey)}</p>
                        <p className="text-[11px] text-ink mt-0.5 line-clamp-2">{t(alert.bodyKey)}</p>
                      </div>
                      <span className="text-[10px] tabular-nums text-ink shrink-0">{alert.at}</span>
                    </button>
                  ))}
                </div>
              )}
            </MenuPanel>
          )}
        </div>

        <div className="relative">
          <HeaderIconButton label={t('shell.language')} active={menu === 'lang'} onClick={() => open('lang')}>
            <Globe className="w-4 h-4" />
          </HeaderIconButton>
          {menu === 'lang' && (
            <MenuPanel className="w-auto p-2.5">
              <p className="text-[11px] font-medium text-ink mb-1.5">{t('shell.language')}</p>
              <LanguageToggle />
            </MenuPanel>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => open('profile')}
            aria-label={t('shell.profileMenu')}
            title={t('shell.profileMenu')}
            className={cn(
              'w-9 h-9 rounded-full bg-brand-muted text-brand text-xs font-bold inline-flex items-center justify-center transition-shadow',
              menu === 'profile' ? 'ring-2 ring-brand/30' : 'hover:ring-2 hover:ring-brand/20'
            )}
          >
            {CURRENT_USER.initials}
          </button>
          {menu === 'profile' && (
            <MenuPanel>
              <div className="flex items-center gap-3 px-2.5 py-2.5 mb-1">
                <div className="w-10 h-10 rounded-full bg-brand-muted text-brand text-sm font-bold flex items-center justify-center shrink-0">
                  {CURRENT_USER.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-strong truncate">{CURRENT_USER.name}</p>
                  <p className="text-[11px] text-ink truncate">
                    {t('shell.role')} · {t('shell.shift')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => go('profile')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-ink-strong hover:bg-gray-50"
              >
                <UserRound className="w-4 h-4 text-ink" />
                {t('shell.profile')}
              </button>
              <button
                type="button"
                onClick={() => go('settings')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-ink-strong hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 text-ink" />
                {t('shell.settings')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenu(null)
                  logout()
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-danger hover:bg-danger-muted"
              >
                <LogOut className="w-4 h-4" />
                {t('shell.logout')}
              </button>
            </MenuPanel>
          )}
        </div>
      </div>
    </header>
  )
}
