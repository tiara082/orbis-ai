import React from 'react'
import { Header } from '../components/Header'

interface ImportPreviewProps {
  onConfirm: () => void
}

export const ImportPreview: React.FC<ImportPreviewProps> = ({ onConfirm }) => {
  const previewData = [
    {
      batchId: 'B-2026-1030-01',
      tankId: 'ST-04',
      volume: '8,200 L',
      date: '30 Oct',
      validation: 'Valid'
    },
    {
      batchId: 'B-2026-1030-02',
      tankId: 'ST-04',
      volume: '6,300 L',
      date: '30 Oct',
      validation: 'Valid'
    },
    {
      batchId: 'B-2026-1030-03',
      tankId: 'ST-02',
      volume: '3,920 L',
      date: '30 Oct',
      validation: 'Valid'
    },
    {
      batchId: 'B-2026-1030-04',
      tankId: 'ST-07',
      volume: '1,880 L',
      date: '30 Oct',
      validation: 'Review'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Data Management"
        breadcrumb="Data Management / Import Preview"
      />

      {/* Main Heading */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Import preview
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Confirm records and event ledger before import
        </p>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          READY FOR CONFIRMATION
        </span>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Batch ID</th>
                <th className="py-4 px-6 font-semibold">Tank ID</th>
                <th className="py-4 px-6 font-semibold">Volume</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {previewData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 font-mono text-xs">
                    {row.batchId}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.tankId}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.volume}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {row.date}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-700 font-normal">
                      {row.validation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          Import creates a governed event ledger entry; it does not infer missing relationships.
        </p>
        <button
          onClick={onConfirm}
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs self-end sm:self-auto shrink-0"
        >
          Confirm import
        </button>
      </div>
    </div>
  )
}
