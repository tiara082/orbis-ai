import React from 'react'
import { Header } from '../components/Header'

interface ValidationRecordsProps {
  onOpenPreview: () => void
}

export const ValidationRecords: React.FC<ValidationRecordsProps> = ({ onOpenPreview }) => {
  const records = [
    {
      row: '#044',
      field: 'batch_id',
      issue: 'Missing value',
      resolution: 'Manual correction'
    },
    {
      row: '#218',
      field: 'volume_liter',
      issue: 'Unit ambiguous',
      resolution: 'Confirm liter'
    },
    {
      row: '#782',
      field: 'production_date',
      issue: 'Date format',
      resolution: 'Parsed automatically'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Data Management"
        breadcrumb="Data Management / Validation"
      />

      {/* Main Section Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Validate records
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Validation separates structural errors from records needing review
        </p>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            1,248
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            records analyzed
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-3xl font-bold text-[#16A34A] tracking-tight">
            1,228
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            valid records
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-3xl font-bold text-[#D97706] tracking-tight">
            20
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            need review
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-3xl font-bold text-[#DC2626] tracking-tight">
            0
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            blocking errors
          </p>
        </div>
      </div>

      {/* Issues Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Row</th>
                <th className="py-4 px-6 font-semibold">Field</th>
                <th className="py-4 px-6 font-semibold">Issue</th>
                <th className="py-4 px-6 font-semibold">Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {records.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {r.row}
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-mono text-xs">
                    {r.field}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {r.issue}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {r.resolution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="flex justify-end">
        <button
          onClick={onOpenPreview}
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          Open import preview
        </button>
      </div>
    </div>
  )
}
