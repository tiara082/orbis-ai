import React from 'react'
import { Header } from '../components/Header'

interface TankerOverviewProps {
  onSelectTanker: (tankerId: string) => void
}

export const TankerOverview: React.FC<TankerOverviewProps> = ({ onSelectTanker }) => {
  const tankers = [
    {
      id: 'TRK-042',
      farm: 'Farm Cooperative A',
      eta: '09:20',
      volume: '8,200 L',
      status: 'Lab Test',
      destination: 'ST-04'
    },
    {
      id: 'TRK-043',
      farm: 'Farm Cooperative B',
      eta: '10:10',
      volume: '6,300 L',
      status: 'On The Way',
      destination: 'AT-02'
    },
    {
      id: 'TRK-044',
      farm: 'Farm Cooperative A',
      eta: '11:00',
      volume: '5,400 L',
      status: 'Sampling',
      destination: 'ST-02'
    },
    {
      id: 'TRK-045',
      farm: 'Farm Cooperative C',
      eta: '11:40',
      volume: '4,800 L',
      status: 'Delayed +35 min',
      destination: 'ST-07'
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Incoming Tanker"
        breadcrumb="Incoming Tanker / Overview"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Incoming tanker monitoring
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor raw milk availability from farm through storage
        </p>
      </div>

      {/* Top Summary Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Today incoming milk
          </p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            31,600 L
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-[#D97706]">
            6 tankers · 1 delayed
          </span>
        </div>

        <div>
          <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            RECEIVING ACTIVE
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Tanker ID</th>
                <th className="py-4 px-6 font-semibold">Farm / supplier</th>
                <th className="py-4 px-6 font-semibold">ETA</th>
                <th className="py-4 px-6 font-semibold">Volume</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {tankers.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelectTanker(t.id)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-bold text-slate-900 font-mono text-xs">
                    {t.id}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {t.farm}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {t.eta}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {t.volume}
                  </td>
                  <td className="py-4 px-6">
                    <span className={t.id === 'TRK-045' ? 'text-[#D97706] font-medium' : 'text-slate-700'}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-mono text-xs">
                    {t.destination}
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
