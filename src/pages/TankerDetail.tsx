import React from 'react'
import { Header } from '../components/Header'

interface TankerDetailProps {
  onOpenLabStatus: () => void
}

export const TankerDetail: React.FC<TankerDetailProps> = ({ onOpenLabStatus }) => {
  const steps = [
    { label: 'Farm', status: 'completed' },
    { label: 'On The Way', status: 'completed' },
    { label: 'Sampling', status: 'completed' },
    { label: 'Lab Test', status: 'completed' },
    { label: 'Released', status: 'pending' },
    { label: 'Unloading', status: 'pending' },
    { label: 'Stored', status: 'pending' }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Incoming Tanker"
        breadcrumb="Incoming Tanker / TRK-042"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Tanker TRK-042
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Farm Cooperative A · Synthetic Demo Data
        </p>
      </div>

      {/* 2 Column Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              8,200 L
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Estimated arrival 09:20 · Actual 09:18
            </p>

            <div className="mt-5">
              <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                LAB TEST
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-800">
              Destination tank <span className="font-mono text-slate-900">ST-04</span>
            </p>
          </div>
        </div>

        {/* Right Card: Process timeline */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-8">
              Process timeline
            </h3>

            {/* Timeline Row */}
            <div className="flex items-center justify-between relative px-2">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center z-10">
                  <div
                    className={`w-3.5 h-3.5 rounded-full mb-3 ${
                      step.status === 'completed'
                        ? 'bg-[#16A34A] ring-4 ring-green-100'
                        : 'bg-[#CBD5E1]'
                    }`}
                  ></div>
                  <span className="text-[11px] text-slate-600 font-medium text-center">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="flex justify-end">
        <button
          onClick={onOpenLabStatus}
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          Open lab status
        </button>
      </div>
    </div>
  )
}
