import React from 'react'
import { CircleCheck, CircleHelp, CircleX, TriangleAlert } from 'lucide-react'
import type { CheckResult } from '../../domain/checks'
import { useCheckText } from '../../lib/checkText'
import type { Tone } from '../../lib/status'
import { Callout } from '../common/Callout'

const STYLE: Record<CheckResult['status'], { tone: Tone; icon: typeof CircleCheck }> = {
  pass: { tone: 'success', icon: CircleCheck },
  warning: { tone: 'warning', icon: TriangleAlert },
  violation: { tone: 'danger', icon: CircleX },
  'not computable': { tone: 'neutral', icon: CircleHelp }
}

/** One rule check shown as a banner, labelled with its catalog rule ID */
export const CheckCallout: React.FC<{ check: CheckResult; actions?: React.ReactNode; className?: string }> = ({ check, actions, className }) => {
  const checkText = useCheckText()
  const text = checkText(check)
  const style = STYLE[check.status]
  return (
    <Callout
      tone={style.tone}
      icon={style.icon}
      eyebrow={`${check.ruleId} · ${text.title}`}
      title={text.message}
      actions={actions}
      className={className}
    />
  )
}
