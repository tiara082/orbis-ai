import type { NavPage } from './navigation'
import type { Tone } from '../lib/status'

export interface AppAlert {
  id: string
  tone: Tone
  titleKey: string
  bodyKey: string
  page: NavPage
  at: string
}

export const APP_ALERTS: AppAlert[] = [
  {
    id: 'trk-045',
    tone: 'danger',
    titleKey: 'alerts.tankerDelay.title',
    bodyKey: 'alerts.tankerDelay.body',
    page: 'tanker-delayed',
    at: '11:40'
  },
  {
    id: 'qi-014',
    tone: 'warning',
    titleKey: 'alerts.quality.title',
    bodyKey: 'alerts.quality.body',
    page: 'quality-investigation-detail',
    at: '10:18'
  },
  {
    id: 'plan-approve',
    tone: 'brand',
    titleKey: 'alerts.approval.title',
    bodyKey: 'alerts.approval.body',
    page: 'ai-recommendation',
    at: '10:05'
  },
  {
    id: 'lab-pending',
    tone: 'warning',
    titleKey: 'alerts.labPending.title',
    bodyKey: 'alerts.labPending.body',
    page: 'tanker-lab-pending',
    at: '09:32'
  },
  {
    id: 'mismatch',
    tone: 'danger',
    titleKey: 'alerts.mismatch.title',
    bodyKey: 'alerts.mismatch.body',
    page: 'traceability-batch',
    at: '09:15'
  }
]

export const CURRENT_USER = {
  initials: 'AP',
  name: 'Ana Putri',
  email: 'ana.putri@orbis.demo'
}
