import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import { LanguageProvider } from './lib/i18n'
import { router } from './router'
import { PlanningProvider } from './state/planning'
import { UserRoleProvider } from './state/userRole'
import './state/catalog'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <UserRoleProvider>
        <PlanningProvider>
          <RouterProvider router={router} />
        </PlanningProvider>
      </UserRoleProvider>
    </LanguageProvider>
  </StrictMode>
)
