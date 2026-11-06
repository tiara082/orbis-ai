import React from 'react'
import {
  LayoutGrid,
  Sparkles,
  Columns3,
  Disc,
  Upload,
  GitFork,
  AlertCircle,
  History,
  Settings as SettingsIcon
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

  // Placeholders
  | 'dashboard'
  | 'ai-intelligence'
  | 'traceability'
  | 'quality-investigation'
  | 'audit-trail'
  | 'settings'

interface SidebarProps {
  currentPage: NavPage
  onNavigate: (page: NavPage) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const isProductionActive =
    currentPage === 'production-planning' ||
    currentPage === 'ai-recommendation' ||
    currentPage === 'schedule-simulation' ||
    currentPage === 'planning-approval' ||
    currentPage === 'planning-rejection'

  const isAIActive =
    currentPage === 'ai-prediction-detail' ||
    currentPage === 'ai-production-risk' ||
    currentPage === 'prediction-insufficient' ||
    currentPage === 'ai-intelligence'

  const isTankerActive = currentPage.startsWith('tanker')
  const isDataManagementActive = currentPage.startsWith('data-management')
  const isTraceabilityActive = currentPage.startsWith('traceability')
  
  const isQualityActive =
    currentPage.startsWith('quality-investigation') ||
    currentPage === 'affected-batch-analysis' ||
    currentPage === 'affected-products'

  const isAuditActive = currentPage.startsWith('audit')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    {
      id: 'ai-prediction-detail',
      label: 'AI Intelligence',
      icon: Sparkles,
      isActive: isAIActive
    },
    {
      id: 'production-planning',
      label: 'Production Planning',
      icon: Columns3,
      isActive: isProductionActive
    },
    {
      id: 'tanker-overview',
      label: 'Incoming Tanker',
      icon: Disc,
      isActive: isTankerActive
    },
    {
      id: 'data-management-overview',
      label: 'Data Management',
      icon: Upload,
      isActive: isDataManagementActive
    },
    {
      id: 'traceability-overview',
      label: 'Traceability',
      icon: GitFork,
      isActive: isTraceabilityActive
    },
    {
      id: 'quality-investigation-overview',
      label: 'Quality Investigation',
      icon: AlertCircle,
      isActive: isQualityActive
    },
    {
      id: 'audit-trail-overview',
      label: 'Audit Trail',
      icon: History,
      isActive: isAuditActive
    },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ]

  return (
    <aside className="w-64 bg-[#142B49] text-slate-300 flex flex-col min-h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="px-6 pt-7 pb-6">
        <h1 className="text-xl font-bold tracking-wider text-white">ORBIS</h1>
        <p className="text-[10px] font-semibold tracking-widest text-slate-400 mt-0.5">
          AI PRODUCTION INTELLIGENCE
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.isActive

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavPage)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active
                  ? 'bg-[#1e3a5f] text-white border border-[#2d4d77]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a3355]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Workspace Section */}
      <div className="p-6 border-t border-slate-700/60 mt-auto">
        <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
          WORKSPACE
        </div>
        <div className="text-xs text-slate-200 font-medium mt-1.5">
          Synthetic operational data
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          Planner · Shift A
        </div>
      </div>
    </aside>
  )
}
