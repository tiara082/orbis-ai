import React from 'react'
import { Header } from '../components/Header'

interface TraceabilityOverviewProps {
  onOpenGraph: () => void
  onOpenForward?: () => void
  onOpenBackward?: () => void
}

export const TraceabilityOverview: React.FC<TraceabilityOverviewProps> = ({
  onOpenGraph,
  onOpenForward,
  onOpenBackward
}) => {
  const tableData = [
    {
      entity: 'Tanker',
      id: 'TRK-042',
      relationship: 'SUPPLIED_TO ST-04',
      status: 'Recorded'
    },
    {
      entity: 'Storage tank',
      id: 'ST-04',
      relationship: 'BLENDED_FROM TRK-042',
      status: 'Recorded'
    },
    {
      entity: 'Production batch',
      id: 'B-2026-1030-01',
      relationship: 'PRODUCED',
      status: 'Recorded'
    },
    {
      entity: 'Finished lot',
      id: 'FG-1030-01',
      relationship: 'Derived from batch',
      status: 'Recorded'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Traceability"
        breadcrumb="Traceability / Overview"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Traceability overview
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Graph-based material relationships from farm to finished goods
        </p>
      </div>

      {/* 3 Action / Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Card 1 */}
        <div
          onClick={onOpenGraph}
          className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Search relationship
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Batch, tank, tanker, or lot ID
            </p>
          </div>
          <div>
            <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              READY
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={onOpenForward || onOpenGraph}
          className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Forward trace
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Raw material → finished goods
            </p>
          </div>
          <div>
            <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              READY
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={onOpenBackward || onOpenGraph}
          className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Backward trace
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Finished goods → source material
            </p>
          </div>
          <div>
            <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              READY
            </span>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Entity</th>
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-6 font-semibold">Relationship</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={onOpenGraph}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {row.entity}
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-mono text-xs">
                    {row.id}
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-mono text-xs">
                    {row.relationship}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-700 font-normal">
                      {row.status}
                    </span>
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
