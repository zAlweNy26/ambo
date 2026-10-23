import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Regenerate with: bunx pwa-assets-generator
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { background: '#c41e2a' },
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: { background: '#c41e2a' },
    },
  },
  images: ['public/logo.svg'],
})
