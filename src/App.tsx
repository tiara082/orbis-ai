import React, { useEffect, useRef, useState } from 'react'
import { Sidebar, type NavPage } from './components/Sidebar'

// Production Planning
import { ProductionPlanning } from './pages/ProductionPlanning'
import { AIRecommendation } from './pages/AIRecommendation'
import { ScheduleSimulation } from './pages/ScheduleSimulation'
import { PlanningApproval } from './pages/PlanningApproval'
import { PlanningRejection } from './pages/PlanningRejection'

// AI Intelligence
import { AIPredictionDetail } from './pages/AIPredictionDetail'
import { AIProductionRisk } from './pages/AIProductionRisk'
import { PredictionInsufficient } from './pages/PredictionInsufficient'

// Incoming Tanker
import { TankerOverview } from './pages/TankerOverview'
import { TankerDetail } from './pages/TankerDetail'
import { TankerLabStatus } from './pages/TankerLabStatus'
import { TankerLabPending } from './pages/TankerLabPending'
import { TankerUnloading } from './pages/TankerUnloading'
import { TankerDelayed } from './pages/TankerDelayed'

// Data Management
import { DataManagementOverview } from './pages/DataManagementOverview'
import { ExcelUpload } from './pages/ExcelUpload'
import { ColumnMapping } from './pages/ColumnMapping'
import { ValidationRecords } from './pages/ValidationRecords'
import { ImportPreview } from './pages/ImportPreview'
import { ImportHistory } from './pages/ImportHistory'
import { ImportError } from './pages/ImportError'
import { ColumnMappingReview } from './pages/ColumnMappingReview'

// Traceability
import { TraceabilityOverview } from './pages/TraceabilityOverview'
import { MaterialGraph } from './pages/MaterialGraph'
import { ForwardTrace } from './pages/ForwardTrace'
import { BackwardTrace } from './pages/BackwardTrace'
import { BatchDetail } from './pages/BatchDetail'

// Quality Investigation
import { QualityInvestigationOverview } from './pages/QualityInvestigationOverview'
import { QualityInvestigationDetail } from './pages/QualityInvestigationDetail'
import { AffectedBatchAnalysis } from './pages/AffectedBatchAnalysis'
import { AffectedProducts } from './pages/AffectedProducts'

// Audit Trail
import { AuditTrailOverview } from './pages/AuditTrailOverview'
import { AuditEventDetail } from './pages/AuditEventDetail'
import { AuditIntegrityCheck } from './pages/AuditIntegrityCheck'

import { Menu, X } from 'lucide-react'

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('production-planning')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [currentPage])

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }

  const renderContent = () => {
    switch (currentPage) {
      // Production Planning & AI Optimization
      case 'production-planning':
        return (
          <ProductionPlanning
            onOpenRecommendation={() => setCurrentPage('ai-recommendation')}
          />
        )
      case 'ai-recommendation':
        return (
          <AIRecommendation
            onCompareSchedule={() => setCurrentPage('schedule-simulation')}
            onApprove={() => setCurrentPage('planning-approval')}
          />
        )
      case 'schedule-simulation':
        return (
          <ScheduleSimulation
            onApprove={() => setCurrentPage('planning-approval')}
          />
        )
      case 'planning-approval':
        return (
          <PlanningApproval
            onReturn={() => setCurrentPage('production-planning')}
          />
        )
      case 'planning-rejection':
        return (
          <PlanningRejection
            onReturn={() => setCurrentPage('production-planning')}
          />
        )

      // AI Intelligence
      case 'ai-prediction-detail':
        return <AIPredictionDetail />
      case 'ai-production-risk':
        return <AIProductionRisk />
      case 'prediction-insufficient':
        return (
          <PredictionInsufficient
            onReturn={() => setCurrentPage('ai-prediction-detail')}
          />
        )

      // Incoming Tanker
      case 'tanker-overview':
        return (
          <TankerOverview
            onSelectTanker={(id) => {
              if (id === 'TRK-045') {
                setCurrentPage('tanker-delayed')
              } else {
                setCurrentPage('tanker-detail')
              }
            }}
          />
        )
      case 'tanker-detail':
        return (
          <TankerDetail
            onOpenLabStatus={() => setCurrentPage('tanker-lab-status')}
          />
        )
      case 'tanker-lab-status':
        return (
          <TankerLabStatus
            onRecordResult={() => setCurrentPage('tanker-unloading')}
          />
        )
      case 'tanker-lab-pending':
        return (
          <TankerLabPending
            onReturn={() => setCurrentPage('tanker-overview')}
          />
        )
      case 'tanker-unloading':
        return <TankerUnloading />
      case 'tanker-delayed':
        return (
          <TankerDelayed
            onReturn={() => setCurrentPage('tanker-overview')}
          />
        )

      // Data Management
      case 'data-management-overview':
        return (
          <DataManagementOverview
            onOpenUpload={() => setCurrentPage('data-management-upload')}
            onOpenRecent={() => setCurrentPage('data-management-history')}
          />
        )
      case 'data-management-upload':
        return (
          <ExcelUpload
            onAnalyze={() => setCurrentPage('data-management-mapping')}
          />
        )
      case 'data-management-mapping':
        return (
          <ColumnMapping
            onContinue={() => setCurrentPage('data-management-validation')}
            onReviewKeterangan={() => setCurrentPage('data-management-mapping-review')}
          />
        )
      case 'data-management-validation':
        return (
          <ValidationRecords
            onOpenPreview={() => setCurrentPage('data-management-preview')}
          />
        )
      case 'data-management-preview':
        return (
          <ImportPreview
            onConfirm={() => setCurrentPage('data-management-history')}
          />
        )
      case 'data-management-history':
        return <ImportHistory />
      case 'data-management-error':
        return (
          <ImportError
            onReturn={() => setCurrentPage('data-management-overview')}
          />
        )
      case 'data-management-mapping-review':
        return (
          <ColumnMappingReview
            onReturn={() => setCurrentPage('data-management-mapping')}
          />
        )

      // Traceability
      case 'traceability-overview':
        return (
          <TraceabilityOverview
            onOpenGraph={() => setCurrentPage('traceability-graph')}
            onOpenForward={() => setCurrentPage('traceability-forward')}
            onOpenBackward={() => setCurrentPage('traceability-backward')}
          />
        )
      case 'traceability-graph':
        return (
          <MaterialGraph
            onOpenBatchDetail={() => setCurrentPage('traceability-batch')}
          />
        )
      case 'traceability-forward':
        return <ForwardTrace />
      case 'traceability-backward':
        return <BackwardTrace />
      case 'traceability-batch':
        return <BatchDetail />

      // Quality Investigation
      case 'quality-investigation-overview':
        return (
          <QualityInvestigationOverview
            onSelectInvestigation={() => setCurrentPage('quality-investigation-detail')}
          />
        )
      case 'quality-investigation-detail':
        return (
          <QualityInvestigationDetail
            onOpenAnalysis={() => setCurrentPage('affected-batch-analysis')}
            onOpenAffectedProducts={() => setCurrentPage('affected-products')}
          />
        )
      case 'affected-batch-analysis':
        return (
          <AffectedBatchAnalysis
            onOpenAffectedProducts={() => setCurrentPage('affected-products')}
          />
        )
      case 'affected-products':
        return (
          <AffectedProducts
            onReturn={() => setCurrentPage('quality-investigation-overview')}
          />
        )

      // Audit Trail
      case 'audit-trail-overview':
        return (
          <AuditTrailOverview
            onSelectEvent={() => setCurrentPage('audit-event-detail')}
            onOpenIntegrityCheck={() => setCurrentPage('audit-integrity-check')}
          />
        )
      case 'audit-event-detail':
        return <AuditEventDetail />
      case 'audit-integrity-check':
        return <AuditIntegrityCheck />

      default:
        return <ProductionPlanning />
    }
  }

  return (
    <div className="h-screen overflow-hidden flex bg-[#F8FAFC]">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar for Desktop & Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform md:relative md:h-full md:shrink-0 md:translate-x-0 transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      </div>

      {/* Main Content Area */}
      <div ref={contentRef} className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#142B49] text-white">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded hover:bg-slate-700 focus:outline-hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="font-bold tracking-wider">ORBIS</div>
          <div className="text-xs text-slate-300">SHIFT A</div>
        </div>

        {/* Page Content */}
        <main className="flex-1 flex flex-col">{renderContent()}</main>
      </div>
    </div>
  )
}

export default App
