import { createFileRoute } from '@tanstack/react-router'
import { Card, SectionPanel } from '../../components/common/SectionPanel'
import { LanguageToggle } from '../../components/layout/LanguageToggle'
import { PageHeader } from '../../components/layout/PageHeader'
import { useTranslation } from '../../lib/i18n'

export const Route = createFileRoute('/account/settings')({ component: SettingsPage })

function SettingsPage() {
  const { t } = useTranslation()

  const rows = [
    { label: t('pages.settings.language'), hint: t('pages.settings.languageHint'), value: <LanguageToggle /> },
    { label: t('pages.settings.shift'), hint: undefined, value: t('pages.settings.shiftValue') },
    { label: t('pages.settings.timezone'), hint: undefined, value: t('pages.settings.timezoneValue') }
  ]

  return (
    <>
      <PageHeader hideTabs />

      <SectionPanel>
        <Card className="px-5 py-1 divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.label} className="py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-strong">{row.label}</p>
                {row.hint && <p className="text-xs text-ink mt-0.5 max-w-md">{row.hint}</p>}
              </div>
              <div className="shrink-0 text-sm font-medium text-ink-strong">{row.value}</div>
            </div>
          ))}
        </Card>
      </SectionPanel>
    </>
  )
}
