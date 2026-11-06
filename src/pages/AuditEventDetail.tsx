import React from 'react'
import { Header } from '../components/Header'

export const AuditEventDetail: React.FC = () => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Audit Trail"
        breadcrumb="Audit Trail / Event Detail"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Event EVT-1030-882
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Schedule approval event · supporting integrity evidence
        </p>
      </div>

      {/* Detail Card (2 Column Grid) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          {/* Row 1 Left */}
          <div>
            <p className="text-xs text-slate-500 font-medium">Event type</p>
            <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              Schedule approved
            </p>
          </div>

          {/* Row 1 Right */}
          <div>
            <p className="text-xs text-slate-500 font-medium">Related batch</p>
            <p className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-1">
              B-2026-1030-01
            </p>
          </div>

          {/* Row 2 Left */}
          <div>
            <p className="text-xs text-slate-500 font-medium">Actor</p>
            <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              Ana Putri · Production Planner
            </p>
          </div>

          {/* Row 2 Right */}
          <div>
            <p className="text-xs text-slate-500 font-medium">Timestamp</p>
            <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              30 Oct 2026 · 10:42
            </p>
          </div>

          {/* Row 3 Left */}
          <div>
            <p className="text-xs text-slate-500 font-medium">Previous record reference</p>
            <p className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-1">
              EVT-1030-881
            </p>
          </div>

          {/* Row 3 Right */}
          <div>
            <p className="text-xs text-slate-500 font-medium">Integrity status</p>
            <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              Hash recorded · 8/8 verified
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
