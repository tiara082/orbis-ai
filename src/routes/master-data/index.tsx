import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/master-data/')({
  beforeLoad: () => {
    throw redirect({ to: '/master-data/products' })
  }
})
