import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'

interface DetailDrawerProps {
  open: boolean
  onClose: () => void
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
}

/** Right-side panel for row details; the list stays visible behind it */
export const DetailDrawer: React.FC<DetailDrawerProps> = ({ open, onClose, eyebrow, title, description, children }) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="relative h-full w-full max-w-lg bg-white shadow-sm border-l border-gray-200 flex flex-col">
        <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="min-w-0">
            {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-1">{eyebrow}</p>}
            <h2 className="text-lg font-bold tracking-tight text-ink-strong">{title}</h2>
            {description && <p className="text-sm text-ink mt-0.5">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="w-8 h-8 shrink-0 rounded-lg inline-flex items-center justify-center text-ink hover:bg-gray-100 hover:text-ink-strong"
          >
            <X className="w-4 h-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-5 py-4 space-y-5">{children}</div>
      </aside>
    </div>
  )
}

export const DrawerSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink mb-2">{title}</h3>
    {children}
  </section>
)
