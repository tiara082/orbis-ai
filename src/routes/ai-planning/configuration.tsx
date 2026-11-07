import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { SectionPanel, Card } from '../../components/common/SectionPanel'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import type { Priority } from '../../data/scenario'
import { PLANNED_ORDERS, VARIANT_DURATION_OPTIONS, type PlanConfig } from '../../domain/plan'
import { at, clock } from '../../domain/time'
import { useTranslation } from '../../lib/i18n'
import { usePlanning } from '../../state/planning'

export const Route = createFileRoute('/ai-planning/configuration')({ component: ConfigurationPage })

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-strong">{label}</span>
      {hint && <span className="block text-[11px] text-ink mt-0.5">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function NumberInput({ value, onChange, min = 0, step = 1, suffix }: { value: number; onChange: (value: number) => void; min?: number; step?: number; suffix?: string }) {
  return (
    <div className="relative">
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))}
        className="w-full h-9 rounded-lg border border-gray-200 bg-white pl-3 pr-14 text-sm tabular-nums text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink pointer-events-none">{suffix}</span>}
    </div>
  )
}

function ConfigurationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { config, updateConfig, resetConfig, configChanged, activeRevision } = usePlanning()

  const set = <K extends keyof PlanConfig>(key: K, value: PlanConfig[K]) => updateConfig((current) => ({ ...current, [key]: value }))

  return (
    <>
      <PageHeader
        titleAddon={configChanged ? <Badge status="warning">{t('planning.config.changed')}</Badge> : <Badge status="approved">{t('planning.config.matches', { id: activeRevision.id })}</Badge>}
        actions={
          <>
            <Button variant="outline" icon={RotateCcw} onClick={resetConfig} disabled={!configChanged}>
              {t('planning.config.reset')}
            </Button>
            <Button iconRight={ArrowRight} onClick={() => void navigate({ to: '/ai-planning/generate' })}>
              {t('planning.config.toGenerate')}
            </Button>
          </>
        }
      />

      <div className="space-y-5">
        <SectionPanel title={t('planning.config.orders')} subtitle={t('planning.config.ordersHint')}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {PLANNED_ORDERS.map((order) => (
              <Card key={order.id} className="p-4 space-y-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-ink-strong">{order.id}</p>
                  <p className="text-[11px] text-ink">{order.finishedSkuId} · {t('col.due')} {clock(order.due)}</p>
                </div>
                <Field label={t('col.packs')}>
                  <NumberInput
                    value={config.orderPacks[order.id] ?? 0}
                    step={500}
                    suffix={t('units.packs')}
                    onChange={(value) => set('orderPacks', { ...config.orderPacks, [order.id]: value })}
                  />
                </Field>
                <Field label={t('col.priority')}>
                  <Select
                    size="md"
                    value={config.orderPriority[order.id]}
                    onChange={(value) => set('orderPriority', { ...config.orderPriority, [order.id]: value as Priority })}
                    options={(['high', 'medium', 'low'] as const).map((p) => ({ value: p, label: t(`status.${p}`) }))}
                  />
                </Field>
              </Card>
            ))}
          </div>
        </SectionPanel>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionPanel title={t('planning.config.lines')} subtitle={t('planning.config.linesHint')}>
            <Card className="p-4 grid gap-4 sm:grid-cols-2">
              {Object.keys(config.lineSpeed).map((lineId) => (
                <Field key={lineId} label={t('planning.config.speed', { line: lineId })} hint="FILLING_SPEED_UNIT">
                  <NumberInput value={config.lineSpeed[lineId]} step={100} suffix={t('units.packsPerHour')} onChange={(value) => set('lineSpeed', { ...config.lineSpeed, [lineId]: value })} />
                </Field>
              ))}
              <Field label={t('planning.config.utilization')} hint={t('planning.config.utilizationHint')}>
                <NumberInput value={config.utilizationPct} min={10} step={5} suffix="%" onChange={(value) => set('utilizationPct', Math.min(100, value))} />
              </Field>
              <Field label={t('planning.config.start')}>
                <input
                  type="time"
                  value={clock(config.start)}
                  onChange={(event) => event.target.value && set('start', at(event.target.value))}
                  className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm tabular-nums text-ink-strong focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </Field>
            </Card>
          </SectionPanel>

          <SectionPanel title={t('planning.config.changeover')} subtitle={t('planning.config.changeoverHint')}>
            <Card className="p-4 grid gap-4 sm:grid-cols-3">
              <Field label={t('schedule.block.VARIANT')} hint={t('planning.config.variantHint')}>
                <Select
                  size="md"
                  value={String(config.changeoverMin.VARIANT)}
                  onChange={(value) => set('changeoverMin', { ...config.changeoverMin, VARIANT: Number(value) })}
                  options={VARIANT_DURATION_OPTIONS.map((min) => ({ value: String(min), label: `${min} ${t('units.min')}` }))}
                />
              </Field>
              <Field label={t('schedule.block.SIZE')}>
                <NumberInput value={config.changeoverMin.SIZE} step={5} suffix={t('units.min')} onChange={(value) => set('changeoverMin', { ...config.changeoverMin, SIZE: value })} />
              </Field>
              <Field label={t('schedule.block.PAPER')}>
                <NumberInput value={config.changeoverMin.PAPER} step={5} suffix={t('units.min')} onChange={(value) => set('changeoverMin', { ...config.changeoverMin, PAPER: value })} />
              </Field>
            </Card>
          </SectionPanel>
        </div>

        <SectionPanel title={t('planning.config.cip')} subtitle={t('planning.config.cipHint')}>
          <Card className="p-4 grid gap-4 sm:grid-cols-3">
            {(Object.keys(config.cipMin) as (keyof PlanConfig['cipMin'])[]).map((ruleId) => (
              <Field key={ruleId} label={ruleId} hint={t(`planning.config.cipRule.${ruleId}`)}>
                <NumberInput value={config.cipMin[ruleId]} step={5} suffix={t('units.min')} onChange={(value) => set('cipMin', { ...config.cipMin, [ruleId]: value })} />
              </Field>
            ))}
          </Card>
        </SectionPanel>
      </div>
    </>
  )
}
