import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'
import tsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from 'unplugin-auto-import/vite'
import { VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			dts: true,
			imports: ['vue', 'vue-router', '@vueuse/core', 'vitest'],
			eslintrc: {
				enabled: true,
			}
		}),
		Components({
			dts: true,
			resolvers: [VueUseComponentsResolver()],
		}),
		tsconfigPaths(),
		Sitemap({
			hostname: "https://ambo-game.web.app/"
		})
	]
})
