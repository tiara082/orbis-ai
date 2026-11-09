import React, { useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  Droplets,
  Scale,
  Sparkles,
  Timer,
  TrendingUp
} from 'lucide-react'
import { Card, SectionPanel } from '../common/SectionPanel'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { cn } from '../../lib/cn'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'
import type { Plan } from '../../domain/plan'

export interface ScheduleBalanceComparisonCardProps {
  className?: string
  baselinePlan?: Plan
  milkAvailableL?: number
  /** 'compact' fits nicely in narrow columns; 'full' is a spacious dashboard panel */
  variant?: 'full' | 'compact'
  onViewFull?: () => void
}

type ComparisonViewMode = 'side-by-side' | 'ai-only' | 'manual-only'

export const ScheduleBalanceComparisonCard: React.FC<ScheduleBalanceComparisonCardProps> = ({
  className,
  baselinePlan,
  milkAvailableL = 35000,
  variant = 'full',
  onViewFull
}) => {
  const { t } = useTranslation()
  const fmt = useFormat()
  const [viewMode, setViewMode] = useState<ComparisonViewMode>('side-by-side')

  // Parameter data: WITH AI (Rekomendasi Optimizer)
  const aiOutputL = baselinePlan ? Math.round(baselinePlan.milkRequiredL) : 29000
  const aiStokAwalL = 15000
  const aiMilkInL = milkAvailableL
  const aiInflowL = aiStokAwalL + aiMilkInL // 50,000 L
  const aiLeftoverL = aiInflowL - aiOutputL // 21,000 L
  const aiYieldPct = 96.7
  const aiDowntimeMin = 60 // 1 variant changeover
  const aiEndTime = '14:30'

  // Parameter data: WITHOUT AI (Manual / Konvensional)
  // Flush loss 2,500 L akibat CIP allergen (Chocolate -> Full Cream)
  const manualStokAwalL = 15000
  const manualMilkInL = milkAvailableL
  const manualInflowL = manualStokAwalL + manualMilkInL // 50,000 L
  const manualFlushLossL = 2500
  const manualOutputL = 26500 // output efektif terpotong flush
  const manualLeftoverL = 18500 // buffer sisa menipis
  const manualYieldPct = 88.3
  const manualDowntimeMin = 165 // 60m variant + 60m CIP flavour + 45m rinse
  const manualEndTime = '17:15'

  // Comparative deltas
  const milkSavedL = manualFlushLossL
  const yieldDeltaPct = (aiYieldPct - manualYieldPct).toFixed(1)
  const leftoverDeltaL = aiLeftoverL - manualLeftoverL
  const timeSavedMin = manualDowntimeMin - aiDowntimeMin

  // =========================================================================
  // COMPACT VARIANT: Designed specifically for narrow columns (e.g. Why this schedule)
  // =========================================================================
  if (variant === 'compact') {
    return (
      <Card className={cn('p-3.5 space-y-3 border-brand-subtle bg-brand-muted/10', className)}>
        <div className="flex items-center justify-between border-b border-brand/10 pb-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand shrink-0" />
            <h4 className="text-xs font-bold text-ink-strong">
              {t('planning.recs.comparison.compactTitle')}
            </h4>
          </div>
          <Badge tone="success" className="text-[10px] font-mono">
            +{yieldDeltaPct}% Yield
          </Badge>
        </div>

        {/* 4 Compact Metric Rows */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="text-ink">Efisiensi Yield Susu:</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-gray-400 line-through text-[11px]">{manualYieldPct}%</span>
              <span className="font-bold text-emerald-700">{aiYieldPct}%</span>
              <span className="text-[10px] text-emerald-800 font-semibold">(+{yieldDeltaPct}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="text-ink">Susu Terselamatkan:</span>
            <span className="font-mono font-bold text-brand text-xs">
              +{fmt.liters(milkSavedL)} <span className="font-normal text-[10px] text-ink">(0 flush)</span>
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="text-ink">Sisa Akhir (Buffer):</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-gray-400 text-[11px]">{fmt.liters(manualLeftoverL)}</span>
              <span className="font-bold text-ink-strong">→ {fmt.liters(aiLeftoverL)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-ink">Order Tepat Waktu:</span>
            <span className="font-mono font-bold text-emerald-700 text-xs">
              3/3 On-Time <span className="text-gray-400 font-normal text-[11px]">(vs 2/3)</span>
            </span>
          </div>
        </div>

        {/* Compact Formula Badge */}
        <div className="p-2 rounded-lg bg-white border border-brand/20 text-[11px] font-mono text-ink-strong flex items-center justify-between">
          <span className="text-ink">Neraca AI:</span>
          <span className="font-bold text-brand">
            {fmt.liters(aiInflowL)} = {fmt.liters(aiOutputL)} + {fmt.liters(aiLeftoverL)}
          </span>
        </div>

        {/* Action Link to Full Section */}
        {onViewFull && (
          <button
            type="button"
            onClick={onViewFull}
            className="w-full py-1 text-[11px] font-semibold text-brand hover:text-brand-hover hover:bg-brand-muted/50 rounded-md transition-colors flex items-center justify-center gap-1"
          >
            {t('planning.recs.comparison.viewFull')} <ArrowDown className="w-3 h-3" />
          </button>
        )}
      </Card>
    )
  }

  // =========================================================================
  // FULL VARIANT: Spacious, complete, enterprise comparison dashboard panel
  // =========================================================================
  return (
    <SectionPanel
      id="full-balance-comparison"
      className={className}
      title={t('planning.recs.comparison.title')}
      subtitle={t('planning.recs.comparison.subtitle')}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success" className="font-mono text-xs">
            {t('planning.recs.comparison.summaryBadge')}
          </Badge>
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs text-xs">
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors',
                viewMode === 'side-by-side'
                  ? 'bg-brand text-white shadow-2xs font-semibold'
                  : 'text-ink hover:text-ink-strong'
              )}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ai-only')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors',
                viewMode === 'ai-only'
                  ? 'bg-brand text-white shadow-2xs font-semibold'
                  : 'text-ink hover:text-ink-strong'
              )}
            >
              AI Optimizer
            </button>
            <button
              type="button"
              onClick={() => setViewMode('manual-only')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors',
                viewMode === 'manual-only'
                  ? 'bg-brand text-white shadow-2xs font-semibold'
                  : 'text-ink hover:text-ink-strong'
              )}
            >
              Konvensional
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* FORMULA HIGHLIGHT BANNER */}
        <div className="px-3.5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink-strong">{t('planning.recs.comparison.formulaNote')}</span>
          </div>
          <span className="font-mono text-[11px] text-ink font-medium">
            Siklus Harian Pabrik 06:00 (Start of Day) — 06:00 (End of Day)
          </span>
        </div>

        {/* 2 SIKLUS NERACA CARDS (AI VS TANPA AI) */}
        <div
          className={cn(
            'grid gap-4',
            viewMode === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          )}
        >
          {/* CARD 1: DENGAN REKOMENDASI AI */}
          {(viewMode === 'side-by-side' || viewMode === 'ai-only') && (
            <Card className="p-4 sm:p-5 border-brand/30 bg-brand-muted/10 space-y-4">
              <div className="flex items-center justify-between border-b border-brand/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand">
                      {t('planning.recs.comparison.withAi')}
                    </h3>
                    <p className="text-[11px] text-ink">Urutan alergen teroptimasi (Full Cream → Chocolate)</p>
                  </div>
                </div>
                <Badge status="valid">100% Seimbang</Badge>
              </div>

              {/* 4 Parameter Neraca in clean 4-column horizontal grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] font-medium text-ink block">Stok Awal (06:00)</span>
                  <span className="font-mono text-sm font-bold text-ink-strong">{fmt.liters(aiStokAwalL)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] font-medium text-ink block">Susu Masuk (Tanker)</span>
                  <span className="font-mono text-sm font-bold text-ink-strong">{fmt.liters(aiMilkInL)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-brand/30">
                  <span className="text-[10px] font-semibold text-brand block">Output (Produk Jadi)</span>
                  <span className="font-mono text-sm font-bold text-brand">{fmt.liters(aiOutputL)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-500/30">
                  <span className="text-[10px] font-semibold text-emerald-700 block">Sisa Akhir (Leftover)</span>
                  <span className="font-mono text-sm font-bold text-emerald-700">{fmt.liters(aiLeftoverL)}</span>
                </div>
              </div>

              {/* Formula Equation Line on one single line */}
              <div className="p-2.5 rounded-lg bg-white border border-brand/20 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-ink-strong">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold">{fmt.liters(aiStokAwalL)}</span>
                  <span className="text-gray-400 font-bold">+</span>
                  <span className="font-bold">{fmt.liters(aiMilkInL)}</span>
                  <span className="text-brand font-bold">=</span>
                  <span className="font-bold text-brand">{fmt.liters(aiOutputL)}</span>
                  <span className="text-gray-400 font-bold">+</span>
                  <span className="font-bold text-emerald-700">{fmt.liters(aiLeftoverL)}</span>
                </div>
                <span className="font-semibold text-emerald-700 text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Inflow {fmt.liters(aiInflowL)} = Outflow {fmt.liters(aiInflowL)}
                </span>
              </div>

              {/* Operational Performance Highlights */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-ink">Efisiensi Yield Susu:</span>
                  <span className="font-mono font-bold text-emerald-700">{aiYieldPct}%</span>
                </div>
                <ProgressBar value={aiYieldPct} className="h-1.5" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded bg-white border border-gray-100">
                    <span className="text-ink block">Flush Loss:</span>
                    <span className="font-mono font-bold text-emerald-700">0 L (Nol)</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-gray-100">
                    <span className="text-ink block">On-Time Orders:</span>
                    <span className="font-mono font-bold text-emerald-700">3/3 (100% · {aiEndTime})</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-gray-100">
                    <span className="text-ink block">Downtime CIP:</span>
                    <span className="font-mono font-bold text-ink-strong">{aiDowntimeMin} mnt (0 Ekstra)</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* CARD 2: TANPA REKOMENDASI AI (MANUAL) */}
          {(viewMode === 'side-by-side' || viewMode === 'manual-only') && (
            <Card className="p-4 sm:p-5 border-gray-200 bg-gray-50/70 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-strong">
                      {t('planning.recs.comparison.withoutAi')}
                    </h3>
                    <p className="text-[11px] text-ink">Urutan konvensional (memicu pencucian alergen CIP_FLAVOUR)</p>
                  </div>
                </div>
                <Badge tone="warning">Boros Susu & Molor</Badge>
              </div>

              {/* 4 Parameter Neraca in clean 4-column horizontal grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] font-medium text-ink block">Stok Awal (06:00)</span>
                  <span className="font-mono text-sm font-bold text-ink-strong">{fmt.liters(manualStokAwalL)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] font-medium text-ink block">Susu Masuk (Tanker)</span>
                  <span className="font-mono text-sm font-bold text-ink-strong">{fmt.liters(manualMilkInL)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-amber-300">
                  <span className="text-[10px] font-semibold text-amber-700 block">Output (Efektif)</span>
                  <span className="font-mono text-sm font-bold text-amber-800">{fmt.liters(manualOutputL)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-300">
                  <span className="text-[10px] font-semibold text-ink block">Sisa Akhir (Buffer)</span>
                  <span className="font-mono text-sm font-bold text-ink-strong">{fmt.liters(manualLeftoverL)}</span>
                </div>
              </div>

              {/* Formula Equation Line on one single line */}
              <div className="p-2.5 rounded-lg bg-white border border-gray-200 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-ink-strong">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold">{fmt.liters(manualStokAwalL)}</span>
                  <span className="text-gray-400 font-bold">+</span>
                  <span className="font-bold">{fmt.liters(manualMilkInL)}</span>
                  <span className="text-amber-700 font-bold">=</span>
                  <span className="font-bold text-amber-800">{fmt.liters(manualOutputL)}</span>
                  <span className="text-gray-400 font-bold">+</span>
                  <span className="font-bold text-ink-strong">{fmt.liters(manualLeftoverL)}</span>
                </div>
                <span className="font-semibold text-rose-700 text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  +{fmt.liters(manualFlushLossL)} Susu Terbuang ke Drain
                </span>
              </div>

              {/* Operational Performance Highlights */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-ink">Efisiensi Yield Susu:</span>
                  <span className="font-mono font-bold text-amber-700">{manualYieldPct}%</span>
                </div>
                <ProgressBar value={manualYieldPct} className="h-1.5" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded bg-white border border-gray-100">
                    <span className="text-ink block">Flush Loss:</span>
                    <span className="font-mono font-bold text-rose-700">+{fmt.liters(manualFlushLossL)} terbuang</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-gray-100">
                    <span className="text-ink block">On-Time Orders:</span>
                    <span className="font-mono font-bold text-rose-700">2/3 (1 Telat · {manualEndTime})</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-gray-100">
                    <span className="text-ink block">Downtime CIP:</span>
                    <span className="font-mono font-bold text-rose-700">{manualDowntimeMin} mnt (+105 mnt)</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* 4 COMPARISON STAT TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Card className="p-3 border-gray-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-ink mb-1">
              <Droplets className="w-3.5 h-3.5 text-brand" />
              <span className="text-[11px] font-medium">Susu Terselamatkan</span>
            </div>
            <p className="font-mono text-lg font-extrabold text-brand">
              +{fmt.liters(milkSavedL)}
            </p>
            <p className="text-[10px] text-ink mt-0.5">Bebas pembuangan flush CIP</p>
          </Card>

          <Card className="p-3 border-gray-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-ink mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[11px] font-medium">Peningkatan Yield</span>
            </div>
            <p className="font-mono text-lg font-extrabold text-emerald-700">
              +{yieldDeltaPct}%
            </p>
            <p className="text-[10px] text-ink mt-0.5">{aiYieldPct}% vs {manualYieldPct}%</p>
          </Card>

          <Card className="p-3 border-gray-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-ink mb-1">
              <Scale className="w-3.5 h-3.5 text-ink-strong" />
              <span className="text-[11px] font-medium">Cadangan Sisa Tangki</span>
            </div>
            <p className="font-mono text-lg font-extrabold text-ink-strong">
              +{fmt.liters(leftoverDeltaL)}
            </p>
            <p className="text-[10px] text-ink mt-0.5">{fmt.liters(aiLeftoverL)} stok penyangga</p>
          </Card>

          <Card className="p-3 border-gray-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-ink mb-1">
              <Timer className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[11px] font-medium">Hemat Waktu Pencucian</span>
            </div>
            <p className="font-mono text-lg font-extrabold text-emerald-700">
              -{timeSavedMin} mnt
            </p>
            <p className="text-[10px] text-ink mt-0.5">0 CIP allergen tak terencana</p>
          </Card>
        </div>

        {/* COMPREHENSIVE COMPARISON TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-ink">
                <th className="py-2.5 px-3 font-semibold">{t('planning.recs.comparison.indicatorCol')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('planning.recs.comparison.withoutAiCol')}</th>
                <th className="py-2.5 px-3 font-semibold text-brand">{t('planning.recs.comparison.withAiCol')}</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-700">{t('planning.recs.comparison.deltaCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">1. Stok Awal Tangki (06:00)</td>
                <td className="py-2 px-3 text-ink">{fmt.liters(manualStokAwalL)}</td>
                <td className="py-2 px-3 font-bold text-ink-strong">{fmt.liters(aiStokAwalL)}</td>
                <td className="py-2 px-3 font-sans text-ink">Baseline sama</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">2. Penerimaan Susu Masuk (Tanker)</td>
                <td className="py-2 px-3 text-ink">{fmt.liters(manualMilkInL)}</td>
                <td className="py-2 px-3 font-bold text-ink-strong">{fmt.liters(aiMilkInL)}</td>
                <td className="py-2 px-3 font-sans text-ink">Pasokan sama</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">3. Total Pasokan Susu (Inflow)</td>
                <td className="py-2 px-3 text-ink font-bold">{fmt.liters(manualInflowL)}</td>
                <td className="py-2 px-3 font-bold text-brand">{fmt.liters(aiInflowL)}</td>
                <td className="py-2 px-3 font-sans text-ink">100% Inflow terlacak</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">4. Produk Jadi (Output Efektif)</td>
                <td className="py-2 px-3 text-amber-800 font-bold">{fmt.liters(manualOutputL)}</td>
                <td className="py-2 px-3 font-bold text-brand">{fmt.liters(aiOutputL)}</td>
                <td className="py-2 px-3 font-sans font-semibold text-brand">+{fmt.liters(aiOutputL - manualOutputL)} (+9.4%)</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">5. Sisa Akhir Tangki (Leftover)</td>
                <td className="py-2 px-3 text-ink">{fmt.liters(manualLeftoverL)}</td>
                <td className="py-2 px-3 font-bold text-emerald-700">{fmt.liters(aiLeftoverL)}</td>
                <td className="py-2 px-3 font-sans font-semibold text-emerald-700">+{fmt.liters(leftoverDeltaL)} cadangan aman</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">6. Susu Terbuang (Flush Loss CIP)</td>
                <td className="py-2 px-3 text-rose-700 font-bold">+{fmt.liters(manualFlushLossL)}</td>
                <td className="py-2 px-3 font-bold text-emerald-700">0 L (Nol)</td>
                <td className="py-2 px-3 font-sans font-semibold text-emerald-700">Hemat {fmt.liters(milkSavedL)} susu murni</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">7. Yield Efisiensi Konversi Susu</td>
                <td className="py-2 px-3 text-amber-700 font-bold">{manualYieldPct}%</td>
                <td className="py-2 px-3 font-bold text-emerald-700">{aiYieldPct}%</td>
                <td className="py-2 px-3 font-sans font-semibold text-emerald-700">+{yieldDeltaPct}% peningkatan yield</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">8. Ketepatan Waktu Order (On-Time)</td>
                <td className="py-2 px-3 text-rose-700">66.7% (1 order terlambat)</td>
                <td className="py-2 px-3 font-bold text-emerald-700">100% (3 dari 3 tepat waktu)</td>
                <td className="py-2 px-3 font-sans font-semibold text-emerald-700">0 keterlambatan</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-3 font-sans font-medium text-ink-strong">9. Total Downtime Cuci & Changeover</td>
                <td className="py-2 px-3 text-rose-700">{manualDowntimeMin} mnt (Selesai {manualEndTime})</td>
                <td className="py-2 px-3 font-bold text-ink-strong">{aiDowntimeMin} mnt (Selesai {aiEndTime})</td>
                <td className="py-2 px-3 font-sans font-semibold text-emerald-700">Hemat {timeSavedMin} menit (1j 45m)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CONCLUSION EXPLANATION */}
        <div className="p-3.5 rounded-lg bg-brand-muted/20 border border-brand/20 text-xs text-ink-strong space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-brand">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Kesimpulan Eksekutif Efisiensi Optimizer:</span>
          </div>
          <p className="text-[11px] text-ink-strong leading-relaxed">
            {t('planning.recs.comparison.conclusion')}
          </p>
        </div>
      </div>
    </SectionPanel>
  )
}
