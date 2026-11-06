import React from 'react'

export const DesignSystem: React.FC = () => {
  const colors = [
    { name: 'Primary Navy', hex: '#142B49', bg: 'bg-[#142B49]', text: 'text-white' },
    { name: 'AI Blue', hex: '#2563EB', bg: 'bg-[#2563EB]', text: 'text-white' },
    { name: 'Success', hex: '#16A34A', bg: 'bg-[#16A34A]', text: 'text-white' },
    { name: 'Warning', hex: '#D97706', bg: 'bg-[#D97706]', text: 'text-white' },
    { name: 'Critical', hex: '#DC2626', bg: 'bg-[#DC2626]', text: 'text-white' },
    { name: 'Surface', hex: '#E2E8F0', bg: 'bg-[#E2E8F0]', text: 'text-slate-800', border: 'border border-slate-300' }
  ]

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          ORBIS Design System
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          foundations and reusable UI patterns
        </p>
      </div>

      {/* Color Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-14">
        {colors.map((color) => (
          <div key={color.name} className="flex flex-col">
            <div
              className={`h-24 w-full rounded-xl ${color.bg} ${color.border || ''} shadow-xs mb-3`}
            ></div>
            <span className="text-xs font-bold text-slate-900">{color.name}</span>
            <span className="text-xs text-slate-400 font-mono mt-0.5">{color.hex}</span>
          </div>
        ))}
      </div>

      {/* Typography */}
      <div className="mb-14">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Typography
        </h2>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Production Planning
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          AI recommendation · Constraint validation · Human approval
        </p>
      </div>

      {/* Components */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-5">
          Components
        </h2>

        <div className="flex flex-wrap items-center gap-6">
          <span className="bg-[#2563EB] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            AI INSIGHT
          </span>

          <span className="bg-[#16A34A] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            VALIDATED
          </span>

          <span className="bg-[#D97706] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            REVIEW
          </span>

          <button className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors ml-4 shadow-2xs">
            Simulate Changes
          </button>

          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-[#2563EB] text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs">
            Compare Schedules
          </button>
        </div>
      </div>
    </div>
  )
}
