// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'
import { voidPlugin } from 'void'

export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false,

  modules: [
    '@formkit/auto-animate/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/content',
    // `_` prefix keeps es-toolkit out of the use* namespace (its default `use` overrides useHead, useDebounce, useThrottle…)
    [
      'nuxt-es-toolkit',
      { prefix: '_' },
    ],
  ],

  css: ['~/assets/main.css'],

  // Lets nuxi typecheck resolve @schema (Void's Vite alias doesn't reach the typechecker)
  alias: {
    '@schema': resolve(import.meta.dirname, 'db/schema.ts'),
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-12-10',

  nitro: {
    preset: 'cloudflare_module',
    // WebSockets for the in-memory game rooms of `bun run dev` (server/routes/room/[id].ts); production uses Durable Objects
    experimental: {
      websocket: true,
    },
    modules: [
      'void/nitro',
      // The Worker entry exports the GameRoom Durable Object and routes /room/<id> to it. Only for the Worker build:
      // Nuxt's prerender runs a Node build with the same options.
      (nitro) => {
        if (nitro.options.preset === 'cloudflare-module')
          nitro.options.entry = resolve(import.meta.dirname, 'server/room/entry.ts')
      },
    ],
    cloudflare: {
      dev: {
        configPath: './.void-wrangler.jsonc',
      },
    },
  },

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

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    experimental: {
      sqliteConnector: 'native',
    },
    renderer: {
      anchorLinks: false,
    },
  },

  colorMode: {
    classSuffix: '',
  },

  image: {
    quality: 100,
  },

  icon: {
    serverBundle: 'local',
  },

  site: {
    url: 'https://ambo.danyalwe.me',
    name: 'Ambo!',
  },

  seo: {
    redirectToCanonicalSiteUrl: true,
    debug: process.env.NODE_ENV === 'development',
  },

  i18n: {
    baseUrl: '',
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
    plugins: [
      voidPlugin(),
    ],
  },

  ogImage: {
    enabled: false,
  },

  // llms.txt and markdown for AI agents need mdream's WebAssembly build, which Void's Cloudflare deploy can't re-bundle
  aiReady: {
    enabled: false,
  },

  pwa: {
    strategies: 'generateSW',
    // prompt, not autoUpdate: an update must never reload a board or cards page mid-game
    registerType: 'prompt',
    manifest: {
      name: 'Ambo! - Gioco della tombola',
      short_name: 'Ambo!',
      description: 'Gioco della tombola digitale, per quando non hai voglia di portarti la scatola!',
      theme_color: '#c41e2a',
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
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      // shortcut: one-off move off the old autoUpdate worker (its pages never show the update prompt, so they'd stay
      // stuck); open pages reload once. Remove both lines once everyone has had a week to pick it up.
      skipWaiting: true,
      clientsClaim: true,
    },
    client: {
      installPrompt: true,
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
    '/contacts': { prerender: true },
    '/terms': { prerender: true },
  },
})
