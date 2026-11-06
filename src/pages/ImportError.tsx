import React from 'react'
import { Header } from '../components/Header'

interface ImportErrorProps {
  onReturn: () => void
}

export const ImportError: React.FC<ImportErrorProps> = ({ onReturn }) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Data Management"
        breadcrumb="Data Management / Import Error"
      />

      {/* Main Section Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Import failed: 20 records contain blocking schema errors
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Synthetic Demo Data · human review required where indicated
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-8">
        <div className="mb-6">
          <span className="inline-block bg-[#DC2626] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            IMPORT FAILED
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          Import failed: 20 records contain blocking schema errors
        </h3>

        <p className="text-xs text-slate-500 mb-8">
          Data Management / Import Error
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
