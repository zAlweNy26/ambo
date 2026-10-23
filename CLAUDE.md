# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Ambo! is a digital Italian tombola: a host runs the 90-number board (tabellone) and players join from their phones with an 8-character game ID to play their cards (cartelle).

## Rules

- **Never use git worktrees** in this repository: no `EnterWorktree`, no `git worktree add`. This applies even in background or parallel sessions. Work directly in the main checkout, on the branch that is checked out.
- **Nuxt UI first.** When the UI needs something, use the matching Nuxt UI component (`UButton`, `UModal`, `USelect`, `UFormField`, `UInputNumber`…). If none exists, compose the piece from Nuxt UI components and theme them through `app/app.config.ts`. Hand-roll markup only for game-specific visuals: the tabellone, cartelle, number tokens and the draw token.
- **No lodash.** Use es-toolkit through `nuxt-es-toolkit` (see Architecture).

## Commands

Package manager is **bun**.

- `bun run dev`: dev server on http://localhost:3000. Games run in in-memory rooms here, not in the Durable Object. It answers 503 for every request until the build is ready, so wait for `Ready` before loading the page.
- `bun run lint` / `bun run lint:fix`: ESLint (`@antfu/eslint-config`).
- `bun run typecheck`: `nuxi typecheck`.
- `bun run test`: Vitest. Tests live in `test/` (for example `test/prize.test.ts`). Run a single file with `bunx vitest --run test/prize.test.ts`.
- `bun run ci`: lint, then typecheck, then test. Run lint and typecheck before committing.
- `bun run db:generate` / `bun run db:migrate`: Void (Drizzle) migrations for D1, output in `db/migrations`.
- `bunx pwa-assets-generator`: regenerates the favicon and PWA icons from `public/logo.svg` (`pwa-assets.config.ts`).
- `bun run deploy`: `void deploy`. CI deploys on push to `main` (`.github/workflows/deploy.yml`).

## Architecture

- **Nuxt 4 SPA** (`ssr: false`). App code is in `app/`. Nuxt UI v4 components use the default **`U` prefix** (`UButton`, `UModal`…). Tailwind v4 is configured in `app/assets/main.css`. Icons are Tabler (`i-tabler-*`).
- **Deploy target:** Cloudflare Workers through **Void** (`void.config.ts`, `voidPlugin()` in `nuxt.config.ts`). Bindings:
  - **Durable Objects:** each live game is a `GameRoom` (`ROOMS` binding, `server/room/durable.ts`), named by its game ID. It holds the draws, players, the cartelle it dealt, and claims. Clients talk to it over a WebSocket at `/room/<id>`. An alarm deletes everything after 24h.
  - **D1** (`db/schema.ts`, imported as `@schema`) stores game stats. The room upserts them at every draw (`server/room/stats.ts`).
  - Nuxt Content also uses the D1 binding (`content/terms_*.md`).
  - One Worker only. The custom entry `server/room/entry.ts`, set for the `cloudflare-module` build in `nuxt.config.ts`, exports `GameRoom` and routes `/room/<id>` to it before Nuxt. `void.config.ts` declares the binding and class migration, and deploys in `atomic` mode.
- **Game rules** live in `server/room/core.ts`. This module is pure, has no Cloudflare code, and is tested in `test/room.test.ts`. `dispatch` feeds every socket message through `handle`.
  - Production runs it in the Durable Object.
  - `bun run dev` can't run a Durable Object of the same Worker, so it uses in-memory rooms (`server/room/memory.ts`), wired by the dev-only plugin `server/plugins/room-dev.ts`. The plugin is needed because a lazy `llms.txt` middleware from `@nuxtjs/seo` hides route WebSocket hooks in h3 v1.
  - To test the real Durable Object locally, run `bun run build`, then `bun run preview`. Preview runs the built Worker in `wrangler dev` with Void's generated config.
- **Game flow:**
  1. `pages/board.vue` calls `POST /api/game/create`. It returns the 8-hex game ID and a secret host ID, kept in localStorage, so `/board?id=…` resumes after a reload. The board joins the room as host, sends `draw` (the room picks the number), and sends `close` when leaving through the app.
  2. Players use `pages/cards.vue`. They join with a per-device player ID and a number of cards. The room deals cartelle once, and allows a different number only before the first draw. The page keeps a copy, plus marks and claims, in localStorage.
  3. Claims are checked against the player's dealt cartella (`hasPrize`) with the shared rules in `shared/utils/claim.ts`. A prize closes once it or a bigger one was won on an earlier draw. Claims on the same draw tie, and the board splits the amount with `allocate()`.
  4. `/api/game/join` only checks that the game exists. The message types are in `shared/types/room.ts`. The client side is `app/composables/useRoom.ts`, which reconnects, sends heartbeats, and says hello again on every reconnect.
- **Smorfia:** the regional number meanings are static JSON in `app/assets/*.json` (`{ number, original, translated }`). The board optionally reads them aloud with `useSpeechSynthesis`.
- **Auto-imports:**
  - es-toolkit is auto-imported by `nuxt-es-toolkit` with an **`_` prefix** (`_Sample`, `_RandomInt`; `is*` functions keep their name). Keep that prefix: the module's default `use` prefix silently overrides Nuxt's `useHead` and VueUse's `useDebounce`, `useThrottle` and `useMemoize`.
  - `_RandomInt(min, max)` excludes `max`.
  - VueUse composables are auto-imported too.
- **Prize split:** `app/utils/prize.ts` (`splitPrize`) works in tenths of a euro and keeps the rounding of the old dinero.js v1 code. `test/prize.test.ts` pins those values, so don't change the split without updating the test on purpose.

## i18n

- There are 5 locales in `i18n/locales/` (en-GB default, it-IT, es-ES, fr-FR, de-DE), with `strategy: 'no_prefix'` and the choice stored in the `i18n_redirected` cookie.
- Every user-facing string must be added to **all 5 files**, and the key sets must stay identical.
- Italian game terms stay Italian in every language: ambo, terna, quaterna, cinquina, tombola, smorfia, and Tabellone in German.
- The other game nouns are translated as cartón / carton / Karte and tablero / tableau. Never translate them as "folder" or "scoreboard".
- `game.title` uses no-break spaces on purpose, so the remaining-numbers count wraps together.

## Design

- `PRODUCT.md` (product facts, users, constraints) and `DESIGN.md` plus `.impeccable/design.json` (tokens and rules) are the source of truth for UI work. The direction contract lives in `.impeccable/surfaces/`.
- The look is minimal and contemporary, with tombola cues taken from the game's own objects:
  - **Tombola red** `#c41e2a` (Nuxt UI `primary` = custom `tombola` palette) for the header bar, primary buttons and the red print of cartelle and tabellone.
  - **Flat beech tokens** (`.legno`, `.numero[data-state]`) mark drawn or marked numbers.
  - **Figtree** is the only font, with tabular numerals.
  - Grounds are `#f6f6f4` in light mode and soft charcoal `#1c1c1a` in dark mode.
- Shared visual primitives (`.panel`, `.print`, `.blank`, `.legno`, `.numero`) are defined in `app/assets/main.css`, so reuse them rather than restyling.
- Avoid ornamental or retro styling (folk borders, display faces, faked textures); the user rejected that direction.
- Both light and dark themes are required.
