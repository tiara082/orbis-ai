import React from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: string
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, breadcrumb }) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/80 mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {breadcrumb ? (
          <p className="text-xs text-slate-500 font-medium mt-1">{breadcrumb}</p>
        ) : subtitle ? (
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-4 self-end sm:self-auto">
        <span className="text-xs font-semibold text-slate-500 tracking-wider">
          30 OCT 2026 · SHIFT A
        </span>

        {/* Small circle status indicator */}
        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
        </div>

        {/* User avatar profile */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
            AP
          </div>
          <span className="text-sm font-semibold text-slate-800">Ana Putri</span>
        </div>
      </div>
    </header>
  )
}
