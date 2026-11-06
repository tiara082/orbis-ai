import React from 'react'
import { Header } from '../components/Header'

interface ColumnMappingProps {
  onContinue: () => void
  onReviewKeterangan?: () => void
}

export const ColumnMapping: React.FC<ColumnMappingProps> = ({
  onContinue,
  onReviewKeterangan
}) => {
  const mappingData = [
    {
      original: 'Tank ID',
      standard: 'storage_tank_id',
      suggestion: 'Tank ID',
      confidence: '99%',
      status: 'Validated'
    },
    {
      original: 'Volume Susu',
      standard: 'volume_liter',
      suggestion: 'Milk volume',
      confidence: '96%',
      status: 'Validated'
    },
    {
      original: 'Tgl Produksi',
      standard: 'production_date',
      suggestion: 'Production date',
      confidence: '91%',
      status: 'Validated'
    },
    {
      original: 'Kode Batch',
      standard: 'batch_id',
      suggestion: 'Batch identifier',
      confidence: '72%',
      status: 'Review'
    },
    {
      original: 'Keterangan',
      standard: '—',
      suggestion: 'Unmapped',
      confidence: '38%',
      status: 'Review',
      clickable: true
    }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Data Management"
        breadcrumb="Data Management / Column Mapping"
      />

      {/* Main Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Review AI column mapping
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Low-confidence mappings require human review
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="py-4 px-6 font-semibold">Original column</th>
                <th className="py-4 px-6 font-semibold">Standard field</th>
                <th className="py-4 px-6 font-semibold">AI suggestion</th>
                <th className="py-4 px-6 font-semibold">Confidence</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {mappingData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={row.clickable && onReviewKeterangan ? onReviewKeterangan : undefined}
                  className={`hover:bg-slate-50/50 transition-colors ${
                    row.clickable ? 'cursor-pointer hover:bg-amber-50/30' : ''
                  }`}
                >
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {row.original}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                    {row.standard}
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    {row.suggestion}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {row.confidence}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-700 font-normal">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Navigation / Review Status */}
      <div className="flex items-center justify-between">
        <div>
          <span className="inline-block bg-[#D97706] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            2 NEED REVIEW
          </span>
        </div>

        <button
          onClick={onContinue}
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          Continue to validation
        </button>
      </div>
    </div>
  )
}
