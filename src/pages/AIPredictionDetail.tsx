import React from 'react'
import { Header } from '../components/Header'

export const AIPredictionDetail: React.FC = () => {
  const comparisonData = [
    {
      comparison: 'Similar shift · 29 Oct',
      baseline: '18:15',
      prediction: '17:30',
      limitations: 'Synthetic sample'
    },
    {
      comparison: 'Order sequence',
      baseline: 'Full Cream → Strawberry',
      prediction: 'Full Cream → Strawberry',
      limitations: 'Changeover remains'
    },
    {
      comparison: 'Operational check',
      baseline: 'AT-02 52.5%',
      prediction: 'Pass',
      limitations: 'Planner approval required'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="AI Intelligence"
        breadcrumb="AI Intelligence / Prediction Detail"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Processing duration prediction
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Synthetic prediction for B-2026-1030-01 · generated after TRK-045 delay signal
        </p>
      </div>

      {/* 3 Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Predicted completion
            </p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              17:30
            </p>
          </div>
          <div className="mt-4">
            <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              45 MIN IMPACT
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Prediction confidence
            </p>
            <p className="text-3xl font-bold text-[#2563EB] tracking-tight mt-1">
              82%
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">
            Simulated model output · not verified accuracy
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Input factors
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
              <span>TRK-045 +35 min delay</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
              <span>45 min changeover window</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
              <span>AT-02 at 52.5%</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Comparison Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Historical comparison</th>
                <th className="py-4 px-6 font-semibold">Baseline</th>
                <th className="py-4 px-6 font-semibold">Prediction</th>
                <th className="py-4 px-6 font-semibold">Limitations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {row.comparison}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.baseline}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.prediction}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {row.limitations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
