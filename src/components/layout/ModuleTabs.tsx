import React, { useEffect, useRef } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { resolveNav } from '../../config/navigation'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/cn'

export const ModuleTabs: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { t } = useTranslation()
  const { module, tab: activeTab } = resolveNav(pathname)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    const active = scroller?.querySelector<HTMLElement>('[data-active="true"]')
    if (!scroller || !active) return
    const overflowRight = active.offsetLeft + active.offsetWidth - (scroller.scrollLeft + scroller.clientWidth)
    const overflowLeft = scroller.scrollLeft - active.offsetLeft
    if (overflowRight > 0) scroller.scrollLeft += overflowRight + 16
    else if (overflowLeft > 0) scroller.scrollLeft -= overflowLeft + 16
  }, [activeTab?.id])

  if (module.tabs.length === 0) return null

  return (
    <div ref={scrollerRef} className={cn('relative overflow-x-auto no-scrollbar -mx-1 px-1 [contain:inline-size]', className)}>
      <nav className="inline-flex min-w-full sm:min-w-0 border-b border-gray-200 gap-1">
        {module.tabs.map((tab) => {
          const active = tab.id === activeTab?.id
          return (
            <Link
              key={tab.id}
              to={tab.path}
              data-active={active}
              className={cn(
                'relative px-3 pb-2.5 pt-1 text-sm whitespace-nowrap transition-colors',
                active ? 'text-ink-strong font-semibold' : 'text-ink font-medium hover:text-ink-strong'
              )}
            >
              {t(`nav.tab.${module.id}.${tab.id}.label`)}
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
