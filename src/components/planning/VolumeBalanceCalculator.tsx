import React, { useState, useId } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Database,
  Equal,
  FileSpreadsheet,
  Info,
  PackageCheck,
  Plus,
  Scale,
  Sparkles,
  Truck
} from 'lucide-react'
import { Card, SectionPanel } from '../common/SectionPanel'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { cn } from '../../lib/cn'
import { useFormat } from '../../lib/format'
import { useTranslation } from '../../lib/i18n'

export interface VolumeBalanceCalculatorProps {
  className?: string
  /** Default output volume required by the recommended schedule (liters) */
  recommendedOutputL?: number
  /** Default packed units/liters */
  recommendedPackOutputL?: number
  /** Default released raw milk available from tanker arrivals (liters) */
  releasedMilkL?: number
}

type CalculationPreset = 'recommended' | 'standard24h' | 'custom'

export const VolumeBalanceCalculator: React.FC<VolumeBalanceCalculatorProps> = ({
  className,
  recommendedOutputL = 29000,
  recommendedPackOutputL = 30000,
  releasedMilkL = 35000
}) => {
  const { t } = useTranslation()
  const fmt = useFormat()
  const idPrefix = useId()

  // Base parameters according to the formula:
  // Stok Awal + Susu Masuk (Milk In) = Produk Jadi (Output) + Sisa Akhir (Leftover)
  const defaultStokAwal = 15000
  const defaultMilkIn = releasedMilkL
  const defaultOutput = recommendedOutputL
  const defaultLeftover = defaultStokAwal + defaultMilkIn - defaultOutput

  const [stokAwal, setStokAwal] = useState<number>(defaultStokAwal)
  const [milkIn, setMilkIn] = useState<number>(defaultMilkIn)
  const [output, setOutput] = useState<number>(defaultOutput)
  const [leftover, setLeftover] = useState<number>(defaultLeftover)
  const [activePreset, setActivePreset] = useState<CalculationPreset>('recommended')
  const [showTips, setShowTips] = useState<boolean>(false)

  // Equation calculations
  const totalInflow = Math.max(0, (stokAwal || 0) + (milkIn || 0))
  const totalOutflow = Math.max(0, (output || 0) + (leftover || 0))
  const delta = totalInflow - totalOutflow // > 0 means surplus, < 0 means deficit
  const isBalanced = delta === 0

  // Quick solvers
  const solveLeftover = () => {
    const computed = Math.max(0, totalInflow - (output || 0))
    setLeftover(computed)
    setActivePreset('custom')
  }

  const solveOutput = () => {
    const computed = Math.max(0, totalInflow - (leftover || 0))
    setOutput(computed)
    setActivePreset('custom')
  }

  const solveMilkIn = () => {
    const computed = Math.max(0, totalOutflow - (stokAwal || 0))
    setMilkIn(computed)
    setActivePreset('custom')
  }

  const applyPreset = (preset: CalculationPreset) => {
    setActivePreset(preset)
    if (preset === 'recommended') {
      const sAwal = 15000
      const mIn = releasedMilkL
      const out = recommendedOutputL
      setStokAwal(sAwal)
      setMilkIn(mIn)
      setOutput(out)
      setLeftover(Math.max(0, sAwal + mIn - out))
    } else if (preset === 'standard24h') {
      // Standard 24h factory benchmark: 45.000 L + 45.500 L = 68.200 L + 22.300 L
      setStokAwal(45000)
      setMilkIn(45500)
      setOutput(68200)
      setLeftover(22300)
    }
  }

  const exportBalanceReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Parameter Neraca,Siklus,Nilai (Liter),Porsi Inflow (%)\n' +
      `Stok Awal Tangki Silo,Start of Day (06:00),${stokAwal},${totalInflow ? ((stokAwal / totalInflow) * 100).toFixed(1) : 0}%\n` +
      `Susu Masuk (Road Tanker),Penerimaan Harian,${milkIn},${totalInflow ? ((milkIn / totalInflow) * 100).toFixed(1) : 0}%\n` +
      `Total Pasokan (Inflow),06:00 - 06:00,${totalInflow},100.0%\n` +
      `Produk Jadi (Output Rencana),Hari Produksi,${output},${totalInflow ? ((output / totalInflow) * 100).toFixed(1) : 0}%\n` +
      `Sisa Akhir (Leftover),End of Day (06:00 berikutnya),${leftover},${totalInflow ? ((leftover / totalInflow) * 100).toFixed(1) : 0}%\n` +
      `Total Alokasi & Sisa,06:00 - 06:00,${totalOutflow},-\n` +
      `Variansi / Selisih,Integritas,${delta},${isBalanced ? 'Seimbang (0 L)' : delta > 0 ? `Surplus (+${delta} L)` : `Defisit (${delta} L)`}\n`

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Neraca_Volume_Rekomendasi_0600_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <SectionPanel
      className={className}
      title={t('planning.recs.balance.title')}
      subtitle={t('planning.recs.balance.subtitle')}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => applyPreset('recommended')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5',
                activePreset === 'recommended'
                  ? 'bg-brand text-white shadow-xs'
                  : 'text-ink hover:text-ink-strong hover:bg-gray-50'
              )}
            >
              <Sparkles className="w-3 h-3" />
              {t('planning.recs.balance.resetPlan')}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('standard24h')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                activePreset === 'standard24h'
                  ? 'bg-brand text-white shadow-xs'
                  : 'text-ink hover:text-ink-strong hover:bg-gray-50'
              )}
            >
              {t('planning.recs.balance.resetStandard')}
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTips(!showTips)}
            className="text-xs inline-flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5 text-ink" />
            {showTips ? 'Tutup Tips Rumus' : 'Tips Rumus Neraca'}
            {showTips ? <ChevronUp className="w-3 h-3 text-ink" /> : <ChevronDown className="w-3 h-3 text-ink" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportBalanceReport}
            className="text-xs inline-flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-ink" />
            {t('planning.recs.balance.exportCsv')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* EDUCATIONAL ACCORDION (EXACT REFERENCE IMAGE INFORMATION) */}
        {showTips && (
          <Card className="p-4 sm:p-5 border-brand-subtle bg-brand-muted/20 space-y-3.5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-ink-strong text-sm">
                <CheckCircle2 className="w-4 h-4 text-brand" />
                <span>{t('planning.recs.balance.tipsTitle')}</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-brand/20 text-brand">
                {t('planning.recs.balance.cycleInfo')}
              </span>
            </div>

            <p className="text-xs text-ink-strong leading-relaxed">
              {t('planning.recs.balance.tipsIntro')}
            </p>

            {/* Formula Highlight */}
            <div className="p-3 rounded-lg bg-white border border-brand/20 shadow-xs text-center">
              <p className="font-mono text-sm sm:text-base font-extrabold text-brand tracking-wide">
                Stok Awal + Milk In = Output + Leftover Akhir
              </p>
              <p className="font-mono text-xs text-ink mt-1">
                StokAwal + SusuMasuk(MilkIn) = ProdukJadi(Output) + SisaAkhir(Leftover)
              </p>
            </div>

            {/* 4 Official Definitions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-white/80 border border-gray-200">
                <span className="font-bold text-ink-strong">1. Stok Awal: </span>
                <span className="text-ink">{t('planning.recs.balance.openingStockDesc')}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 border border-gray-200">
                <span className="font-bold text-ink-strong">2. Susu Masuk (Milk In): </span>
                <span className="text-ink">{t('planning.recs.balance.milkInDesc')}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 border border-gray-200">
                <span className="font-bold text-ink-strong">3. Produk Jadi (Output): </span>
                <span className="text-ink">{t('planning.recs.balance.outputDesc')}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 border border-gray-200">
                <span className="font-bold text-ink-strong">4. Sisa Akhir (Leftover): </span>
                <span className="text-ink">{t('planning.recs.balance.leftoverDesc')}</span>
              </div>
            </div>
          </Card>
        )}

        {/* 4 INTERACTIVE PARAMETER CARDS ARRANGED AS EQUATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
          {/* 1. STOK AWAL */}
          <Card className="p-4 flex flex-col justify-between h-full border-gray-200 hover:border-brand-subtle transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-muted text-brand flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-strong">
                      {t('planning.recs.balance.openingStock')}
                    </h3>
                    <p className="text-[11px] text-ink">{t('planning.recs.balance.startOfDay')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-ink font-semibold px-1.5 py-0.5 rounded bg-gray-100">
                  {totalInflow ? `${((stokAwal / totalInflow) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>

              <div className="pt-1">
                <label htmlFor={`${idPrefix}-stok-awal`} className="sr-only">
                  {t('planning.recs.balance.openingStock')}
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <input
                    id={`${idPrefix}-stok-awal`}
                    type="number"
                    min="0"
                    step="500"
                    value={stokAwal}
                    onChange={(e) => {
                      setStokAwal(Math.max(0, Number(e.target.value) || 0))
                      setActivePreset('custom')
                    }}
                    className="w-full h-11 pl-3 pr-10 rounded-lg border border-gray-200 text-lg font-bold font-mono tabular-nums text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink">
                    L
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-ink leading-tight">
                {t('planning.recs.balance.openingStockDesc')}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 mt-2">
              <ProgressBar value={totalInflow ? (stokAwal / totalInflow) * 100 : 0} className="h-1" />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setStokAwal((prev) => Math.max(0, prev - 1000))
                    setActivePreset('custom')
                  }}
                  className="flex-1 py-1 text-[11px] rounded bg-gray-100 hover:bg-gray-200 text-ink-strong font-medium"
                >
                  -1k
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStokAwal((prev) => prev + 1000)
                    setActivePreset('custom')
                  }}
                  className="flex-1 py-1 text-[11px] rounded bg-gray-100 hover:bg-gray-200 text-ink-strong font-medium"
                >
                  +1k
                </button>
              </div>
            </div>
          </Card>

          {/* OPERATOR PLUS (+) */}
          <div className="hidden lg:flex flex-col items-center justify-center text-ink-strong font-bold">
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 shadow-2xs">
              <Plus className="w-4 h-4" />
            </div>
          </div>

          {/* 2. MILK IN (SUSU MASUK) */}
          <Card className="p-4 flex flex-col justify-between h-full border-gray-200 hover:border-brand-subtle transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-muted text-brand flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-strong">
                      {t('planning.recs.balance.milkIn')}
                    </h3>
                    <p className="text-[11px] text-ink">{t('planning.recs.balance.roadTanker')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-ink font-semibold px-1.5 py-0.5 rounded bg-gray-100">
                  {totalInflow ? `${((milkIn / totalInflow) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>

              <div className="pt-1">
                <label htmlFor={`${idPrefix}-milk-in`} className="sr-only">
                  {t('planning.recs.balance.milkIn')}
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <input
                    id={`${idPrefix}-milk-in`}
                    type="number"
                    min="0"
                    step="500"
                    value={milkIn}
                    onChange={(e) => {
                      setMilkIn(Math.max(0, Number(e.target.value) || 0))
                      setActivePreset('custom')
                    }}
                    className="w-full h-11 pl-3 pr-10 rounded-lg border border-gray-200 text-lg font-bold font-mono tabular-nums text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink">
                    L
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-ink leading-tight">
                {t('planning.recs.balance.milkInDesc')}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 mt-2">
              <ProgressBar value={totalInflow ? (milkIn / totalInflow) * 100 : 0} className="h-1" />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={solveMilkIn}
                  className="w-full py-1 text-[11px] rounded bg-brand-muted/70 hover:bg-brand-muted text-brand font-semibold"
                  title={t('planning.recs.balance.calcMilkIn')}
                >
                  Hitung Kebutuhan Masuk
                </button>
              </div>
            </div>
          </Card>

          {/* OPERATOR EQUAL (=) */}
          <div className="hidden lg:flex flex-col items-center justify-center text-ink-strong font-bold">
            <div className="w-8 h-8 rounded-full bg-brand-muted border border-brand/20 flex items-center justify-center text-brand font-black shadow-2xs">
              <Equal className="w-4 h-4" />
            </div>
          </div>

          {/* 3. PRODUK JADI (OUTPUT) */}
          <Card className="p-4 flex flex-col justify-between h-full border-gray-200 hover:border-brand-subtle transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-muted text-brand flex items-center justify-center">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-strong">
                      {t('planning.recs.balance.output')}
                    </h3>
                    <p className="text-[11px] text-ink">{t('planning.recs.balance.prodDay')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-ink font-semibold px-1.5 py-0.5 rounded bg-gray-100">
                  {totalInflow ? `${((output / totalInflow) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>

              <div className="pt-1">
                <label htmlFor={`${idPrefix}-output`} className="sr-only">
                  {t('planning.recs.balance.output')}
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <input
                    id={`${idPrefix}-output`}
                    type="number"
                    min="0"
                    step="500"
                    value={output}
                    onChange={(e) => {
                      setOutput(Math.max(0, Number(e.target.value) || 0))
                      setActivePreset('custom')
                    }}
                    className="w-full h-11 pl-3 pr-10 rounded-lg border border-gray-200 text-lg font-bold font-mono tabular-nums text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink">
                    L
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-ink leading-tight">
                {t('planning.recs.balance.outputDesc')}
                {recommendedPackOutputL > 0 && (
                  <span className="block text-[10px] text-brand mt-0.5 font-medium">
                    (Setara ~{fmt.num(recommendedPackOutputL)} packs kemasan jadi)
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 mt-2">
              <ProgressBar value={totalInflow ? (output / totalInflow) * 100 : 0} className="h-1" />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOutput(recommendedOutputL)
                    setActivePreset('custom')
                  }}
                  className="flex-1 py-1 text-[11px] rounded bg-gray-100 hover:bg-gray-200 text-ink-strong font-medium"
                  title={`Kebutuhan susu rekomendasi: ${fmt.liters(recommendedOutputL)}`}
                >
                  Plan ({fmt.liters(recommendedOutputL)})
                </button>
                <button
                  type="button"
                  onClick={solveOutput}
                  className="flex-1 py-1 text-[11px] rounded bg-brand-muted/70 hover:bg-brand-muted text-brand font-semibold"
                  title={t('planning.recs.balance.calcOutput')}
                >
                  Output Maks
                </button>
              </div>
            </div>
          </Card>

          {/* OPERATOR PLUS (+) */}
          <div className="hidden lg:flex flex-col items-center justify-center text-ink-strong font-bold">
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 shadow-2xs">
              <Plus className="w-4 h-4" />
            </div>
          </div>

          {/* 4. SISA AKHIR (LEFTOVER) */}
          <Card className="p-4 flex flex-col justify-between h-full border-gray-200 hover:border-brand-subtle transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-500/20">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-strong">
                      {t('planning.recs.balance.leftover')}
                    </h3>
                    <p className="text-[11px] text-ink">{t('planning.recs.balance.endOfDay')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-ink font-semibold px-1.5 py-0.5 rounded bg-gray-100">
                  {totalInflow ? `${((leftover / totalInflow) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>

              <div className="pt-1">
                <label htmlFor={`${idPrefix}-leftover`} className="sr-only">
                  {t('planning.recs.balance.leftover')}
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <input
                    id={`${idPrefix}-leftover`}
                    type="number"
                    min="0"
                    step="500"
                    value={leftover}
                    onChange={(e) => {
                      setLeftover(Math.max(0, Number(e.target.value) || 0))
                      setActivePreset('custom')
                    }}
                    className="w-full h-11 pl-3 pr-10 rounded-lg border border-gray-200 text-lg font-bold font-mono tabular-nums text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink">
                    L
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-ink leading-tight">
                {t('planning.recs.balance.leftoverDesc')}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 mt-2">
              <ProgressBar value={totalInflow ? (leftover / totalInflow) * 100 : 0} className="h-1" />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={solveLeftover}
                  className="w-full py-1 text-[11px] rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold"
                  title={t('planning.recs.balance.calcLeftover')}
                >
                  Hitung Sisa Otomatis
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* MATHEMATICAL VALIDATION RESULT BANNER */}
        <Card
          className={cn(
            'p-4 border transition-colors',
            isBalanced
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : delta > 0
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-rose-500/5 border-rose-500/20'
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border',
                  isBalanced
                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                    : delta > 0
                      ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-700 border-rose-500/20'
                )}
              >
                {isBalanced ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-ink-strong">
                    {isBalanced
                      ? t('planning.recs.balance.balanced')
                      : delta > 0
                        ? t('planning.recs.balance.surplus')
                        : t('planning.recs.balance.deficit')}
                  </h4>
                  <Badge
                    status={isBalanced ? 'valid' : delta > 0 ? 'warning' : 'violation'}
                    className="font-mono"
                  >
                    {isBalanced ? '0 L (Imbang)' : `${delta > 0 ? '+' : ''}${fmt.liters(delta)}`}
                  </Badge>
                </div>
                <p className="text-xs text-ink mt-0.5">
                  {isBalanced
                    ? t('planning.recs.balance.balancedDesc')
                    : delta > 0
                      ? `Terdapat selisih surplus pasokan +${fmt.liters(delta)} yang belum teralokasi ke output atau sisa akhir.`
                      : `Defisit sebesar -${fmt.liters(Math.abs(delta))}. Kebutuhan output dan sisa melebihi total pasokan susu.`}
                </p>
              </div>
            </div>

            {/* Quick Actions to balance */}
            {!isBalanced && (
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {delta > 0 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={solveLeftover}
                    className="text-xs bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                  >
                    Alokasikan ke Sisa Akhir ({fmt.liters(leftover + delta)})
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={solveOutput}
                    className="text-xs bg-white text-rose-800 border-rose-300 hover:bg-rose-50"
                  >
                    Sesuaikan Output ({fmt.liters(Math.max(0, output + delta))})
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* EQUATION STRIP WITH EXACT TOTALS */}
          <div className="mt-3.5 pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-ink font-sans font-medium">Formula:</span>
              <span className="font-bold text-ink-strong">{fmt.liters(stokAwal)}</span>
              <span className="text-gray-400 font-bold">+</span>
              <span className="font-bold text-ink-strong">{fmt.liters(milkIn)}</span>
              <span className="text-gray-400 font-bold">=</span>
              <span className="font-bold text-ink-strong">{fmt.liters(output)}</span>
              <span className="text-gray-400 font-bold">+</span>
              <span className="font-bold text-ink-strong">{fmt.liters(leftover)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <span className="text-ink font-sans font-medium">Inflow: </span>
                <span className="font-bold text-brand">{fmt.liters(totalInflow)}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              <div>
                <span className="text-ink font-sans font-medium">Outflow: </span>
                <span className="font-bold text-ink-strong">{fmt.liters(totalOutflow)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </SectionPanel>
  )
}
