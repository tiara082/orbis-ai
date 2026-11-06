import React from 'react'
import { Header } from '../components/Header'

interface TankerLabStatusProps {
  onRecordResult: () => void
}

export const TankerLabStatus: React.FC<TankerLabStatusProps> = ({ onRecordResult }) => {
  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Incoming Tanker"
        breadcrumb="Incoming Tanker / TRK-042 / Lab Status"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Sampling & lab status
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quality release remains human-controlled
        </p>
      </div>

      {/* 2 Column Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Card: Sample S-042-01 */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
              Sample S-042-01
            </h3>

            <div className="mb-6">
              <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                LAB TEST IN PROGRESS
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Sample time</span>
                <span className="font-semibold text-slate-900">09:32</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Test panel</span>
                <span className="font-semibold text-slate-900">Fat · protein · acidity</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Reviewer</span>
                <span className="font-semibold text-slate-900">Lab team pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Release decision */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
              Release decision
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-2">
              ORBIS may prioritize and surface results.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#DC2626]">
              It does not independently approve milk quality release.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onRecordResult}
              className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
            >
              Record lab result
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
