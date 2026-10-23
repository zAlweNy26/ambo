import { defineConfig } from 'void/config'

export default defineConfig({
  // A Worker with a Durable Object can't be staged; traffic moves to the new version at once
  deploy: {
    cloudflare: {
      mode: 'atomic',
    },
  },
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
    // One GameRoom Durable Object per live game (server/room/durable.ts)
    durable_objects: {
      bindings: [
        {
          name: 'ROOMS',
          class_name: 'GameRoom',
        },
      ],
    },
    migrations: [
      {
        tag: 'v1',
        new_sqlite_classes: ['GameRoom'],
      },
    ],
    vars: {
      NUXT_PUBLIC_I18N_BASE_URL: 'https://ambo.danyalwe.me',
    },
  },
})
