import { useState } from 'react'
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { Compass, LogOut } from 'lucide-react'
import { EmptyState } from '../components/common/EmptyState'
import { AppShell } from '../components/layout/AppShell'
import { useTranslation } from '../lib/i18n'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound
})

function RootLayout() {
  const [signedOut, setSignedOut] = useState(false)
  const { t } = useTranslation()

  if (signedOut) {
    return (
      <div className="h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <EmptyState
            icon={LogOut}
            title={t('pages.signedOut.title')}
            description={t('pages.signedOut.description')}
            action={{ label: t('shell.signIn'), onClick: () => setSignedOut(false) }}
          />
        </div>
      </div>
    )
  }

  return (
    <AppShell onLogout={() => setSignedOut(true)}>
      <Outlet />
    </AppShell>
  )
}

function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <EmptyState
      icon={Compass}
      title={t('pages.notFound.title')}
      description={t('pages.notFound.description')}
      action={{ label: t('pages.notFound.action'), onClick: () => void navigate({ to: '/dashboard' }) }}
    />
  )
}
