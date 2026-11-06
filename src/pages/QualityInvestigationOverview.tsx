import React from 'react'
import { Header } from '../components/Header'

interface QualityInvestigationOverviewProps {
  onSelectInvestigation: (id: string) => void
}

export const QualityInvestigationOverview: React.FC<QualityInvestigationOverviewProps> = ({
  onSelectInvestigation
}) => {
  const investigations = [
    {
      id: 'QI-2026-014',
      category: 'Lab result review',
      entity: 'TRK-042 / ST-04',
      status: 'Under Investigation'
    },
    {
      id: 'QI-2026-013',
      category: 'Process deviation',
      entity: 'B-2026-1029-06',
      status: 'Closed'
    },
    {
      id: 'QI-2026-012',
      category: 'Packaging observation',
      entity: 'FG-1029-04',
      status: 'Potentially Affected'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Quality Investigation"
        breadcrumb="Quality Investigation / Overview"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Quality investigation
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Use traceability to separate confirmed and potential impact
        </p>
      </div>

      {/* Top Action Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            New investigation
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Start from a material, batch, or finished goods lot
          </p>
        </div>

        <button
          onClick={() => onSelectInvestigation('QI-2026-014')}
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          Create investigation
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Investigation ID</th>
                <th className="py-4 px-6 font-semibold">Issue category</th>
                <th className="py-4 px-6 font-semibold">Affected entity</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {investigations.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectInvestigation(row.id)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-bold text-slate-900 font-mono text-xs">
                    {row.id}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.category}
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-mono text-xs">
                    {row.entity}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
