import React from 'react'
import { Header } from '../components/Header'
import { Sparkles } from 'lucide-react'

interface AIRecommendationProps {
  onCompareSchedule: () => void
  onApprove: () => void
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({
  onCompareSchedule,
  onApprove
}) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="AI Recommendation"
        subtitle="Review model output, validate constraints, then approve with confidence"
      />

      {/* Top Dark Banner Card */}
      <div className="bg-[#142B49] text-white p-6 rounded-xl shadow-xs mb-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-300 fill-blue-300" />
          <span>RECOMMENDED SEQUENCE</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Move Full Cream 1L before Strawberry 1L
          </h2>
          <span className="text-xs text-slate-300 font-medium">
            Expected impact: recover 45 min · keep both filling lines active
          </span>
        </div>
      </div>

      {/* 4 Process Cards (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Card 01 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#2563EB] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              01
            </span>
            <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
              AI FORECASTING
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            45 min delay predicted
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Based on changeover duration and order sequence.
          </p>
        </div>

        {/* Card 02 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#16A34A] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              02
            </span>
            <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
              CONSTRAINT VALIDATION
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Pass · AT-02 at 52.5%
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Two filling machines permitted above 50% capacity.
          </p>
        </div>

        {/* Card 03 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#2563EB] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              03
            </span>
            <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
              SCHEDULE OPTIMIZATION
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Alternative sequence found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Full Cream → Strawberry reduces transition risk.
          </p>
        </div>

        {/* Card 04 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#D97706] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              04
            </span>
            <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
              HUMAN APPROVAL
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Planner decision required
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            AI does not approve quality or production release.
          </p>
        </div>
      </div>

      {/* Bottom Card: Why this recommendation? */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs mb-8">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-3">
          Why this recommendation?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The model prioritizes the sequence with the lowest predicted transition delay.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
          Operational checks remain explicit: milk ratio, tank capacity, and changeover window.
        </p>
        <p className="text-[11px] text-slate-400 mt-6">
          Synthetic scenario · Prediction confidence is intentionally not presented as verified accuracy.
        </p>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCompareSchedule}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-[#2563EB] text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          Compare schedule
        </button>
        <button
          onClick={onApprove}
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          Approve recommendation
        </button>
      </div>
    </div>
  )
}
