import React from 'react'
import { Header } from '../components/Header'

export const BatchDetail: React.FC = () => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Traceability"
        breadcrumb="Traceability / Batch Detail"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Batch B-2026-1030-01
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Production date 30 Oct · synthetic relationship record
        </p>
      </div>

      {/* 2 Column Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Batch facts */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-5">
            Batch facts
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Product</span>
              <span className="font-semibold text-slate-900">Full Cream 1L</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Milk ratio</span>
              <span className="font-semibold text-slate-900">100% pure milk</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Input volume</span>
              <span className="font-semibold text-slate-900">8,200 L = 8,200 kg</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Source tank</span>
              <span className="font-mono text-xs font-semibold text-slate-900">ST-04</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Finished lot</span>
              <span className="font-mono text-xs font-semibold text-slate-900">FG-1030-01</span>
            </div>
          </div>
        </div>

        {/* Right Card: Trace relationships */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-5">
              Trace relationships
            </h3>

            <p className="text-sm font-bold text-[#2563EB] mb-6 font-mono leading-relaxed">
              TRK-042 → ST-04 → B-2026-1030-01 → FG-1030-01
            </p>

            <div>
              <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                RELATIONSHIPS RECORDED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
