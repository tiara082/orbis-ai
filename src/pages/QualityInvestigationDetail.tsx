import React from 'react'
import { Header } from '../components/Header'

interface QualityInvestigationDetailProps {
  onOpenAnalysis?: () => void
  onOpenAffectedProducts?: () => void
}

export const QualityInvestigationDetail: React.FC<QualityInvestigationDetailProps> = ({
  onOpenAnalysis,
  onOpenAffectedProducts
}) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Quality Investigation"
        breadcrumb="Quality Investigation / QI-2026-014"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Investigation QI-2026-014
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lab result review · Synthetic Demo Data
        </p>
      </div>

      {/* 2 Column Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Affected material */}
        <div
          onClick={onOpenAnalysis}
          className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs cursor-pointer hover:border-blue-300 transition-colors"
        >
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-5">
            Affected material
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Tanker</span>
              <span className="font-mono text-xs font-semibold text-slate-900">TRK-042</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Storage tank</span>
              <span className="font-mono text-xs font-semibold text-slate-900">ST-04</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Production batch</span>
              <span className="font-mono text-xs font-semibold text-slate-900">B-2026-1030-01</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Finished lot</span>
              <span className="font-mono text-xs font-semibold text-slate-900">FG-1030-01</span>
            </div>
          </div>
        </div>

        {/* Right Card: Traceability findings */}
        <div
          onClick={onOpenAffectedProducts}
          className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs cursor-pointer hover:border-amber-300 transition-colors"
        >
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-3">
            Traceability findings
          </h3>

          <div className="mb-6">
            <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              POTENTIAL IMPACT
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-[#DC2626] leading-relaxed">
            No contamination or physical condition is confirmed by ORBIS.
          </p>
        </div>
      </div>
    </div>
  )
}
