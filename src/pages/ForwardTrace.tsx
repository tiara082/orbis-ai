import React from 'react'
import { Header } from '../components/Header'

export const ForwardTrace: React.FC = () => {
  const steps = [
    {
      step: '1',
      entity: 'TRK-042',
      quantity: '8,200 L',
      timestamp: '30 Oct 09:18',
      relationship: 'SUPPLIED_TO'
    },
    {
      step: '2',
      entity: 'ST-04',
      quantity: '8,200 L',
      timestamp: '30 Oct 10:18',
      relationship: 'DISCHARGED_INTO'
    },
    {
      step: '3',
      entity: 'B-2026-1030-01',
      quantity: '8,200 L input',
      timestamp: '30 Oct 11:00',
      relationship: 'PRODUCED'
    },
    {
      step: '4',
      entity: 'FG-1030-01',
      quantity: 'Derived lot',
      timestamp: '30 Oct 14:00',
      relationship: 'FINISHED_GOODS'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Traceability"
        breadcrumb="Traceability / Forward Trace"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Forward trace · TRK-042
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Source tanker → storage tank → production batch → finished goods
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Step</th>
                <th className="py-4 px-6 font-semibold">Entity</th>
                <th className="py-4 px-6 font-semibold">Quantity</th>
                <th className="py-4 px-6 font-semibold">Timestamp</th>
                <th className="py-4 px-6 font-semibold">Relationship</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {steps.map((row) => (
                <tr key={row.step} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {row.step}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-700">
                    {row.entity}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.quantity}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {row.timestamp}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-700">
                    {row.relationship}
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
