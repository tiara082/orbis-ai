import { useState } from 'react'
import { Cloud, CloudCheck, CloudOff, RefreshCw } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { useTranslation } from '../../../lib/i18n'
import { pushAllToSupabase, resetCatalog, useCatalog } from '../../../state/catalog'

export function CatalogBanner() {
  const { t } = useTranslation()
  const { customized, syncStatus, syncMessage } = useCatalog()
  const [loading, setLoading] = useState(false)

  const handleSyncAll = async () => {
    setLoading(true)
    await pushAllToSupabase()
    setLoading(false)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-3.5 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-muted text-brand">
          {syncStatus === 'syncing' ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : syncStatus === 'synced' ? (
            <CloudCheck className="h-4 w-4 text-success" />
          ) : syncStatus === 'error' ? (
            <CloudOff className="h-4 w-4 text-danger" />
          ) : (
            <Cloud className="h-4 w-4" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-strong">
              Pusat Database Master
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                syncStatus === 'synced'
                  ? 'bg-success/10 text-success'
                  : syncStatus === 'syncing'
                  ? 'bg-brand/10 text-brand'
                  : syncStatus === 'error'
                  ? 'bg-danger/10 text-danger'
                  : 'bg-gray-100 text-ink-muted'
              }`}
            >
              {syncStatus === 'synced'
                ? 'Synced'
                : syncStatus === 'syncing'
                ? 'Syncing...'
                : syncStatus === 'error'
                ? 'Error / Offline'
                : 'Connected'}
            </span>
          </div>
          <p className="text-[11px] text-ink-muted">
            {syncMessage || (customized ? t('master.edit.session') : 'Semua perubahan otomatis tersimpan di database')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={handleSyncAll} disabled={loading}>
          {loading ? (
            <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Cloud className="mr-1.5 h-3.5 w-3.5 text-brand" />
          )}
          Sinkronkan Semua Data
        </Button>
        {customized && (
          <Button size="sm" variant="outline" onClick={() => resetCatalog()}>
            {t('master.edit.reset')}
          </Button>
        )}
      </div>
    </div>
  )
}
