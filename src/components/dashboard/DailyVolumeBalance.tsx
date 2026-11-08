import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, FileSpreadsheet, Info, Scale } from 'lucide-react'
import { Card, SectionPanel } from '../common/SectionPanel'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { useFormat } from '../../lib/format'

interface DailyVolumeBalanceProps {
  className?: string
}

export const DailyVolumeBalance: React.FC<DailyVolumeBalanceProps> = ({ className }) => {
  const fmt = useFormat()
  const [showFormula, setShowFormula] = useState(false)

  // Standard 24h Greenfields manufacturing cycle: 06:00 to 06:00 next day
  const openingStockL = 45000 // Silo RMT-01, RMT-02, RMT-03 at 06:00
  const tankerInflowL = 45500 // 4 Tanker deliveries from Farm A & Farm B
  const totalInflowL = openingStockL + tankerInflowL

  const packedOutputL = 68200 // Finished packs ESL & UHT
  const closingStockL = 21400 // Stock in Silos & Aseptic Tanks at 06:00 next day
  const coProductL = 550 // Cream & Skim co-products
  const recordedLossL = 350 // Sampling, test packs, pipe rinse

  const totalAccountedOutflowL = packedOutputL + closingStockL + coProductL + recordedLossL
  const varianceL = totalInflowL - totalAccountedOutflowL
  const variancePct = (Math.abs(varianceL) / totalInflowL) * 100

  const isBalanced = variancePct <= 1.5

  const exportBalanceReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Parameter Neraca,Kategori,Volume (Liter),Porsi (%)\n' +
      `Stok Awal Silo (06:00),INFLOW,${openingStockL},${((openingStockL / totalInflowL) * 100).toFixed(1)}%\n` +
      `Penerimaan Truk Tangki,INFLOW,${tankerInflowL},${((tankerInflowL / totalInflowL) * 100).toFixed(1)}%\n` +
      `Total Susu Masuk,TOTAL_INFLOW,${totalInflowL},100.0%\n` +
      `Output Produksi Terkemas,OUTFLOW,${packedOutputL},${((packedOutputL / totalInflowL) * 100).toFixed(1)}%\n` +
      `Sisa Stok Silo & AT (06:00),OUTFLOW,${closingStockL},${((closingStockL / totalInflowL) * 100).toFixed(1)}%\n` +
      `Co-product (Cream/Skim),OUTFLOW,${coProductL},${((coProductL / totalInflowL) * 100).toFixed(1)}%\n` +
      `Kehilangan Tercatat (Loss/Sampling),OUTFLOW,${recordedLossL},${((recordedLossL / totalInflowL) * 100).toFixed(1)}%\n` +
      `Variansi Tak Terjelaskan,VARIANCE,${varianceL},${variancePct.toFixed(2)}%\n`

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Neraca_Volume_Greenfields_0600_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <SectionPanel
      className={className}
      title="Neraca Volume Harian Pabrik (Siklus 06:00 — 06:00)"
      subtitle="Prinsip konservasi massa susu Greenfields Indonesia: Total Masuk = Total Keluar + Stok Sisa + Variansi."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFormula(!showFormula)}
            className="text-xs inline-flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5 text-ink" />
            {showFormula ? 'Tutup Rumus' : 'Rumus Neraca'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportBalanceReport}
            className="text-xs inline-flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-ink" />
            Ekspor Neraca (CSV)
          </Button>
        </div>
      }
    >
      <Card className="p-4 sm:p-5 space-y-4">
        {/* TOP STATUS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-500/20">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-strong">
                Status Rekonsiliasi Neraca: {isBalanced ? 'SEIMBANG (AUDIT COMPLIANT)' : 'MEMERLUKAN TINJAUAN'}
              </p>
              <p className="text-[11px] text-ink">
                Batas toleransi deviasi unexplained loss: maksimal 1.50% (standar industri pengolahan susu).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Variansi: {variancePct.toFixed(2)}% ({fmt.liters(varianceL)})
            </span>
            <Badge status={isBalanced ? 'valid' : 'warning'} />
          </div>
        </div>

        {/* FORMULA CALLOUT */}
        {showFormula && (
          <div className="p-3.5 rounded-lg bg-brand-muted/30 border border-brand/20 text-xs text-ink-strong space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-semibold text-brand">
              <CheckCircle2 className="w-4 h-4" />
              Formula Rekonsiliasi Neraca Susu (Greenfields SOP & ISO 22000):
            </div>
            <p className="font-mono text-[11px] bg-white p-2 rounded border border-gray-200 text-ink-strong">
              Stok Awal (06:00) + Penerimaan Tangki = Output Kemasan Jadi + Stok Akhir Silo/AT (06:00) + Co-product + Kehilangan Tercatat
            </p>
            <p className="text-[11px] text-ink leading-relaxed">
              Catatan Parameter: Densitas susu diasumsikan konstan 1.0 kg/L. Produk varian Full Cream menggunakan 100% basis susu cair; varian Flavoured (Chocolate & Strawberry) menggunakan rasio 90% susu dasar + 10% premix konsentrat.
            </p>
          </div>
        )}

        {/* COMPARISON GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* INFLOW BOX */}
          <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-ink-strong uppercase tracking-wide">
                Total Susu Masuk (Inflow)
              </span>
              <span className="font-mono text-sm font-bold text-brand">
                {fmt.liters(totalInflowL)}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink">Stok Awal Silo (06:00)</span>
                <span className="font-mono font-medium text-ink-strong">{fmt.liters(openingStockL)}</span>
              </div>
              <ProgressBar value={(openingStockL / totalInflowL) * 100} className="h-1.5" />

              <div className="flex items-center justify-between pt-1">
                <span className="text-ink">Penerimaan Truk Tangki (Farm A & B)</span>
                <span className="font-mono font-medium text-ink-strong">{fmt.liters(tankerInflowL)}</span>
              </div>
              <ProgressBar value={(tankerInflowL / totalInflowL) * 100} className="h-1.5" />
            </div>

            <p className="text-[10px] text-ink pt-1 border-t border-gray-100">
              Mencakup penerimaan dari 4 truk tangki terisolasi suhu dingin (&le; 4.0°C).
            </p>
          </div>

          {/* OUTFLOW BOX */}
          <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-ink-strong uppercase tracking-wide">
                Distribusi & Sisa (Outflow)
              </span>
              <span className="font-mono text-sm font-bold text-ink-strong">
                {fmt.liters(totalAccountedOutflowL)}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink">Output Kemasan Jadi Terverifikasi</span>
                <span className="font-mono font-medium text-ink-strong">{fmt.liters(packedOutputL)}</span>
              </div>
              <ProgressBar value={(packedOutputL / totalInflowL) * 100} className="h-1.5" />

              <div className="flex items-center justify-between pt-1">
                <span className="text-ink">Stok Akhir Silo & Tangki Aseptik (06:00)</span>
                <span className="font-mono font-medium text-ink-strong">{fmt.liters(closingStockL)}</span>
              </div>
              <ProgressBar value={(closingStockL / totalInflowL) * 100} className="h-1.5" />

              <div className="flex items-center justify-between text-[11px] text-ink pt-1">
                <span>Co-product (Cream/Skim) & Loss Tercatat</span>
                <span className="font-mono">{fmt.liters(coProductL + recordedLossL)}</span>
              </div>
            </div>

            <p className="text-[10px] text-ink pt-1 border-t border-gray-100">
              Output dihitung dari 10 Filling Lines aktif sesuai konversi pack-to-liter resmi.
            </p>
          </div>
        </div>

        {/* BALANCE WATERFALL STRIP */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-gray-50/70 border border-gray-200 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-ink">Inflow:</span>
            <span className="font-bold text-ink-strong">{fmt.liters(totalInflowL)}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <div className="flex items-center gap-1.5">
            <span className="text-ink">Kemasan:</span>
            <span className="font-bold text-ink-strong">{fmt.liters(packedOutputL)}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <div className="flex items-center gap-1.5">
            <span className="text-ink">Sisa Tangki:</span>
            <span className="font-bold text-ink-strong">{fmt.liters(closingStockL)}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <div className="flex items-center gap-1.5">
            <span className="text-ink">Selisih Bersih:</span>
            <span className="font-bold text-emerald-700">0 Liter (100% Rekonsiliasi)</span>
          </div>
        </div>
      </Card>
    </SectionPanel>
  )
}
