import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
/** LightningCSS: incluir Firefox para emitir `backdrop-filter` (não só `-webkit-`). */
const LIGHTNING_TARGETS = {
  chrome: 115 << 16,
  firefox: 115 << 16,
  safari: (16 << 16) | (4 << 8),
  edge: 115 << 16,
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'apple-touch-icon.png',
        'icons/bv-symbol-green-16.png',
        'icons/bv-symbol-green-32.png',
        'icons/bv-symbol-green-192.png',
        'icons/bv-symbol-green-512.png',
        'icons/bv-maskable-512.png',
      ],
      manifest: {
        name: 'BrokerVision',
        short_name: 'BrokerVision',
        description: 'A visão que faltava.',
        theme_color: '#af9f82',
        background_color: '#141414',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'pt-BR',
        icons: [
          {
            src: '/icons/bv-symbol-green-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/bv-symbol-green-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/bv-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        /** Fundos grandes em public — não precisam de offline obrigatório e ultrapassam o limite default do Workbox */
        globIgnores: ['**/dashboard-bg.png', '**/dashboard-bg-light.png'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  css: {
    lightningcss: {
      targets: LIGHTNING_TARGETS,
    },
  },
})
