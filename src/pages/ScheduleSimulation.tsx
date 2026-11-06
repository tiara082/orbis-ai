import React from 'react'
import { Header } from '../components/Header'

interface ScheduleSimulationProps {
  onApprove: () => void
}

export const ScheduleSimulation: React.FC<ScheduleSimulationProps> = ({ onApprove }) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Production Planning"
        breadcrumb="Production Planning / Schedule Simulation"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Schedule simulation · corrected operational logic
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          The 45-minute changeover is preserved because product order is unchanged.
        </p>
      </div>

      {/* Card 1: Baseline schedule */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs mb-5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-3">
          Baseline schedule
        </h3>

        <div className="text-xs sm:text-sm text-slate-800 font-medium flex flex-wrap items-center gap-2 mb-4">
          <span>Full Cream 1L 07:00–10:00</span>
          <span className="text-slate-400">→</span>
          <span>Changeover 10:00–10:45</span>
          <span className="text-slate-400">→</span>
          <span>Strawberry 1L 10:45–13:45</span>
        </div>

        <div>
          <span className="inline-block bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            13:45 COMPLETE
          </span>
        </div>
      </div>

      {/* Card 2: Valid alternative sequence */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs mb-5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-3">
          Valid alternative sequence
        </h3>

        <div className="text-xs sm:text-sm text-slate-800 font-medium flex flex-wrap items-center gap-2 mb-4">
          <span>Strawberry 1L 07:00–10:00</span>
          <span className="text-slate-400">→</span>
          <span>Changeover 10:00–10:45</span>
          <span className="text-slate-400">→</span>
          <span>Full Cream 1L 10:45–13:45</span>
        </div>

        <div>
          <span className="inline-block bg-[#7C3AED] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            13:45 COMPLETE
          </span>
        </div>
      </div>

      {/* Card 3: Optimization result */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs mb-8">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-3">
          Optimization result
        </h3>

        <p className="text-xs sm:text-sm font-bold text-[#DC2626] mb-2">
          No time saved: both sequences contain one product transition and the same 45-minute changeover.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          The alternative may change downstream priority, but it does not eliminate the changeover.
        </p>

        <p className="text-xs sm:text-sm font-semibold text-[#16A34A]">
          Constraint validation: AT-02 = 6,300 / 12,000 L = 52.5%; two filling machines permitted.
        </p>
      </div>

      {/* Bottom Action Button */}
      <div className="flex justify-end">
        <button
          onClick={onApprove}
          className="bg-[#16A34A] hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          Approve sequence
        </button>
      </div>
    </div>
  )
}
