import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/milk-traceability/')({
  beforeLoad: () => {
    throw redirect({ to: '/milk-traceability/batches' })
  }
})
