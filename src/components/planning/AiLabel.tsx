import { Sparkles } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'
import { Badge } from '../ui/Badge'

/** Marks model output so it is never confused with a validated constraint */
export function AiLabel({ kind = 'forecast' }: { kind?: 'forecast' | 'optimizer' }) {
  const { t } = useTranslation()
  return (
    <Badge tone="brand" icon={Sparkles} shape="pill">
      {t(`planning.aiLabel.${kind}`)}
    </Badge>
  )
}
