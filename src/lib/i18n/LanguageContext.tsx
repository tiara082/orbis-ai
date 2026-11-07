import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { en, type Messages } from './en'
import { id } from './id'

export type Locale = 'en' | 'id'
export type { Messages }

const STORAGE_KEY = 'orbis-locale'
const dictionaries: Record<Locale, Messages> = { en, id }

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function lookup(messages: unknown, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = messages
  for (const part of parts) {
    if (typeof current !== 'object' || current === null || !(part in current)) return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : undefined
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`))
}

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'id' || stored === 'en' ? stored : 'en'
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const fromActive = lookup(dictionaries[locale], key)
      const fromFallback = locale === 'en' ? undefined : lookup(dictionaries.en, key)
      return interpolate(fromActive ?? fromFallback ?? key, vars)
    },
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used inside LanguageProvider')
  return ctx
}
