import React, { useState } from 'react'
import { LayoutGrid, Settings } from 'lucide-react'
import type { NavPage } from './config/navigation'
import { AppShell } from './components/layout/AppShell'
import { PageHeader } from './components/layout/PageHeader'
import { EmptyState } from './components/common/EmptyState'

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

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('production-planning')

  const renderContent = () => {
    switch (currentPage) {
      // Production Planning
      case 'production-planning':
        return <ProductionPlanning onOpenRecommendation={() => setCurrentPage('ai-recommendation')} />
      case 'ai-recommendation':
        return (
          <AIRecommendation
            onCompareSchedule={() => setCurrentPage('schedule-simulation')}
            onApprove={() => setCurrentPage('planning-approval')}
            onReject={() => setCurrentPage('planning-rejection')}
          />
        )
      case 'schedule-simulation':
        return <ScheduleSimulation onApprove={() => setCurrentPage('planning-approval')} />
      case 'planning-approval':
        return <PlanningApproval onReturn={() => setCurrentPage('production-planning')} />
      case 'planning-rejection':
        return <PlanningRejection onReturn={() => setCurrentPage('production-planning')} />

      // AI Intelligence
      case 'ai-prediction-detail':
        return <AIPredictionDetail onOpenInsufficient={() => setCurrentPage('prediction-insufficient')} />
      case 'ai-production-risk':
        return <AIProductionRisk />
      case 'prediction-insufficient':
        return <PredictionInsufficient onReturn={() => setCurrentPage('ai-prediction-detail')} />

      // Incoming Tanker
      case 'tanker-overview':
        return (
          <TankerOverview
            onSelectTanker={(id) => setCurrentPage(id === 'TRK-045' ? 'tanker-delayed' : 'tanker-detail')}
          />
        )
      case 'tanker-detail':
        return <TankerDetail onOpenLabStatus={() => setCurrentPage('tanker-lab-status')} />
      case 'tanker-lab-status':
        return (
          <TankerLabStatus
            onRecordResult={() => setCurrentPage('tanker-unloading')}
            onOpenPending={() => setCurrentPage('tanker-lab-pending')}
          />
        )
      case 'tanker-lab-pending':
        return <TankerLabPending onReturn={() => setCurrentPage('tanker-overview')} />
      case 'tanker-unloading':
        return <TankerUnloading />
      case 'tanker-delayed':
        return <TankerDelayed onReturn={() => setCurrentPage('tanker-overview')} />

      // Data Management
      case 'data-management-overview':
        return (
          <DataManagementOverview
            onOpenUpload={() => setCurrentPage('data-management-upload')}
            onOpenRecent={() => setCurrentPage('data-management-history')}
          />
        )
      case 'data-management-upload':
        return <ExcelUpload onAnalyze={() => setCurrentPage('data-management-mapping')} />
      case 'data-management-mapping':
        return (
          <ColumnMapping
            onContinue={() => setCurrentPage('data-management-validation')}
            onReviewKeterangan={() => setCurrentPage('data-management-mapping-review')}
          />
        )
      case 'data-management-validation':
        return <ValidationRecords onOpenPreview={() => setCurrentPage('data-management-preview')} />
      case 'data-management-preview':
        return <ImportPreview onConfirm={() => setCurrentPage('data-management-history')} />
      case 'data-management-history':
        return <ImportHistory onOpenError={() => setCurrentPage('data-management-error')} />
      case 'data-management-error':
        return <ImportError onReturn={() => setCurrentPage('data-management-overview')} />
      case 'data-management-mapping-review':
        return <ColumnMappingReview onReturn={() => setCurrentPage('data-management-mapping')} />

      // Traceability
      case 'traceability-overview':
        return (
          <TraceabilityOverview
            onOpenGraph={() => setCurrentPage('traceability-graph')}
            onOpenForward={() => setCurrentPage('traceability-forward')}
            onOpenBackward={() => setCurrentPage('traceability-backward')}
            onOpenBatch={() => setCurrentPage('traceability-batch')}
          />
        )
      case 'traceability-graph':
        return <MaterialGraph onOpenBatchDetail={() => setCurrentPage('traceability-batch')} />
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
        return <AffectedBatchAnalysis onOpenAffectedProducts={() => setCurrentPage('affected-products')} />
      case 'affected-products':
        return <AffectedProducts onReturn={() => setCurrentPage('quality-investigation-overview')} />

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

      // System
      case 'dashboard':
        return (
          <>
            <PageHeader title="Dashboard" description="Plant-wide summary across planning and traceability" />
            <EmptyState
              icon={LayoutGrid}
              title="Dashboard is coming soon"
              description="Use Production Planning or Traceability to explore the prototype flow."
              action={{ label: 'Open Production Planning', onClick: () => setCurrentPage('production-planning') }}
            />
          </>
        )
      case 'settings':
        return (
          <>
            <PageHeader title="Settings" description="Workspace, shift and integration preferences" />
            <EmptyState
              icon={Settings}
              title="Settings are coming soon"
              description="This prototype runs on synthetic operational data only."
            />
          </>
        )
    }
  }

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </AppShell>
  )
}

export default App
