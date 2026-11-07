import {
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock,
  Database,
  FlaskConical,
  Loader,
  ShieldAlert,
  ShieldCheck,
  Truck,
  TriangleAlert,
  type LucideIcon
} from 'lucide-react'

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

export interface StatusStyle {
  tone: Tone
  icon?: LucideIcon
}

const STATUS_MAP: Record<string, StatusStyle> = {
  // Ledger / blockchain integrity
  recorded: { tone: 'neutral', icon: Database },
  verified: { tone: 'success', icon: ShieldCheck },
  'hash verified': { tone: 'success', icon: ShieldCheck },
  mismatch: { tone: 'danger', icon: ShieldAlert },
  match: { tone: 'success', icon: ShieldCheck },
  'integrity match': { tone: 'success', icon: ShieldCheck },
  'not recorded': { tone: 'neutral', icon: CircleDashed },

  // Generic workflow
  ready: { tone: 'success' },
  pending: { tone: 'warning', icon: Clock },
  review: { tone: 'warning', icon: Clock },
  'in review': { tone: 'warning', icon: Clock },
  validated: { tone: 'success', icon: CircleCheck },
  valid: { tone: 'success', icon: CircleCheck },
  approved: { tone: 'success', icon: CircleCheck },
  completed: { tone: 'success', icon: CircleCheck },
  complete: { tone: 'success', icon: CircleCheck },
  imported: { tone: 'success', icon: CircleCheck },
  success: { tone: 'success', icon: CircleCheck },
  passed: { tone: 'success', icon: CircleCheck },
  pass: { tone: 'success', icon: CircleCheck },
  rejected: { tone: 'danger', icon: CircleX },
  failed: { tone: 'danger', icon: CircleX },
  error: { tone: 'danger', icon: CircleX },
  invalid: { tone: 'danger', icon: CircleX },
  critical: { tone: 'danger', icon: TriangleAlert },
  high: { tone: 'danger', icon: TriangleAlert },
  medium: { tone: 'warning', icon: TriangleAlert },
  warning: { tone: 'warning', icon: TriangleAlert },
  low: { tone: 'info' },
  open: { tone: 'warning', icon: Clock },
  investigating: { tone: 'brand', icon: Loader },
  'under investigation': { tone: 'brand', icon: Loader },
  'potentially affected': { tone: 'warning', icon: TriangleAlert },
  'potential impact': { tone: 'warning', icon: TriangleAlert },
  confirmed: { tone: 'info', icon: CircleCheck },
  hold: { tone: 'danger', icon: ShieldAlert },
  'on hold': { tone: 'danger', icon: ShieldAlert },
  closed: { tone: 'neutral', icon: CircleCheck },
  'in progress': { tone: 'brand', icon: Loader },
  running: { tone: 'brand', icon: Loader },
  draft: { tone: 'neutral' },
  insufficient: { tone: 'warning', icon: TriangleAlert },
  'needs review': { tone: 'warning', icon: Clock },
  active: { tone: 'success', icon: CircleCheck },

  // Incoming tanker stages
  'on the way': { tone: 'info', icon: Truck },
  arrived: { tone: 'info', icon: Truck },
  sampling: { tone: 'brand', icon: FlaskConical },
  'lab test': { tone: 'brand', icon: FlaskConical },
  'lab pending': { tone: 'warning', icon: Clock },
  receiving: { tone: 'success', icon: CircleCheck },
  released: { tone: 'success', icon: CircleCheck },
  unloading: { tone: 'info', icon: Loader },
  stored: { tone: 'success', icon: CircleCheck },
  delayed: { tone: 'danger', icon: TriangleAlert }
}

export function getStatusStyle(status: string): StatusStyle {
  const key = status.trim().toLowerCase()
  if (STATUS_MAP[key]) return STATUS_MAP[key]
  const prefix = Object.keys(STATUS_MAP).find((k) => key.startsWith(k))
  return prefix ? STATUS_MAP[prefix] : { tone: 'neutral' }
}

export const toneText: Record<Tone, string> = {
  neutral: 'text-ink',
  brand: 'text-brand',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info'
}

export const toneSoft: Record<Tone, string> = {
  neutral: 'bg-gray-50 text-ink border-gray-200',
  brand: 'bg-brand-muted text-brand border-brand-subtle',
  success: 'bg-success-muted text-success border-success-subtle',
  warning: 'bg-warning-muted text-warning border-warning-subtle',
  danger: 'bg-danger-muted text-danger border-danger-subtle',
  info: 'bg-info-muted text-info border-info-subtle'
}

export const toneSolid: Record<Tone, string> = {
  neutral: 'bg-gray-700 text-white',
  brand: 'bg-brand text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  danger: 'bg-danger text-white',
  info: 'bg-info text-white'
}
