import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../../components/layout/PageHeader'
import { TraceView } from './-components/TraceView'

export const Route = createFileRoute('/milk-traceability/forward')({
  validateSearch: (search: Record<string, unknown>): { batch?: string } => ({
    batch: typeof search.batch === 'string' ? search.batch : undefined
  }),
  component: ForwardPage
})

function ForwardPage() {
  const { batch } = Route.useSearch()
  return (
    <>
      <PageHeader />
      <TraceView direction="forward" batchId={batch} defaultId="RT-A02-1030" />
    </>
  )
}
