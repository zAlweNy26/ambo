import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'
import tsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from 'unplugin-auto-import/vite'
import { VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'

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
		}),
		VitePWA({
			registerType: 'prompt',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: 'index.html',
				suppressWarnings: true,
			},
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
			manifest: {
				name: 'Ambo! - Gioco della tombola',
				short_name: 'Ambo!',
				description: 'Gioco della tombola digitale, per quando non hai voglia di portarti la scatola!',
				theme_color: '#5B06D6',
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png'
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			}
		})
	]
})
