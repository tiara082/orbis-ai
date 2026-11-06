import React, { useState } from 'react'
import { Header } from '../components/Header'

interface MaterialGraphProps {
  onOpenBatchDetail?: () => void
}

export const MaterialGraph: React.FC<MaterialGraphProps> = ({ onOpenBatchDetail }) => {
  const [selectedNode, setSelectedNode] = useState('ST-04')

  const nodes = [
    { id: 'FARM A', label: 'FARM A', cx: 80, cy: 110 },
    { id: 'TRK-042', label: 'TRK-042', cx: 230, cy: 175 },
    { id: 'ST-04', label: 'ST-04', cx: 410, cy: 110 },
    { id: 'B-2026-1030-01', label: 'B-2026-1030-01', cx: 540, cy: 240 },
    { id: 'FG-1030-01', label: 'FG-1030-01', cx: 680, cy: 150 }
  ]

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <Header
        title="Traceability"
        breadcrumb="Traceability / Material Relationship Graph"
      />

      {/* Main Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Material relationship graph
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Directed relationships with event and quantity context
        </p>
      </div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Graph Canvas */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex items-center justify-center min-h-[380px] overflow-hidden">
          <svg
            viewBox="0 0 760 360"
            className="w-full h-auto max-h-[360px] select-none"
          >
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={isSelected ? 10 : 8}
                    className="fill-[#2563EB] transition-all"
                  />
                  {isSelected && (
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="16"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2"
                      strokeOpacity="0.3"
                    />
                  )}
                  <text
                    x={node.cx}
                    y={node.cy + 24}
                    textAnchor="middle"
                    className="text-[12px] font-bold fill-slate-900"
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Right: Selected Node Detail */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
              Selected: ST-04
            </h3>

            <div className="mb-6">
              <span className="inline-block bg-[#16A34A] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                RECORDED
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <p className="text-slate-400 font-medium text-xs">Volume</p>
                <p className="font-bold text-slate-900 mt-0.5">8,200 L</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium text-xs">Timestamp</p>
                <p className="font-semibold text-slate-900 mt-0.5">30 Oct · 10:18</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium text-xs">Source</p>
                <p className="font-semibold text-slate-900 font-mono text-xs mt-0.5">TRK-042</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium text-xs">Destination</p>
                <p className="font-semibold text-slate-900 font-mono text-xs mt-0.5">B-2026-1030-01</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onOpenBatchDetail}
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-2xs"
            >
              Open batch detail
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
