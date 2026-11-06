import React from 'react'
import { Header } from '../components/Header'

export const TankerUnloading: React.FC = () => {
  const events = [
    {
      event: 'Unloading started',
      timestamp: '10:02',
      actor: 'Receiving operator',
      status: 'Recorded'
    },
    {
      event: 'Transfer checkpoint',
      timestamp: '10:18',
      actor: 'System',
      status: 'Recorded'
    },
    {
      event: 'Storage confirmation',
      timestamp: 'Pending',
      actor: '—',
      status: 'Open'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Incoming Tanker"
        breadcrumb="Incoming Tanker / TRK-042 / Unloading"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Unloading detail
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track transfer into destination storage tank
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs mb-6">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          TRK-042 → ST-04
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
          8,200 L planned · 4,920 L transferred
        </p>

        <div className="flex items-center gap-4">
          <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
              style={{ width: '60%' }}
            ></div>
          </div>
          <span className="inline-block bg-[#2563EB] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
            60% COMPLETE
          </span>
        </div>
      </div>

      {/* Events Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Event</th>
                <th className="py-4 px-6 font-semibold">Timestamp</th>
                <th className="py-4 px-6 font-semibold">Actor</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {events.map((e, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {e.event}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {e.timestamp}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {e.actor}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-700 font-normal">
                      {e.status}
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
