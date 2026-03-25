import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ── Render first, register SW after (non-blocking → faster LCP) ──────
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// ── Deferred Service Worker Registration ─────────────────────────────
// Dynamic import keeps `virtual:pwa-register` out of the critical path.
// We wait for the 'load' event so SW install doesn't compete with
// initial JS parse + render on the main thread.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const { registerSW } = await import('virtual:pwa-register')

    registerSW({
      onRegisteredSW(swUrl, registration) {
        if (registration) {
          setInterval(() => registration.update(), 60 * 60 * 1000)
        }
        console.log(`[PWA] Service worker registered: ${swUrl}`)
      },
      onOfflineReady() {
        console.log('[PWA] App ready to work offline')
      },
    })
  })
}
