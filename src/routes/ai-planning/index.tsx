import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/ai-planning/')({
  beforeLoad: () => {
    throw redirect({ to: '/ai-planning/forecasting' })
  }
})
