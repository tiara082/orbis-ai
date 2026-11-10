import React, { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  CalendarCheck,
  CircleHelp,
  Database,
  GitFork,
  Languages,
  LayoutGrid,
  LayoutPanelLeft,
  Library,
  SearchCheck,
  Sparkles,
  type LucideIcon
} from 'lucide-react'
import { Callout } from '../../components/common/Callout'
import { Card, SectionPanel } from '../../components/common/SectionPanel'
import { StepFlow } from '../../components/common/StepFlow'
import { LanguageToggle } from '../../components/layout/LanguageToggle'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { IconTile } from '../../components/ui/IconTile'
import type { AppPath } from '../../config/navigation'
import { GUIDE_META, GUIDE_SECTIONS, QUICK_START, type GuideBlock, type GuideIcon, type GuideSection } from '../../content/userGuide'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import type { Tone } from '../../lib/status'

export const Route = createFileRoute('/guide/')({ component: GuidePage })

const ICONS: Record<GuideIcon, LucideIcon> = {
  language: Languages,
  layout: LayoutPanelLeft,
  concept: Library,
  ai: Sparkles,
  approval: CalendarCheck,
  graph: GitFork,
  investigation: SearchCheck,
  operations: Database,
  dashboard: LayoutGrid,
  glossary: CircleHelp
}

const HIGHLIGHT_TONE: Record<NonNullable<GuideSection['highlight']>, Tone> = { ai: 'brand', trace: 'success' }

function Inline({ text, strongClassName = 'text-ink-strong' }: { text: string; strongClassName?: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className={cn('font-semibold', strongClassName)}>
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="font-mono text-xs rounded bg-gray-100 px-1 py-0.5 text-ink-strong">
              {part.slice(1, -1)}
            </code>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

function Block({ block }: { block: GuideBlock }) {
  const { t } = useTranslation()

  switch (block.type) {
    case 'heading':
      return <h3 className="text-sm font-bold text-ink-strong pt-2">{block.text}</h3>
    case 'p':
      return (
        <p className="text-sm text-ink leading-relaxed">
          <Inline text={block.text} />
        </p>
      )
    case 'list':
      return (
        <ul className="space-y-1.5 text-sm text-ink list-disc pl-5 leading-relaxed">
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      )
    case 'steps':
      return (
        <ol className="space-y-2">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-sm text-ink leading-relaxed">
              <span className="w-6 h-6 shrink-0 rounded-full bg-brand-muted text-brand text-xs font-bold flex items-center justify-center tabular-nums">
                {i + 1}
              </span>
              <span className="pt-0.5">
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ol>
      )
    case 'callout':
      return <Callout tone={block.tone} title={block.title} description={<Inline text={block.text} />} />
    case 'table':
      return (
        <div className="overflow-x-auto thin-scrollbar rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {block.head.map((head, i) => (
                  <th key={`${head}-${i}`} className="px-3 py-2 text-left text-xs font-medium text-ink">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {block.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((value, i) => (
                    <td key={i} className={cn('px-3 py-2 align-top text-ink', i === 0 && 'font-semibold text-ink-strong whitespace-nowrap')}>
                      <Inline text={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'flow':
      return (
        <Card className="p-4">
          <StepFlow steps={block.items.map((item, i) => ({ label: item.label, detail: item.detail, tone: (i === 0 ? 'brand' : 'neutral') as Tone }))} />
        </Card>
      )
    case 'links':
      return (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-ink">{t('guide.openInApp')}</span>
          {block.items.map((item) => (
            <Link
              key={item.path}
              to={item.path as AppPath}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-brand-subtle bg-brand-muted text-xs font-medium text-brand hover:bg-brand-subtle"
            >
              {item.label} <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      )
    case 'faq':
      return (
        <div className="space-y-2">
          {block.items.map((item) => (
            <details key={item.q} className="group rounded-xl border border-gray-200 bg-white px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-ink-strong list-none flex items-center justify-between gap-3">
                {item.q}
                <ArrowRight className="w-3.5 h-3.5 text-ink shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="text-sm text-ink mt-2 leading-relaxed">
                <Inline text={item.a} />
              </p>
            </details>
          ))}
        </div>
      )
    case 'widget':
      return (
        <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink-strong">{t('guide.tryLanguage')}</p>
            <p className="text-xs text-ink mt-0.5">{t('pages.settings.languageHint')}</p>
          </div>
          <LanguageToggle />
        </Card>
      )
  }
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return active
}

const SECTION_IDS = GUIDE_SECTIONS.map((section) => section.id)

const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function GuidePage() {
  const { t, locale } = useTranslation()
  const active = useActiveSection(SECTION_IDS)

  return (
    <>
      <PageHeader />

      <div className="space-y-5">
        <Callout
          variant="strong"
          icon={Sparkles}
          eyebrow={GUIDE_META.subtitle}
          title={GUIDE_META.welcome}
          description={<Inline text={GUIDE_META.intro} strongClassName="text-white" />}
        />

        {locale !== 'id' && <Callout tone="info" icon={Languages} title={t('guide.contentLanguage')} description={t('guide.contentLanguageHint')} />}

        <SectionPanel title={t('guide.quickStart')} subtitle={t('guide.quickStartHint')}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {QUICK_START.map((step, i) => {
              const section = GUIDE_SECTIONS.find((s) => s.id === step.sectionId)
              return (
                <Card key={step.label} onClick={() => scrollToSection(step.sectionId)} className="p-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center tabular-nums">
                      {i + 1}
                    </span>
                    {section && <IconTile icon={ICONS[section.icon]} tone={section.highlight ? HIGHLIGHT_TONE[section.highlight] : 'neutral'} size="sm" />}
                  </div>
                  <p className="text-sm font-semibold text-ink-strong mt-3">{step.label}</p>
                  <p className="text-xs text-ink mt-0.5">{step.detail}</p>
                </Card>
              )
            })}
          </div>
        </SectionPanel>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <nav className="lg:sticky lg:top-4 self-start rounded-2xl border border-gray-200 bg-gray-50 p-2" aria-label={t('guide.toc')}>
            <p className="px-2 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink">{t('guide.toc')}</p>
            <ul className="space-y-0.5">
              {GUIDE_SECTIONS.map((section) => {
                const Icon = ICONS[section.icon]
                const isActive = section.id === active
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors',
                        isActive ? 'bg-white text-ink-strong font-semibold shadow-xs' : 'text-ink hover:text-ink-strong hover:bg-white/60'
                      )}
                    >
                      <Icon className={cn('w-3.5 h-3.5 shrink-0', isActive && 'text-brand')} />
                      <span className="flex-1 min-w-0">{section.title}</span>
                      {section.highlight && (
                        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', section.highlight === 'ai' ? 'bg-brand' : 'bg-success')} />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="mt-3 px-2 pb-1 space-y-1 text-[11px] text-ink">
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> {t('guide.focus.ai')}
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> {t('guide.focus.trace')}
              </p>
            </div>
          </nav>

          <div className="space-y-5 min-w-0">
            {GUIDE_SECTIONS.map((section) => (
              <SectionPanel
                key={section.id}
                id={section.id}
                variant="plain"
                className={cn('scroll-mt-4', section.highlight === 'ai' && 'border-brand-subtle', section.highlight === 'trace' && 'border-success-subtle')}
              >
                <div className="flex items-start gap-3 mb-4">
                  <IconTile icon={ICONS[section.icon]} tone={section.highlight ? HIGHLIGHT_TONE[section.highlight] : 'neutral'} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-extrabold tracking-tight text-ink-strong">{section.title}</h2>
                      {section.highlight && (
                        <Badge tone={HIGHLIGHT_TONE[section.highlight]} icon={section.highlight === 'ai' ? Sparkles : GitFork} shape="pill">
                          {t(`guide.focus.${section.highlight}`)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-ink mt-1">{section.summary}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.blocks.map((block, i) => (
                    <Block key={`${section.id}-${i}`} block={block} />
                  ))}
                </div>
              </SectionPanel>
            ))}

            <p className="text-[11px] text-ink">
              <Inline text={GUIDE_META.demoNote} />
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
