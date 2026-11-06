import React from 'react'
import { Header } from '../components/Header'

interface AuditTrailOverviewProps {
  onSelectEvent: (eventId: string) => void
  onOpenIntegrityCheck: () => void
}

export const AuditTrailOverview: React.FC<AuditTrailOverviewProps> = ({
  onSelectEvent,
  onOpenIntegrityCheck
}) => {
  const events = [
    {
      id: 'EVT-1030-882',
      type: 'Schedule approved',
      timestamp: '30 Oct 10:42',
      actor: 'Ana Putri',
      status: '8/8 verified'
    },
    {
      id: 'EVT-1030-881',
      type: 'Batch created',
      timestamp: '30 Oct 10:18',
      actor: 'System',
      status: '8/8 verified'
    },
    {
      id: 'EVT-1030-880',
      type: 'Tanker received',
      timestamp: '30 Oct 09:18',
      actor: 'R. Wijaya',
      status: '8/8 verified'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Audit Trail"
        breadcrumb="Audit Trail / Overview"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Audit trail
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Supporting integrity evidence for operational records
        </p>
      </div>

      {/* 2 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Card 1 */}
        <div
          onClick={onOpenIntegrityCheck}
          className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs cursor-pointer hover:border-green-300 transition-colors"
        >
          <p className="text-3xl font-bold text-[#16A34A] tracking-tight">
            8 / 8
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            verification indicator
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            1,248
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            events recorded
          </p>
        </div>
      </div>

      {/* Events Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Event ID</th>
                <th className="py-4 px-6 font-semibold">Event type</th>
                <th className="py-4 px-6 font-semibold">Timestamp</th>
                <th className="py-4 px-6 font-semibold">Actor</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {events.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => onSelectEvent(e.id)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-bold text-slate-900 font-mono text-xs">
                    {e.id}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {e.type}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {e.timestamp}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {e.actor}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {e.status}
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
