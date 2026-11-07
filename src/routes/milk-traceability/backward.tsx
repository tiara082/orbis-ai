import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { TraceView } from './-components/TraceView'
import { createScenarioTraceabilitySnapshot } from '../../data/traceability'

export const Route = createFileRoute('/milk-traceability/backward')({
  validateSearch: (search: Record<string, unknown>): { batch?: string } => ({
    batch: typeof search.batch === 'string' ? search.batch : undefined
  }),
  component: BackwardPage
})

function BackwardPage() {
  const { batch } = Route.useSearch()
  return (
    <>
      <PageHeader />
      <TraceView direction="backward" batchId={batch} defaultId="FG-1030-FL01-CH" snapshot={useMemo(() => createScenarioTraceabilitySnapshot('traceability-backward', '2026-10-30'), [])} />
    </>
  )
}
