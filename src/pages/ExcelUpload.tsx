import React, { useState } from 'react'
import { Header } from '../components/Header'
import { Check } from 'lucide-react'

interface ExcelUploadProps {
  onAnalyze: () => void
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onAnalyze }) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name)
    }
  }

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Data Management"
        breadcrumb="Data Management / Excel Upload"
      />

      {/* Main Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Upload operational data
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          AI analyzes structure before records are imported
        </p>
      </div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Dropzone Area */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center p-12 min-h-[340px] text-center">
          {/* Custom Upload Icon (Arrow up on horizontal bar) */}
          <div className="mb-6 flex flex-col items-center">
            <svg
              className="w-10 h-10 text-[#2563EB]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </div>

          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Drop Excel file here
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">
            {selectedFileName ? selectedFileName : 'or choose a file from your computer'}
          </p>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="inline-block bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
              Choose file
            </span>
          </label>
        </div>

        {/* Right Info Box: Before you import */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-5">
            Before you import
          </h3>

          <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-[#16A34A] shrink-0" strokeWidth={2.5} />
              <span>Review AI mappings</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-[#16A34A] shrink-0" strokeWidth={2.5} />
              <span>Resolve low-confidence fields</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-[#16A34A] shrink-0" strokeWidth={2.5} />
              <span>Validate records before import</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-[#16A34A] shrink-0" strokeWidth={2.5} />
              <span>Synthetic Demo Data only</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Action Button: Analyze file */}
      <div className="flex justify-end">
        <button
          onClick={onAnalyze}
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
        >
          Analyze file
        </button>
      </div>
    </div>
  )
}
