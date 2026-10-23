import { defineConfig } from 'void/config'

export default defineConfig({
  cloudflare: {
    name: 'ambo',
    compatibility_date: '2025-12-10',
    compatibility_flags: ['nodejs_compat'],
    preview_urls: false,
    workers_dev: false,
    observability: {
      enabled: true,
    },
    d1_databases: [
      {
        binding: 'DB',
        database_name: 'ambo',
        database_id: '92e21866-4939-4381-84fd-38cbf5ac8d74',
        migrations_dir: 'db/migrations',
      },
    ],
    kv_namespaces: [
      {
        binding: 'KV',
        id: 'f9a6ed58f7bd408d95f29c705e5f2d31',
      },
    ],
    vars: {
      NUXT_PUBLIC_I18N_BASE_URL: 'https://ambo.danyalwe.me',
    },
  },
})
