import { defineConfig } from 'astro/config'
import tailwind from "@astrojs/tailwind"
import vue from "@astrojs/vue"
import image from "@astrojs/image"
import prefetch from "@astrojs/prefetch"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), vue(), image(), prefetch()]
})