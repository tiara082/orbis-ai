import { Button } from '../../../components/ui/Button'
import { useTranslation } from '../../../lib/i18n'
import { resetCatalog, useCatalog } from '../../../state/catalog'

/** Shown once a category has been changed by a form or an upload */
export function CatalogBanner() {
  const { t } = useTranslation()
  const { customized } = useCatalog()
  if (!customized) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-subtle bg-brand-muted px-4 py-2.5">
      <p className="text-xs text-ink-strong">{t('master.edit.session')}</p>
      <Button size="sm" variant="outline" onClick={() => resetCatalog()}>
        {t('master.edit.reset')}
      </Button>
    </div>
  )
}
