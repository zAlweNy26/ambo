// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    experimental: {
      websocket: true
    }
  },

  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "nuxt-lodash",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "@nuxt/image",
    '@vite-pwa/nuxt',
  ],

  css: ['~/assets/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: "2024-11-27",

  app: {
		pageTransition: {
			name: 'page',
			mode: 'out-in',
		},
		layoutTransition: {
			name: 'layout',
			mode: 'out-in',
		},
	},

  ui: {
    prefix: 'Nu',
  },

  colorMode: {
    classSuffix: '',
  },

  image: {
    quality: 100,
  },

  seo: {
    redirectToCanonicalSiteUrl: true,
    debug: process.env.NODE_ENV === 'development',
  },

  i18n: {
    experimental: {
      typedOptionsAndMessages: 'all',
      typedPages: true,
    },
    compilation: {
      strictMessage: false,
    },
    locales: [
      {
        code: 'en',
        language: 'en-GB',
        name: 'English',
        domain: '🇬🇧',
        file: 'en-GB.json',
        isCatchallLocale: true,
      },
      {
        code: 'it',
        language: 'it-IT',
        name: 'Italiano',
        file: 'it-IT.json',
        domain: '🇮🇹',
      },
      {
        code: 'es',
        language: 'es-ES',
        name: 'Español',
        file: 'es-ES.json',
        domain: '🇪🇸',
      },
      {
        code: 'fr',
        language: 'fr-FR',
        name: 'Français',
        file: 'fr-FR.json',
        domain: '🇫🇷',
      },
      {
        code: 'de',
        language: 'de-DE',
        name: 'Deutsch',
        file: 'de-DE.json',
        domain: '🇩🇪',
      },
    ],
    lazy: true,
    defaultLocale: 'en',
    langDir: './locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      redirectOn: 'root',
    },
  },

  vite: {
    logLevel: 'info',
  },

  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Ambo! - Gioco della tombola',
      short_name: 'Ambo!',
      description: 'Gioco della tombola digitale, per quando non hai voglia di portarti la scatola!',
      theme_color: '#5B06D6',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/board': { ssr: false },
    '/cards': { ssr: false },
    '/contacts': { prerender: true },
    '/terms': { prerender: true },
  }
})