import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Tests run outside Nuxt, so they get its path aliases here
const path = (dir: string) => fileURLToPath(new URL(dir, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '#shared': path('./shared'),
      '#server': path('./server'),
      '~': path('./app'),
    },
  },
})
