import { Badge } from '../../../components/ui/Badge'
import { useFormat } from '../../../lib/format'
import { useTranslation } from '../../../lib/i18n'
import { usePlanning } from '../../../state/planning'

/** Shows which approved revision the schedule pages are reading */
export function RevisionBadge() {
  const { t } = useTranslation()
  const fmt = useFormat()
  const { activeRevision } = usePlanning()
  return (
    <Badge status="approved" size="md" shape="pill">
      {t('schedule.activeRevision', { id: activeRevision.id, time: fmt.time(activeRevision.decidedAt ?? activeRevision.generatedAt) })}
    </Badge>
  )
}
