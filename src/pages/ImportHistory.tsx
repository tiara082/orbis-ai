import React from 'react'
import { Header } from '../components/Header'

export const ImportHistory: React.FC = () => {
  const historyData = [
    {
      importId: 'IMP-1030-04',
      file: 'production_shift_A.xlsx',
      records: '1,248',
      actor: 'Ana Putri',
      status: 'Imported'
    },
    {
      importId: 'IMP-1030-03',
      file: 'tanker_receipts_30oct.xlsx',
      records: '84',
      actor: 'Raka Wijaya',
      status: 'Review'
    },
    {
      importId: 'IMP-0929-02',
      file: 'batch_master_sep.xlsx',
      records: '3,920',
      actor: 'System',
      status: 'Imported'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Data Management"
        breadcrumb="Data Management / Import History"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Import history
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track who imported data and how validation performed
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Import ID</th>
                <th className="py-4 px-6 font-semibold">File</th>
                <th className="py-4 px-6 font-semibold">Records</th>
                <th className="py-4 px-6 font-semibold">Actor</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {historyData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 font-mono text-xs">
                    {row.importId}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.file}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.records}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.actor}
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
