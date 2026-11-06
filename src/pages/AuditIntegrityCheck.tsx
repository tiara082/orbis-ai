import React from 'react'
import { Header } from '../components/Header'

export const AuditIntegrityCheck: React.FC = () => {
  const checkData = [
    {
      reference: 'Record hash',
      value: 'sha256: demo-8f3a...',
      status: 'Match'
    },
    {
      reference: 'Previous reference',
      value: 'EVT-1030-881',
      status: 'Match'
    },
    {
      reference: 'Verification status',
      value: '8/8 verified',
      status: 'Recorded'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Audit Trail"
        breadcrumb="Audit Trail / Integrity Check"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Integrity check
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compare operational references with integrity evidence
        </p>
      </div>

      {/* Top Status Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs mb-6">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight font-mono">
          EVT-1030-882
        </h3>

        <div className="my-3">
          <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            INTEGRITY MATCH
          </span>
        </div>

        <p className="text-sm font-medium text-slate-900 mt-4">
          Operational database record matches stored integrity evidence.
        </p>

        <p className="text-xs text-slate-400 mt-1">
          8/8 is a progress indicator only; verification stages are not specified here.
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Reference</th>
                <th className="py-4 px-6 font-semibold">Value</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {checkData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {row.reference}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-700">
                    {row.value}
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
