import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
  ],
  css: {
    lightningcss: {
      targets: LIGHTNING_TARGETS,
    },
  },
})
