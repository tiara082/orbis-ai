import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  History,
  Layers,
  Network,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { KeyValueList } from '../../components/common/KeyValueList'
import { StepFlow } from '../../components/common/StepFlow'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Modal } from '../../components/common/Modal'
import { Select } from '../../components/ui/Select'
import { useFormat } from '../../lib/format'

export const Route = createFileRoute('/milk-traceability/batch-detail')({
  component: BatchDetailPage
})

interface BatchRecord {
  id: string
  product: string
  productDetail: string
  milkRatio: string
  inputVolumeL: number
  sourceTank: string
  finishedLot: string
  allocatedPct: number
  allocatedL: number
  remainingL: number
  integrityStatus: 'Verified' | 'Pending' | 'Warning'
  allocationStatus: 'Processed' | 'Pending' | 'Rejected'
  approvalInfo: string
  provenanceRef: string
  txRef: string
  eventHash: string
  lastVerification: string
  events: Array<{
    type: string
    code: string
    time: string
    status: 'Verified' | 'Pending'
  }>
}

const PRESET_BATCHES: Record<string, BatchRecord> = {
  'B-2026-1030-01': {
    id: 'B-2026-1030-01',
    product: 'Full Cream',
    productDetail: '1L · 100% pure milk',
    milkRatio: '100% pure milk',
    inputVolumeL: 8200,
    sourceTank: 'ST-04',
    finishedLot: 'FG-1030-01',
    allocatedPct: 100,
    allocatedL: 8200,
    remainingL: 0,
    integrityStatus: 'Pending',
    allocationStatus: 'Processed',
    approvalInfo: 'Ana Putri · 30 Oct 09:55',
    provenanceRef: 'PRV-B-2026-1030-1',
    txRef: 'TX-1030-C51F-7AE',
    eventHash: 'e03b1f6a2d...1d3e7af',
    lastVerification: '30 Oct 15:02 · proof not yet confirmed',
    events: [
      { type: 'DISCHARGED_INTO', code: 'EVT-1030-1018', time: '30 Oct 10:18', status: 'Verified' },
      { type: 'PRODUCED', code: 'EVT-1030-1100', time: '30 Oct 11:00', status: 'Pending' }
    ]
  },
  'FG-1030-FL01-FC': {
    id: 'FG-1030-FL01-FC',
    product: 'ESL Full Cream',
    productDetail: '1L Local · 100% milk',
    milkRatio: '100% pure milk',
    inputVolumeL: 11720,
    sourceTank: 'AT-01',
    finishedLot: 'FG-1030-FL01-FC',
    allocatedPct: 100,
    allocatedL: 11720,
    remainingL: 0,
    integrityStatus: 'Verified',
    allocationStatus: 'Processed',
    approvalInfo: 'Supervisor Shift A · 30 Oct 11:15',
    provenanceRef: 'PRV-FG-1030-FL01',
    txRef: 'TX-1030-F88B-21C',
    eventHash: 'a71c89f02e...99bf021',
    lastVerification: '30 Oct 14:30 · consensus confirmed',
    events: [
      { type: 'DISCHARGED_INTO', code: 'EVT-1030-0800', time: '30 Oct 08:00', status: 'Verified' },
      { type: 'PASTEURIZED', code: 'EVT-1030-0930', time: '30 Oct 09:30', status: 'Verified' },
      { type: 'PACKAGED', code: 'EVT-1030-1115', time: '30 Oct 11:15', status: 'Verified' }
    ]
  },
  'FG-1030-FL02-FC': {
    id: 'FG-1030-FL02-FC',
    product: 'ESL Full Cream Export',
    productDetail: '1L Export · 100% milk',
    milkRatio: '100% pure milk',
    inputVolumeL: 7930,
    sourceTank: 'AT-01',
    finishedLot: 'FG-1030-FL02-FC',
    allocatedPct: 100,
    allocatedL: 7930,
    remainingL: 0,
    integrityStatus: 'Verified',
    allocationStatus: 'Processed',
    approvalInfo: 'Supervisor Shift A · 30 Oct 10:20',
    provenanceRef: 'PRV-FG-1030-FL02',
    txRef: 'TX-1030-A91C-38D',
    eventHash: 'f42c12d99b...77ae340',
    lastVerification: '30 Oct 13:50 · consensus confirmed',
    events: [
      { type: 'DISCHARGED_INTO', code: 'EVT-1030-0800', time: '30 Oct 08:00', status: 'Verified' },
      { type: 'PACKAGED', code: 'EVT-1030-1010', time: '30 Oct 10:10', status: 'Verified' }
    ]
  }
}

function BatchDetailPage() {
  const fmt = useFormat()
  const [selectedBatchId, setSelectedBatchId] = useState<string>('B-2026-1030-01')
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const activeBatch = PRESET_BATCHES[selectedBatchId] ?? PRESET_BATCHES['B-2026-1030-01']

  const copyToClipboard = (text: string, key: string) => {
    void navigator.clipboard?.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const batchOptions = [
    { value: 'B-2026-1030-01', label: 'B-2026-1030-01 (Full Cream 1L · ST-04)' },
    { value: 'FG-1030-FL01-FC', label: 'FG-1030-FL01-FC (ESL Full Cream Local · AT-01)' },
    { value: 'FG-1030-FL02-FC', label: 'FG-1030-FL02-FC (ESL Full Cream Export · AT-01)' }
  ]

  return (
    <>
      <PageHeader
        title={`Batch ${activeBatch.id}`}
        description="Production date 30 Oct · synthetic relationship record"
        titleAddon={
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">Last ledger check: 30 Oct 15:02</span>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              className="w-72"
              value={selectedBatchId}
              onChange={(value) => setSelectedBatchId(value)}
              options={batchOptions}
            />
            <Button variant="outline" icon={History} onClick={() => setShowHistoryModal(true)}>
              Allocation history
            </Button>
            <Button icon={ShieldCheck} onClick={() => setShowVerificationModal(true)}>
              View Verification Details
            </Button>
          </div>
        }
      />

      <div className="space-y-5">
        {/* Quick stats (6 horizontal cards matching screenshot) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Card className="p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <span>Product</span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-bold text-ink-strong">{activeBatch.product}</p>
              <p className="text-[11px] text-ink-muted">{activeBatch.productDetail}</p>
            </div>
          </Card>

          <Card className="p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink">
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              <span>Input volume</span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-bold text-ink-strong">{fmt.liters(activeBatch.inputVolumeL)}</p>
              <p className="text-[11px] text-ink-muted">= {fmt.num(activeBatch.inputVolumeL)} kg</p>
            </div>
          </Card>

          <Card className="p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink">
              <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
              <span>Allocated</span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-bold text-ink-strong">{activeBatch.allocatedPct}%</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-brand" />
                <p className="text-[11px] text-ink-muted">{fmt.num(activeBatch.allocatedL)} of {fmt.num(activeBatch.inputVolumeL)} L</p>
              </div>
            </div>
          </Card>

          <Card className="p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Remaining</span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-bold text-ink-strong">{fmt.liters(activeBatch.remainingL)}</p>
              <p className="text-[11px] text-ink-muted">unallocated in {activeBatch.sourceTank}</p>
            </div>
          </Card>

          <Card className="p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink">
              <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
              <span>Integrity</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1.5">
                <Badge tone={activeBatch.integrityStatus === 'Verified' ? 'success' : 'warning'}>
                  {activeBatch.integrityStatus}
                </Badge>
              </div>
              <p className="text-[11px] text-ink-muted mt-1">production event</p>
            </div>
          </Card>

          <Card className="p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink">
              <History className="w-3.5 h-3.5 text-gray-400" />
              <span>Allocation</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1.5">
                <Badge tone="success">{activeBatch.allocationStatus}</Badge>
              </div>
              <p className="text-[11px] text-ink-muted mt-1">approved 09:55</p>
            </div>
          </Card>
        </div>

        {/* Middle row: Batch facts & Trace relationships */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionPanel title="Batch facts">
            <Card className="p-5">
              <KeyValueList
                items={[
                  { label: 'Product', value: `${activeBatch.product} 1L` },
                  { label: 'Milk ratio', value: activeBatch.milkRatio },
                  { label: 'Input volume', value: `${fmt.liters(activeBatch.inputVolumeL)} = ${fmt.num(activeBatch.inputVolumeL)} kg` },
                  { label: 'Source tank', value: activeBatch.sourceTank, mono: true },
                  { label: 'Finished lot', value: activeBatch.finishedLot, mono: true }
                ]}
              />
            </Card>
          </SectionPanel>

          <SectionPanel
            title="Trace relationships"
            actions={<Badge tone="success">Relationships recorded</Badge>}
          >
            <Card className="p-5 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <StepFlow
                  steps={[
                    { label: 'TRK-042', detail: 'Tanker' },
                    { label: activeBatch.sourceTank, detail: 'Storage tank' },
                    { label: activeBatch.id, detail: 'Production batch · this batch', tone: 'brand' },
                    { label: activeBatch.finishedLot, detail: 'Finished lot' }
                  ]}
                />
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to="/milk-traceability/graph"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover hover:underline"
                >
                  <Network className="w-3.5 h-3.5" /> Open relationship graph →
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    to="/milk-traceability/backward"
                    className="text-xs text-ink hover:text-ink-strong hover:underline"
                  >
                    Backward trace
                  </Link>
                  <span className="text-gray-300">·</span>
                  <Link
                    to="/milk-traceability/forward"
                    className="text-xs text-ink hover:text-ink-strong hover:underline"
                  >
                    Forward trace
                  </Link>
                </div>
              </div>
            </Card>
          </SectionPanel>
        </div>

        {/* Bottom row: Blockchain Verification & Material Allocation */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionPanel
            title="Blockchain Verification"
            actions={<Badge tone="neutral">Simulated</Badge>}
          >
            <Card className="p-5 space-y-4">
              <div className="divide-y divide-gray-100 text-xs">
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Integrity status</span>
                  <Badge tone={activeBatch.integrityStatus === 'Verified' ? 'success' : 'warning'}>
                    {activeBatch.integrityStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Material provenance reference</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-ink-strong font-semibold">{activeBatch.provenanceRef}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeBatch.provenanceRef, 'provenance')}
                      className="text-gray-400 hover:text-brand"
                      title="Copy provenance reference"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedKey === 'provenance' && <span className="text-[10px] text-success">Copied</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Transaction reference</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-ink-strong font-semibold">{activeBatch.txRef}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeBatch.txRef, 'tx')}
                      className="text-gray-400 hover:text-brand"
                      title="Copy transaction reference"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedKey === 'tx' && <span className="text-[10px] text-success">Copied</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Last verification</span>
                  <span className="text-ink-muted">{activeBatch.lastVerification}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Event hash</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-ink-strong font-semibold">{activeBatch.eventHash}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeBatch.eventHash, 'hash')}
                      className="text-gray-400 hover:text-brand"
                      title="Copy hash"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedKey === 'hash' && <span className="text-[10px] text-success">Copied</span>}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-2">Batch events</p>
                <div className="space-y-1.5">
                  {activeBatch.events.map((evt) => (
                    <div
                      key={evt.code}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface border border-gray-150 text-xs"
                    >
                      <div>
                        <span className="font-mono font-semibold text-ink-strong">{evt.type}</span>
                        <span className="text-ink-muted ml-2">{evt.code} · {evt.time}</span>
                      </div>
                      <Badge tone={evt.status === 'Verified' ? 'success' : 'warning'}>
                        {evt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full justify-center"
                  icon={ShieldCheck}
                  onClick={() => setShowVerificationModal(true)}
                >
                  View Verification Details
                </Button>
              </div>
            </Card>
          </SectionPanel>

          <SectionPanel
            title="Material Allocation"
            actions={<Badge tone="neutral">Simulated</Badge>}
          >
            <Card className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-ink-strong">
                    {fmt.liters(activeBatch.allocatedL)} of {fmt.liters(activeBatch.inputVolumeL)} allocated from {activeBatch.sourceTank}
                  </span>
                  <span className="font-bold text-brand">{activeBatch.allocatedPct}%</span>
                </div>
                <ProgressBar value={activeBatch.allocatedPct} tone="brand" />
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Source tank</span>
                  <span className="font-mono text-ink-strong font-semibold">{activeBatch.sourceTank}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Target production batch</span>
                  <span className="font-mono text-ink-strong font-semibold">{activeBatch.id}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Recorded available volume</span>
                  <span className="font-semibold text-ink-strong">{fmt.liters(activeBatch.inputVolumeL)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Allocated volume</span>
                  <span className="font-semibold text-ink-strong">{fmt.liters(activeBatch.allocatedL)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Remaining unallocated volume</span>
                  <span className="font-semibold text-ink-strong">{fmt.liters(activeBatch.remainingL)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Allocation reference</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-ink-strong font-semibold">ALC-1030-0</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('ALC-1030-0', 'alc')}
                      className="text-gray-400 hover:text-brand"
                      title="Copy allocation reference"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedKey === 'alc' && <span className="text-[10px] text-success">Copied</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Allocation status</span>
                  <Badge tone="success">{activeBatch.allocationStatus}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Approval status</span>
                  <div className="flex items-center gap-1.5">
                    <Badge tone="success">Approved</Badge>
                    <span className="text-ink-muted">{activeBatch.approvalInfo}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink">Blockchain proof of allocation</span>
                  <Badge tone={activeBatch.integrityStatus === 'Verified' ? 'success' : 'warning'}>
                    {activeBatch.integrityStatus}
                  </Badge>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-gray-150 text-[11px] text-ink leading-relaxed">
                Allocation status and blockchain proof are tracked separately: this allocation is Processed, while its latest proof is still {activeBatch.integrityStatus}.
              </div>
            </Card>
          </SectionPanel>
        </div>
      </div>

      {/* Verification Details Modal */}
      <Modal
        open={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        size="lg"
        eyebrow="Blockchain Verification Details"
        title={`Cryptographic Audit Proof · ${activeBatch.id}`}
        description="Rincian verifikasi kriptografi ledger terdistribusi dan stempel konsensus node."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl border border-brand/20 bg-brand/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink-strong">Status Konsensus</span>
              <Badge tone={activeBatch.integrityStatus === 'Verified' ? 'success' : 'warning'}>
                {activeBatch.integrityStatus === 'Verified' ? 'Confirmed on Ledger' : 'Pending Witness Confirmation'}
              </Badge>
            </div>
            <p className="text-[11px] text-ink">
              Proof hash terdaftar pada jaringan simulasi ledger Orbis. Setiap perpindahan material di stempel waktu dengan tanda tangan digital operator QA.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="py-2.5 flex justify-between">
              <span className="text-ink">Merkle Root</span>
              <span className="font-mono text-ink-strong">0x9f18a20d418bc049f7e89102c4819ba7</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-ink">Full Event Hash</span>
              <span className="font-mono text-ink-strong break-all">
                e03b1f6a2d0498b2f913d3e7af89c01b2234091ab7728c0345df1929381
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-ink">Block Height</span>
              <span className="font-mono text-ink-strong">#1,048,291</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-ink">Block Timestamp</span>
              <span className="text-ink-strong">30 Oct 2026 15:02:18 WIB</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-ink">Signatures Verified</span>
              <span className="text-ink-strong">4 of 5 Witness Nodes (Quorum Met)</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowVerificationModal(false)}>
              Tutup
            </Button>
            <Button
              onClick={() => {
                setShowVerificationModal(false)
                alert('Sertifikat audit integritas berhasil diunduh (Simulasi PDF).')
              }}
            >
              Unduh Sertifikat Integritas
            </Button>
          </div>
        </div>
      </Modal>

      {/* Allocation History Modal */}
      <Modal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        size="lg"
        eyebrow="Material Allocation History"
        title={`Riwayat Alokasi Material · ${activeBatch.id}`}
        description="Urutan kronologis alokasi susu dari tangki penyimpanan ke batch produksi."
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-gray-150 bg-surface">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-strong">1. Penerimaan Tanker TRK-042</span>
                <span className="text-ink-muted">30 Oct 08:30</span>
              </div>
              <p className="text-ink mt-1">Susu segar 12.000 L diterima di Bay-01 dan lolos uji lab release.</p>
            </div>

            <div className="p-3 rounded-lg border border-gray-150 bg-surface">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-strong">2. Transfer ke Raw Milk Tank (ST-04)</span>
                <span className="text-ink-muted">30 Oct 09:15</span>
              </div>
              <p className="text-ink mt-1">Susu dipompa ke tangki penyimpanan ST-04 dengan suhu cold chain 3.6°C.</p>
            </div>

            <div className="p-3 rounded-lg border border-gray-150 bg-surface">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-strong">3. Persetujuan Alokasi Material (Ana Putri)</span>
                <span className="text-ink-muted">30 Oct 09:55</span>
              </div>
              <p className="text-ink mt-1">Alokasi 8.200 L disetujui untuk Order Produksi Batch B-2026-1030-01.</p>
            </div>

            <div className="p-3 rounded-lg border border-gray-150 bg-surface">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-strong">4. Eksekusi Produksi Filling</span>
                <span className="text-ink-muted">30 Oct 11:00</span>
              </div>
              <p className="text-ink mt-1">Produksi berjalan pada line pengisian dan menghasilkan lot barang jadi FG-1030-01.</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="outline" onClick={() => setShowHistoryModal(false)}>
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
