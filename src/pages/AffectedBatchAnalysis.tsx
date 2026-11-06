import React from 'react'
import { Header } from '../components/Header'

interface AffectedBatchAnalysisProps {
  onOpenAffectedProducts?: () => void
}

export const AffectedBatchAnalysis: React.FC<AffectedBatchAnalysisProps> = ({
  onOpenAffectedProducts
}) => {
  const rows = [
    {
      entity: 'TRK-042',
      direction: 'Source → batch',
      impact: 'Confirmed relationship',
      review: 'Open'
    },
    {
      entity: 'ST-04',
      direction: 'Source → batch',
      impact: 'Confirmed relationship',
      review: 'Open'
    },
    {
      entity: 'B-2026-1030-01',
      direction: 'Source → finished lot',
      impact: 'Potentially affected',
      review: 'Review',
      clickable: true
    },
    {
      entity: 'FG-1030-01',
      direction: 'Forward result',
      impact: 'Potentially affected',
      review: 'Hold review'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Quality Investigation"
        breadcrumb="Quality Investigation / Affected Batch Analysis"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Affected batch analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Forward and backward trace results for human review
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Entity</th>
                <th className="py-4 px-6 font-semibold">Trace direction</th>
                <th className="py-4 px-6 font-semibold">Impact classification</th>
                <th className="py-4 px-6 font-semibold">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rows.map((r, idx) => (
                <tr
                  key={idx}
                  onClick={r.clickable && onOpenAffectedProducts ? onOpenAffectedProducts : undefined}
                  className={`hover:bg-slate-50/50 transition-colors ${
                    r.clickable ? 'cursor-pointer hover:bg-amber-50/30' : ''
                  }`}
                >
                  <td className="py-4 px-6 font-bold text-slate-900 font-mono text-xs">
                    {r.entity}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {r.direction}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {r.impact}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {r.review}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Summary Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          Investigation summary
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Trace relationships are recorded; impact classification remains subject to quality review.
        </p>
      </div>
    </div>
  )
}
