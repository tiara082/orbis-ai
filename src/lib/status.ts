import {
  CircleCheck,
  CircleDashed,
  CircleHelp,
  CircleX,
  Clock,
  Database,
  Droplets,
  FlaskConical,
  Hourglass,
  Loader,
  ShieldAlert,
  ShieldCheck,
  Truck,
  TriangleAlert,
  Wrench,
  type LucideIcon
} from 'lucide-react'

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

export interface StatusStyle {
  tone: Tone
  icon?: LucideIcon
}

/** Keys are lowercase status strings; labels live under status.<key> in i18n */
const STATUS_MAP: Record<string, StatusStyle> = {
  // Workflow and approval
  ready: { tone: 'success' },
  pending: { tone: 'warning', icon: Clock },
  'pending approval': { tone: 'brand', icon: Clock },
  approved: { tone: 'success', icon: CircleCheck },
  rejected: { tone: 'danger', icon: CircleX },
  superseded: { tone: 'neutral', icon: CircleDashed },
  completed: { tone: 'success', icon: CircleCheck },
  running: { tone: 'brand', icon: Loader },
  valid: { tone: 'success', icon: CircleCheck },
  invalid: { tone: 'danger', icon: CircleX },

  // Rule check results
  pass: { tone: 'success', icon: CircleCheck },
  warning: { tone: 'warning', icon: TriangleAlert },
  violation: { tone: 'danger', icon: CircleX },
  'not computable': { tone: 'neutral', icon: CircleHelp },

  // Priority and timing
  high: { tone: 'danger', icon: TriangleAlert },
  medium: { tone: 'warning' },
  low: { tone: 'info' },
  late: { tone: 'danger', icon: TriangleAlert },
  'on time': { tone: 'success', icon: CircleCheck },

  // Receiving and QC
  'on the way': { tone: 'info', icon: Truck },
  arrived: { tone: 'info', icon: Truck },
  'lab pending': { tone: 'warning', icon: FlaskConical },
  passed: { tone: 'success', icon: CircleCheck },
  'within spec': { tone: 'success', icon: CircleCheck },
  'awaiting result': { tone: 'warning', icon: Clock },
  stored: { tone: 'success', icon: CircleCheck },
  'pending qa': { tone: 'warning', icon: ShieldAlert },
  released: { tone: 'success', icon: ShieldCheck },

  // Equipment and tanks
  idle: { tone: 'neutral', icon: CircleDashed },
  available: { tone: 'success', icon: CircleCheck },
  occupied: { tone: 'info', icon: Loader },
  inactive: { tone: 'neutral', icon: CircleDashed },
  cip: { tone: 'info', icon: Droplets },
  'cip required': { tone: 'warning', icon: Droplets },
  maintenance: { tone: 'danger', icon: Wrench },
  'holding risk': { tone: 'warning', icon: Hourglass },
  empty: { tone: 'neutral', icon: CircleDashed },

  // Catalog
  eligible: { tone: 'success', icon: CircleCheck },
  'not eligible': { tone: 'neutral', icon: CircleX },
  computed: { tone: 'success', icon: CircleCheck },
  reference: { tone: 'neutral', icon: Database }
}

export function getStatusStyle(status: string): StatusStyle {
  return STATUS_MAP[status.trim().toLowerCase()] ?? { tone: 'neutral' }
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
