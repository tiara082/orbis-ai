import React from 'react'
import { Header } from '../components/Header'

interface TankerLabPendingProps {
  onReturn: () => void
}

export const TankerLabPending: React.FC<TankerLabPendingProps> = ({ onReturn }) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Incoming Tanker"
        breadcrumb="Incoming Tanker / TRK-042 / Lab Status"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Lab result pending · release decision unavailable
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Synthetic Demo Data · human review required where indicated
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-8">
        <div className="mb-6">
          <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            LAB PENDING
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          Lab result pending · release decision unavailable
        </h3>

        <p className="text-xs text-slate-500 mb-8">
          Incoming Tanker / TRK-042 / Lab Status
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
