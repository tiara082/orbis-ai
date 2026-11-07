import { Database, FileSpreadsheet } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'

/** Table footer: values come from the demo scenario, IDs from the official catalog */
export function ScenarioNote() {
  const { t } = useTranslation()
  return (
    <span className="inline-flex items-center gap-1.5">
      <Database className="w-3.5 h-3.5" />
      {t('source.scenarioNote')}
    </span>
  )
}

/** Table footer naming the official CSV a table is read from */
export function CatalogNote({ files }: { files: string[] }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <FileSpreadsheet className="w-3.5 h-3.5" />
      <span className="font-mono text-[11px]">{files.join(' · ')}</span>
    </span>
  )
}
