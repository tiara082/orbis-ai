import React from 'react'
import { Header } from '../components/Header'

interface DataManagementOverviewProps {
  onOpenUpload: () => void
  onOpenRecent: () => void
}

export const DataManagementOverview: React.FC<DataManagementOverviewProps> = ({
  onOpenUpload,
  onOpenRecent
}) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Data Management"
        breadcrumb="Data Management / Overview"
      />

      {/* Main Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Data Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Governed ingestion and validation for operational production data
        </p>
      </div>

      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Card 1: Smart Excel ingestion */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Smart Excel ingestion
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Map spreadsheets with AI assistance
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={onOpenUpload}
              className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider transition-colors"
            >
              OPEN
            </button>
          </div>
        </div>

        {/* Card 2: Recent imports */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recent imports
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              production_shift_A.xlsx · 1,248 records
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={onOpenRecent}
              className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider transition-colors"
            >
              OPEN
            </button>
          </div>
        </div>

        {/* Card 3: Validation health */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Validation health
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              98.4% · 20 need review
            </p>
          </div>
          <div className="mt-6">
            <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1 rounded-full">
              98.4%
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
                <th className="py-4 px-6 font-semibold">File</th>
                <th className="py-4 px-6 font-semibold">Rows</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Imported</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">
                  production_shift_A.xlsx
                </td>
                <td className="py-4 px-6 text-slate-600">
                  1,248
                </td>
                <td className="py-4 px-6 text-slate-700">
                  Imported
                </td>
                <td className="py-4 px-6 text-slate-600">
                  30 Oct 2026
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">
                  tanker_receipts_30oct.xlsx
                </td>
                <td className="py-4 px-6 text-slate-600">
                  84
                </td>
                <td className="py-4 px-6 text-slate-700">
                  Needs review
                </td>
                <td className="py-4 px-6 text-slate-600">
                  —
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">
                  batch_master_sep.xlsx
                </td>
                <td className="py-4 px-6 text-slate-600">
                  3,920
                </td>
                <td className="py-4 px-6 text-slate-700">
                  Imported
                </td>
                <td className="py-4 px-6 text-slate-600">
                  29 Sep 2026
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
