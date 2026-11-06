import React from 'react'
import { Header } from '../components/Header'

interface PlanningRejectionProps {
  onReturn: () => void
}

export const PlanningRejection: React.FC<PlanningRejectionProps> = ({ onReturn }) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Production Planning"
        breadcrumb="Production Planning / Rejection"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Alternative rejected; baseline schedule remains active
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Synthetic Demo Data · human review required where indicated
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-8">
        <div className="mb-6">
          <span className="inline-block bg-[#DC2626] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            REJECTED
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          Alternative rejected; baseline schedule remains active
        </h3>

        <p className="text-xs text-slate-500 mb-8">
          Production Planning / Rejection
        </p>

        <button
          onClick={onReturn}
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          Return to workflow
        </button>
      </div>
    </div>
  )
}
