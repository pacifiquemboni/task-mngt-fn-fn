import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // ── Registration ────────────────────────────────────────────────
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
        'pwa-192x192.svg',
        'pwa-512x512.svg',
        'pwa-maskable-512x512.svg',
      ],

      // ── Web App Manifest ────────────────────────────────────────────
      manifest: {
        name: 'TaskFlow – Task Manager',
        short_name: 'TaskFlow',
        description: 'A modern task management application with offline support',
        theme_color: '#f59e0b',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: '/pwa-maskable-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },

      // ── Workbox configuration ───────────────────────────────────────
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],

        runtimeCaching: [
          // ── API GET requests ──────────────────────────────────────
          {
            urlPattern: /\/api\/(tasks|tags)/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 5,
            },
          },

          // ── Mutations (POST/PUT/DELETE) → NetworkOnly ──────────────
          {
            urlPattern: /\/api\//i,
            handler: 'NetworkOnly',
            method: 'POST',
          },
          {
            urlPattern: /\/api\//i,
            handler: 'NetworkOnly',
            method: 'PUT',
          },
          {
            urlPattern: /\/api\//i,
            handler: 'NetworkOnly',
            method: 'DELETE',
          },

          // ── JS / CSS → StaleWhileRevalidate (fast from cache) ─────
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-js-css',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },

          // ── Images / fonts → CacheFirst ────────────────────────────
          {
            urlPattern: /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-images-fonts',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 60,
              },
            },
          },

          // ── Google Fonts ──────────────────────────────────────────
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],

        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },

      // ── Dev mode — register SW so install prompt & offline work ────
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],

  // ── Build optimizations ─────────────────────────────────────────────
  build: {
    // Target modern browsers for smaller output
    target: 'es2022',

    // Manual chunk splitting to keep the initial bundle small and
    // allow each chunk to be cached independently.
    // Vite 8 / Rolldown requires manualChunks as a function.
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/react/')) return 'vendor-react'
          if (id.includes('node_modules/react-router-dom')) return 'vendor-router'
          if (id.includes('node_modules/react-big-calendar')) return 'vendor-calendar'
          if (id.includes('node_modules/date-fns')) return 'vendor-date'
          if (id.includes('node_modules/react-colorful')) return 'vendor-color'
          if (id.includes('node_modules/axios')) return 'vendor-http'
        },
      },
    },

    // Increase the chunk warning threshold (vendor-calendar is large)
    chunkSizeWarningLimit: 250,
  },
})
