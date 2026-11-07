import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import type { NavPage } from '../../config/navigation'
import { cn } from '../../lib/cn'
import { NavigationContext } from './NavigationContext'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  currentPage: NavPage
  onNavigate: (page: NavPage) => void
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ currentPage, onNavigate, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [currentPage])

  const navigation = useMemo(
    () => ({
      currentPage,
      navigate: (page: NavPage) => {
        onNavigate(page)
        setMobileMenuOpen(false)
      }
    }),
    [currentPage, onNavigate]
  )

  return (
    <NavigationContext.Provider value={navigation}>
      <div className="h-screen overflow-hidden flex bg-canvas md:p-3 md:gap-3">
        {mobileMenuOpen && (
          <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 md:hidden" />
        )}

        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 p-3 md:p-0 transform transition-transform duration-200 ease-in-out',
            'md:relative md:h-full md:shrink-0 md:translate-x-0',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar currentPage={currentPage} onNavigate={navigation.navigate} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-ink-strong hover:bg-gray-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center">
                O
              </div>
              <span className="font-extrabold tracking-wide text-ink-strong">ORBIS</span>
            </div>
            <span className="text-xs text-ink">Shift A</span>
          </div>

          <div
            ref={contentRef}
            className="flex-1 min-h-0 overflow-y-auto thin-scrollbar bg-white md:rounded-2xl md:border md:border-gray-200 md:shadow-sm"
          >
            <main className="px-4 py-6 md:px-8 md:py-7 max-w-[1400px] mx-auto w-full">{children}</main>
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  )
}
