import {
  CalendarRange,
  Database,
  GitFork,
  LayoutGrid,
  Library,
  Sparkles,
  UserRound,
  type LucideIcon
} from 'lucide-react'
import type { FileRouteTypes } from '../routeTree.gen'

export type AppPath = FileRouteTypes['to']

export type ModuleId =
  | 'dashboard'
  | 'operational-data'
  | 'milk-traceability'
  | 'ai-planning'
  | 'production-schedule'
  | 'master-data'
  | 'account'

export interface NavTab {
  /** Translation keys live under nav.tab.<module>.<id> */
  id: string
  path: AppPath
}

export interface NavModule {
  id: ModuleId
  icon: LucideIcon
  path: AppPath
  tabs: NavTab[]
  /** Which data source the module reads; shown as a chip in the page header */
  source?: 'scenario' | 'catalog'
  /** Hidden from the sidebar; still used for breadcrumbs (opened from the avatar menu) */
  hidden?: boolean
}

export interface NavGroup {
  id: 'monitor' | 'operations' | 'planning' | 'system'
  modules: NavModule[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'monitor',
    modules: [{ id: 'dashboard', icon: LayoutGrid, path: '/dashboard', tabs: [], source: 'scenario' }]
  },
  {
    id: 'operations',
    modules: [
      {
        id: 'operational-data',
        icon: Database,
        path: '/operational-data',
        source: 'scenario',
        tabs: [
          { id: 'delivery', path: '/operational-data/delivery' },
          { id: 'lab-release', path: '/operational-data/lab-release' },
          { id: 'unloading-bay', path: '/operational-data/unloading-bay' },
          { id: 'raw-milk-process', path: '/operational-data/raw-milk-process' },
          { id: 'sfp-storage', path: '/operational-data/sfp-storage' },
          { id: 'aseptic-tank', path: '/operational-data/aseptic-tank' },
          { id: 'production-order', path: '/operational-data/production-order' },
          { id: 'production-actual', path: '/operational-data/production-actual' }
        ]
      },
      {
        id: 'milk-traceability',
        icon: GitFork,
        path: '/milk-traceability',
        source: 'scenario',
        tabs: [
          { id: 'batches', path: '/milk-traceability/batches' },
          { id: 'transfers', path: '/milk-traceability/transfers' },
          { id: 'graph', path: '/milk-traceability/graph' },
          { id: 'backward', path: '/milk-traceability/backward' },
          { id: 'forward', path: '/milk-traceability/forward' },
          { id: 'audit-log', path: '/milk-traceability/audit-log' }
        ]
      }
    ]
  },
  {
    id: 'planning',
    modules: [
      {
        id: 'ai-planning',
        icon: Sparkles,
        path: '/ai-planning',
        source: 'scenario',
        tabs: [
          { id: 'forecasting', path: '/ai-planning/forecasting' },
          { id: 'configuration', path: '/ai-planning/configuration' },
          { id: 'generate', path: '/ai-planning/generate' },
          { id: 'scenarios', path: '/ai-planning/scenarios' },
          { id: 'recommendations', path: '/ai-planning/recommendations' }
        ]
      },
      {
        id: 'production-schedule',
        icon: CalendarRange,
        path: '/production-schedule',
        source: 'scenario',
        tabs: [
          { id: 'recommended', path: '/production-schedule/recommended' },
          { id: 'calendar', path: '/production-schedule/calendar' },
          { id: 'machine-allocation', path: '/production-schedule/machine-allocation' },
          { id: 'tank-allocation', path: '/production-schedule/tank-allocation' },
          { id: 'approval', path: '/production-schedule/approval' },
          { id: 'planned-vs-actual', path: '/production-schedule/planned-vs-actual' }
        ]
      }
    ]
  },
  {
    id: 'system',
    modules: [
      {
        id: 'master-data',
        icon: Library,
        path: '/master-data',
        source: 'catalog',
        tabs: [
          { id: 'products', path: '/master-data/products' },
          { id: 'assets', path: '/master-data/assets' },
          { id: 'routes', path: '/master-data/routes' },
          { id: 'line-eligibility', path: '/master-data/line-eligibility' },
          { id: 'rules', path: '/master-data/rules' }
        ]
      },
      {
        id: 'account',
        icon: UserRound,
        path: '/account',
        hidden: true,
        tabs: [
          { id: 'profile', path: '/account/profile' },
          { id: 'settings', path: '/account/settings' }
        ]
      }
    ]
  }
]

export const NAV_MODULES: NavModule[] = NAV_GROUPS.flatMap((group) => group.modules)

export interface ActiveNav {
  module: NavModule
  tab?: NavTab
}

const matches = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`)

export function resolveNav(pathname: string): ActiveNav {
  const module = NAV_MODULES.find((m) => matches(pathname, m.path)) ?? NAV_MODULES[0]
  const tab = module.tabs.find((t) => matches(pathname, t.path))
  return { module, tab }
}
