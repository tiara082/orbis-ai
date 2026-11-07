import { createContext, useContext } from 'react'
import type { NavPage } from '../../config/navigation'

interface NavigationContextValue {
  currentPage: NavPage
  navigate: (page: NavPage) => void
}

export const NavigationContext = createContext<NavigationContextValue | null>(null)

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used inside AppShell')
  return ctx
}
