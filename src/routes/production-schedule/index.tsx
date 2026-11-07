import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/production-schedule/')({
  beforeLoad: () => {
    throw redirect({ to: '/production-schedule/recommended' })
  }
})
