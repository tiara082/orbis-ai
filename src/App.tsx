import React, { useState } from 'react'
import { LayoutGrid, LogOut } from 'lucide-react'
import type { NavPage } from './config/navigation'
import { AppShell } from './components/layout/AppShell'
import { PageHeader } from './components/layout/PageHeader'
import { EmptyState } from './components/common/EmptyState'
import { useTranslation } from './lib/i18n'

// Production Planning
import { ProductionPlanning } from './pages/production-planning/ProductionPlanning'
import { AIRecommendation } from './pages/production-planning/AIRecommendation'
import { ScheduleSimulation } from './pages/production-planning/ScheduleSimulation'
import { PlanningApproval } from './pages/production-planning/PlanningApproval'
import { PlanningRejection } from './pages/production-planning/PlanningRejection'

// AI Intelligence
import { AIPredictionDetail } from './pages/ai-intelligence/AIPredictionDetail'
import { AIProductionRisk } from './pages/ai-intelligence/AIProductionRisk'
import { PredictionInsufficient } from './pages/ai-intelligence/PredictionInsufficient'

// Incoming Tanker
import { TankerOverview } from './pages/tanker/TankerOverview'
import { TankerDetail } from './pages/tanker/TankerDetail'
import { TankerLabStatus } from './pages/tanker/TankerLabStatus'
import { TankerLabPending } from './pages/tanker/TankerLabPending'
import { TankerUnloading } from './pages/tanker/TankerUnloading'
import { TankerDelayed } from './pages/tanker/TankerDelayed'

// Data Management
import { DataManagementOverview } from './pages/data-management/DataManagementOverview'
import { ExcelUpload } from './pages/data-management/ExcelUpload'
import { ColumnMapping } from './pages/data-management/ColumnMapping'
import { ValidationRecords } from './pages/data-management/ValidationRecords'
import { ImportPreview } from './pages/data-management/ImportPreview'
import { ImportHistory } from './pages/data-management/ImportHistory'
import { ImportError } from './pages/data-management/ImportError'
import { ColumnMappingReview } from './pages/data-management/ColumnMappingReview'

// Traceability
import { TraceabilityOverview } from './pages/traceability/TraceabilityOverview'
import { MaterialGraph } from './pages/traceability/MaterialGraph'
import { ForwardTrace } from './pages/traceability/ForwardTrace'
import { BackwardTrace } from './pages/traceability/BackwardTrace'
import { BatchDetail } from './pages/traceability/BatchDetail'

// Quality Investigation
import { QualityInvestigationOverview } from './pages/quality-investigation/QualityInvestigationOverview'
import { QualityInvestigationDetail } from './pages/quality-investigation/QualityInvestigationDetail'
import { AffectedBatchAnalysis } from './pages/quality-investigation/AffectedBatchAnalysis'
import { AffectedProducts } from './pages/quality-investigation/AffectedProducts'

// Audit Trail
import { AuditTrailOverview } from './pages/audit-trail/AuditTrailOverview'
import { AuditEventDetail } from './pages/audit-trail/AuditEventDetail'
import { AuditIntegrityCheck } from './pages/audit-trail/AuditIntegrityCheck'
import { Profile } from './pages/account/Profile'
import { AccountSettings } from './pages/account/Settings'

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('production-planning')
  const [signedOut, setSignedOut] = useState(false)
  const { t } = useTranslation()

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
            <PageHeader title={t('pages.dashboard.title')} description={t('pages.dashboard.description')} />
            <EmptyState
              icon={LayoutGrid}
              title={t('pages.dashboard.emptyTitle')}
              description={t('pages.dashboard.emptyDescription')}
              action={{ label: t('pages.dashboard.emptyAction'), onClick: () => setCurrentPage('production-planning') }}
            />
          </>
        )
      case 'profile':
        return <Profile />
      case 'settings':
        return <AccountSettings />
    }
  }

  if (signedOut) {
    return (
      <div className="h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <EmptyState
            icon={LogOut}
            title={t('pages.signedOut.title')}
            description={t('pages.signedOut.description')}
            action={{ label: t('shell.signIn'), onClick: () => setSignedOut(false) }}
          />
        </div>
      </div>
    )
  }

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage} onLogout={() => setSignedOut(true)}>
      {renderContent()}
    </AppShell>
  )
}

export default App
