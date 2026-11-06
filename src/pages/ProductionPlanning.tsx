import React from 'react'
import { Header } from '../components/Header'
import { Sparkles } from 'lucide-react'

interface ProductionPlanningProps {
  onOpenRecommendation?: () => void
}

export const ProductionPlanning: React.FC<ProductionPlanningProps> = ({ onOpenRecommendation }) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Production Planning"
        subtitle="AI-assisted scheduling for raw milk, tanks, and filling lines"
      />

      {/* 5 KPI Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
            AVAILABLE RAW MILK
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            18,420 L
          </p>
          <p className="text-xs font-semibold text-[#16A34A] mt-1">
            +8.4% vs yesterday
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
            PLANNED ORDERS
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            12
          </p>
          <p className="text-xs font-semibold text-[#2563EB] mt-1">
            3 due this shift
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
            TANK UTILIZATION
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            72%
          </p>
          <p className="text-xs font-semibold text-[#16A34A] mt-1">
            Within operating range
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
            ACTIVE LINES
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            2 / 2
          </p>
          <p className="text-xs font-semibold text-[#16A34A] mt-1">
            Ready to run
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
            SCHEDULE ALERTS
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            2
          </p>
          <p className="text-xs font-semibold text-[#D97706] mt-1">
            Needs review
          </p>
        </div>
      </div>

      {/* Middle Section: Shift outlook & Production schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left: Shift Outlook */}
        <div
          onClick={onOpenRecommendation}
          className={`lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between ${
            onOpenRecommendation ? 'cursor-pointer hover:border-blue-300 transition-colors' : ''
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] mb-2 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />
              <span>AI INTELLIGENCE</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Shift outlook
              </h2>
            </div>

            <div className="mb-4">
              <span className="inline-block bg-[#16A34A] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                ANALYSIS READY
              </span>
            </div>

            <div className="mt-5">
              <p className="text-xs text-slate-500 font-medium">Predicted bottleneck</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                Flavour changeover may add 45 min
              </p>
              <p className="text-sm text-slate-600">
                to the afternoon sequence.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700">
                Recommendation: run Full Cream before Strawberry
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-6">
            Confidence is model output — validate constraints before approval.
          </p>
        </div>

        {/* Right: Production schedule */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Production schedule
              </h2>
              <span className="text-xs font-medium text-slate-500">
                Today · 07:00–19:00
              </span>
            </div>

            {/* Timeline Rows */}
            <div className="space-y-6 pt-2">
              {/* Row 1: Filling Machine 1 */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700 w-32 shrink-0">
                  Filling Machine 1
                </span>
                <div className="flex-1 flex items-center gap-2 relative">
                  <div className="w-[38%] bg-[#2563EB] text-white text-[11px] font-semibold py-2 px-3 rounded-lg text-center truncate shadow-2xs">
                    Full Cream 1L
                  </div>
                  <div className="w-[30%] bg-[#7C3AED] text-white text-[11px] font-semibold py-2 px-3 rounded-lg text-center truncate shadow-2xs">
                    Strawberry 1L
                  </div>
                  <div className="w-[28%] bg-[#2563EB] text-white text-[11px] font-semibold py-2 px-3 rounded-lg text-center truncate shadow-2xs">
                    Full Cream 250ml
                  </div>
                </div>
              </div>

              {/* Row 2: Filling Machine 2 */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700 w-32 shrink-0">
                  Filling Machine 2
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-[12%]"></div>
                  <div className="w-[35%] bg-[#7C3AED] text-white text-[11px] font-semibold py-2 px-3 rounded-lg text-center truncate shadow-2xs">
                    Strawberry 250ml
                  </div>
                  <div className="w-[12%]"></div>
                  <div className="w-[38%] bg-[#2563EB] text-white text-[11px] font-semibold py-2 px-3 rounded-lg text-center truncate shadow-2xs">
                    Full Cream 1L
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time axis markers */}
          <div className="pt-6 border-t border-slate-100 mt-6">
            <div className="flex justify-between text-xs font-medium text-slate-400 pl-36 pr-4">
              <span>07:00</span>
              <span>11:00</span>
              <span>15:00</span>
              <span>19:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Operational status & Schedule alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Operational status */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-5">
            Operational status
          </h2>

          <div className="space-y-4">
            {/* Item 1 */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100/80">
              <span className="text-sm text-slate-600">Raw milk availability</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-900">
                  18,420 L / 24,000 L
                </span>
                <span className="bg-[#16A34A] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  77%
                </span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100/80">
              <span className="text-sm text-slate-600">Storage Tank ST-04</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-900">
                  8,200 L / 12,000 L
                </span>
                <span className="bg-[#16A34A] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  68%
                </span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100/80">
              <span className="text-sm text-slate-600">Aseptic Tank AT-02</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-900">
                  6,300 L / 12,000 L
                </span>
                <span className="bg-[#16A34A] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  52.5% · 2 fillers enabled
                </span>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-600">Machine readiness</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-900">
                  Filling 1 + Filling 2
                </span>
                <span className="bg-[#16A34A] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Schedule alerts */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
              Schedule alerts
            </h2>

            <div className="mb-4">
              <span className="inline-block bg-[#D97706] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                2 REVIEW ITEMS
              </span>
            </div>

            <ul className="space-y-3 mt-4 text-sm text-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-slate-900 font-bold">•</span>
                <span>Changeover window is 45 min</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-900 font-bold">•</span>
                <span>AT-02 threshold validated at 52.5%</span>
              </li>
            </ul>
          </div>

          <p className="text-[11px] text-slate-400 mt-8">
            Synthetic data · Constraint rules shown separately from AI forecasts.
          </p>
        </div>
      </div>
    </div>
  )
}
