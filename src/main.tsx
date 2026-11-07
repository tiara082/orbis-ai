import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import { LanguageProvider } from './lib/i18n'
import { router } from './router'
import { PlanningProvider } from './state/planning'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <PlanningProvider>
        <RouterProvider router={router} />
      </PlanningProvider>
    </LanguageProvider>
  </StrictMode>,
)
