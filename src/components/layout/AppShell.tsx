import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/cn'
import { AppHeader } from './AppHeader'
import { ShellContext } from './ShellContext'
import { Sidebar } from './Sidebar'

const COLLAPSE_KEY = 'orbis-sidebar-collapsed'

interface AppShellProps {
  onLogout: () => void
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ onLogout, children }) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  // The mobile menu stays open only for the path it was opened on, so navigating closes it.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null)
  const mobileMenuOpen = menuOpenOn === pathname
  const setMobileMenuOpen = (open: boolean) => setMenuOpenOn(open ? pathname : null)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(COLLAPSE_KEY) === '1'
  })
  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  useEffect(() => {
    window.localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  const shell = useMemo(() => ({ logout: onLogout }), [onLogout])

  return (
    <ShellContext.Provider value={shell}>
      <div className="h-screen overflow-hidden flex bg-white">
        {mobileMenuOpen && (
          <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 md:hidden" />
        )}

        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out',
            'md:relative md:h-full md:shrink-0 md:translate-x-0',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex items-stretch border-b border-gray-200">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-12 shrink-0 inline-flex items-center justify-center text-ink-strong hover:bg-gray-50"
              aria-label={t('shell.toggleNav')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex-1 min-w-0">
              <AppHeader />
            </div>
          </div>

          <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto thin-scrollbar bg-white">
            <main className="px-4 py-6 md:px-8 md:py-7 max-w-[1400px] mx-auto w-full">{children}</main>
          </div>
        </div>
      </div>
    </ShellContext.Provider>
  )
}
