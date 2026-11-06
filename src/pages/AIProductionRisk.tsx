import React from 'react'
import { Header } from '../components/Header'

export const AIProductionRisk: React.FC = () => {
  const risks = [
    {
      badge: 'DELAYED TANKER',
      badgeColor: 'bg-[#DC2626]',
      title: 'TRK-045 · +35 min',
      description: 'Potential raw milk availability gap'
    },
    {
      badge: 'RAW MILK AVAILABILITY',
      badgeColor: 'bg-[#D97706]',
      title: '18,420 L → 13,620 L available',
      description: 'Demand coverage requires review'
    },
    {
      badge: 'TANK CAPACITY',
      badgeColor: 'bg-[#16A34A]',
      title: 'AT-02 · 6,300 / 12,000 L',
      description: 'Two-filler threshold passes at 52.5%'
    },
    {
      badge: 'SCHEDULE CONFLICT',
      badgeColor: 'bg-[#D97706]',
      title: 'Strawberry order after Full Cream',
      description: '45 min changeover remains required'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="AI Intelligence"
        breadcrumb="AI Intelligence / Production Risk"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Production risk analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Risks detected from the delayed tanker scenario
        </p>
      </div>

      {/* 4 Risk Cards Stack */}
      <div className="space-y-4 mb-6">
        {risks.map((risk, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="shrink-0 w-52">
              <span
                className={`inline-block ${risk.badgeColor} text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}
              >
                {risk.badge}
              </span>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {risk.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {risk.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Card: Downstream impact */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          Downstream impact
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Delay today may affect tomorrow's planned sequence; warehouse and packaging are not used as scheduling constraints.
        </p>
      </div>
    </div>
  )
}
