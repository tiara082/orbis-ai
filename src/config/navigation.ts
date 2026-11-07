import {
  BrainCircuit,
  CalendarRange,
  Database,
  GitFork,
  History,
  LayoutGrid,
  SearchCheck,
  Truck,
  UserRound,
  type LucideIcon
} from 'lucide-react'

export type NavPage =
  // Production Planning
  | 'production-planning'
  | 'ai-recommendation'
  | 'schedule-simulation'
  | 'planning-approval'
  | 'planning-rejection'

  // AI Intelligence
  | 'ai-prediction-detail'
  | 'ai-production-risk'
  | 'prediction-insufficient'

  // Incoming Tanker
  | 'tanker-overview'
  | 'tanker-detail'
  | 'tanker-lab-status'
  | 'tanker-lab-pending'
  | 'tanker-unloading'
  | 'tanker-delayed'

  // Data Management
  | 'data-management-overview'
  | 'data-management-upload'
  | 'data-management-mapping'
  | 'data-management-validation'
  | 'data-management-preview'
  | 'data-management-history'
  | 'data-management-error'
  | 'data-management-mapping-review'

  // Traceability
  | 'traceability-overview'
  | 'traceability-graph'
  | 'traceability-forward'
  | 'traceability-backward'
  | 'traceability-batch'

  // Quality Investigation
  | 'quality-investigation-overview'
  | 'quality-investigation-detail'
  | 'affected-batch-analysis'
  | 'affected-products'

  // Audit Trail
  | 'audit-trail-overview'
  | 'audit-event-detail'
  | 'audit-integrity-check'

  // System
  | 'dashboard'
  | 'profile'
  | 'settings'

export interface NavTab {
  page: NavPage
  label: string
}

export interface StatePage {
  page: NavPage
  label: string
  /** Tab that stays highlighted while this page is shown */
  parentTab: NavPage
}

export interface NavModule {
  id: string
  label: string
  icon: LucideIcon
  /** Page opened from the sidebar */
  entry: NavPage
  tabs: NavTab[]
  statePages?: StatePage[]
  /** Optional per-module header meta, e.g. "Last ledger check" */
  meta?: { label: string; value: string }
  /** Hidden from the sidebar; still used for breadcrumbs (profile, settings) */
  hidden?: boolean
}

export interface NavGroup {
  id: 'operations' | 'traceability' | 'system'
  label: string
  modules: NavModule[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'operations',
    label: 'Operations',
    modules: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutGrid,
        entry: 'dashboard',
        tabs: []
      },
      {
        id: 'ai-intelligence',
        label: 'AI Intelligence',
        icon: BrainCircuit,
        entry: 'ai-prediction-detail',
        tabs: [
          { page: 'ai-prediction-detail', label: 'Prediction detail' },
          { page: 'ai-production-risk', label: 'Production risk' }
        ],
        statePages: [
          { page: 'prediction-insufficient', label: 'Insufficient data', parentTab: 'ai-prediction-detail' }
        ],
        meta: { label: 'Model refreshed', value: '30 Oct 06:00' }
      },
      {
        id: 'production-planning',
        label: 'Production Planning',
        icon: CalendarRange,
        entry: 'production-planning',
        tabs: [
          { page: 'production-planning', label: 'Plan' },
          { page: 'ai-recommendation', label: 'AI recommendation' },
          { page: 'schedule-simulation', label: 'Simulation' }
        ],
        statePages: [
          { page: 'planning-approval', label: 'Approval', parentTab: 'ai-recommendation' },
          { page: 'planning-rejection', label: 'Rejection', parentTab: 'ai-recommendation' }
        ],
        meta: { label: 'Plan horizon', value: '30 Oct 06:00 – 31 Oct 06:00' }
      },
      {
        id: 'incoming-tanker',
        label: 'Incoming Tanker',
        icon: Truck,
        entry: 'tanker-overview',
        tabs: [
          { page: 'tanker-overview', label: 'Overview' },
          { page: 'tanker-detail', label: 'Tanker detail' },
          { page: 'tanker-lab-status', label: 'Lab status' },
          { page: 'tanker-unloading', label: 'Unloading' }
        ],
        statePages: [
          { page: 'tanker-lab-pending', label: 'Lab pending', parentTab: 'tanker-lab-status' },
          { page: 'tanker-delayed', label: 'Delayed', parentTab: 'tanker-overview' }
        ],
        meta: { label: 'ETA feed', value: '30 Oct 09:05' }
      },
      {
        id: 'data-management',
        label: 'Data Management',
        icon: Database,
        entry: 'data-management-overview',
        tabs: [
          { page: 'data-management-overview', label: 'Overview' },
          { page: 'data-management-upload', label: 'Upload' },
          { page: 'data-management-mapping', label: 'Column mapping' },
          { page: 'data-management-validation', label: 'Validation' },
          { page: 'data-management-preview', label: 'Preview' },
          { page: 'data-management-history', label: 'History' }
        ],
        statePages: [
          { page: 'data-management-error', label: 'Import error', parentTab: 'data-management-history' },
          { page: 'data-management-mapping-review', label: 'Mapping review', parentTab: 'data-management-mapping' }
        ]
      }
    ]
  },
  {
    id: 'traceability',
    label: 'Traceability',
    modules: [
      {
        id: 'traceability',
        label: 'Traceability',
        icon: GitFork,
        entry: 'traceability-overview',
        tabs: [
          { page: 'traceability-overview', label: 'Overview' },
          { page: 'traceability-graph', label: 'Relationship graph' },
          { page: 'traceability-forward', label: 'Forward trace' },
          { page: 'traceability-backward', label: 'Backward trace' },
          { page: 'traceability-batch', label: 'Batch detail' }
        ],
        meta: { label: 'Last ledger check', value: '30 Oct 15:02' }
      },
      {
        id: 'quality-investigation',
        label: 'Quality Investigation',
        icon: SearchCheck,
        entry: 'quality-investigation-overview',
        tabs: [
          { page: 'quality-investigation-overview', label: 'Overview' },
          { page: 'quality-investigation-detail', label: 'Investigation detail' },
          { page: 'affected-batch-analysis', label: 'Affected batches' },
          { page: 'affected-products', label: 'Affected products' }
        ]
      },
      {
        id: 'audit-trail',
        label: 'Audit Trail',
        icon: History,
        entry: 'audit-trail-overview',
        tabs: [
          { page: 'audit-trail-overview', label: 'Overview' },
          { page: 'audit-event-detail', label: 'Event detail' },
          { page: 'audit-integrity-check', label: 'Integrity check' }
        ],
        meta: { label: 'Last ledger check', value: '30 Oct 15:02' }
      }
    ]
  },
  {
    id: 'system',
    label: 'System',
    modules: [
      {
        id: 'account',
        label: 'Account',
        icon: UserRound,
        entry: 'profile',
        hidden: true,
        tabs: [
          { page: 'profile', label: 'Profile' },
          { page: 'settings', label: 'Settings' }
        ]
      }
    ]
  }
]

export const NAV_MODULES: NavModule[] = NAV_GROUPS.flatMap((group) => group.modules)

export interface ActiveNav {
  module: NavModule
  group: NavGroup
  /** Tab to highlight (state pages resolve to their parent tab) */
  activeTab?: NavPage
  /** Label of the current page, used for breadcrumb */
  pageLabel: string
  isStatePage: boolean
}

export function resolveNav(page: NavPage): ActiveNav {
  for (const group of NAV_GROUPS) {
    for (const module of group.modules) {
      if (module.entry === page && module.tabs.length === 0) {
        return { module, group, pageLabel: module.label, isStatePage: false }
      }
      const tab = module.tabs.find((t) => t.page === page)
      if (tab) {
        return { module, group, activeTab: tab.page, pageLabel: tab.label, isStatePage: false }
      }
      const state = module.statePages?.find((s) => s.page === page)
      if (state) {
        return { module, group, activeTab: state.parentTab, pageLabel: state.label, isStatePage: true }
      }
    }
  }
  const fallback = NAV_GROUPS[0]
  return { module: fallback.modules[0], group: fallback, pageLabel: fallback.modules[0].label, isStatePage: false }
}
