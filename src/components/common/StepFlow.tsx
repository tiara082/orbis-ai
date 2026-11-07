import React from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { toneSoft, type Tone } from '../../lib/status'

export interface FlowStep {
  label: string
  detail?: string
  /** `done` | `current` | `upcoming` for progress flows; or a tone for sequence chips */
  state?: 'done' | 'current' | 'upcoming'
  tone?: Tone
}

interface StepFlowProps {
  steps: FlowStep[]
  /** `chips` = arrow-separated sequence; `progress` = numbered stepper */
  variant?: 'chips' | 'progress'
  className?: string
}

export const StepFlow: React.FC<StepFlowProps> = ({ steps, variant = 'chips', className }) => {
  if (variant === 'progress') {
    return (
      <ol
        className={cn('grid gap-y-5 overflow-x-auto', className)}
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(88px, 1fr))` }}
      >
        {steps.map((step, i) => {
          const state = step.state ?? 'upcoming'
          return (
            <li key={step.label} className="relative">
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    'absolute top-3.5 left-1/2 w-full h-0.5',
                    state === 'done' ? 'bg-brand' : 'bg-gray-200'
                  )}
                />
              )}
              <div className="relative flex flex-col items-center text-center px-1">
                <span
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2',
                    state === 'done' && 'bg-brand border-brand text-white',
                    state === 'current' && 'bg-white border-brand text-brand ring-4 ring-brand/15',
                    state === 'upcoming' && 'bg-white border-gray-200 text-ink'
                  )}
                >
                  {state === 'done' ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={cn(
                    'mt-2 text-xs font-semibold',
                    state === 'upcoming' ? 'text-ink' : 'text-ink-strong'
                  )}
                >
                  {step.label}
                </span>
                {step.detail && <span className="text-[11px] text-ink mt-0.5">{step.detail}</span>}
              </div>
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {steps.map((step, i) => (
        <React.Fragment key={`${step.label}-${i}`}>
          <div className={cn('rounded-lg border px-3 py-2', toneSoft[step.tone ?? 'neutral'])}>
            <p className="text-xs font-semibold text-ink-strong">{step.label}</p>
            {step.detail && <p className="text-[11px] text-ink mt-0.5 tabular-nums">{step.detail}</p>}
          </div>
          {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />}
        </React.Fragment>
      ))}
    </div>
  )
}
