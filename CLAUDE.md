# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Ambo! is a digital Italian tombola: a host runs the 90-number board (tabellone) and players join from their phones with an 8-character game ID to play their cards (cartelle).

## Commands

Package manager is **bun**.

- `bun run dev`: dev server on http://localhost:3000. It answers 503 for every request until the build is ready, so wait for `Ready` before loading the page.
- `bun run lint` / `bun run lint:fix`: ESLint (`@antfu/eslint-config`).
- `bun run typecheck`: `nuxi typecheck`.
- `bun run test`: Vitest (`--passWithNoTests`). There are no tests yet. Run a single file with `bunx vitest --run path/to/file.test.ts`.
- `bun run ci`: lint, then typecheck, then test. Run lint and typecheck before committing.
- `bun run db:generate` / `bun run db:migrate`: Void (Drizzle) migrations for D1, output in `db/migrations`.
- `bunx pwa-assets-generator`: regenerates the favicon and PWA icons from `public/logo.svg` (`pwa-assets.config.ts`).
- `bun run deploy`: `void deploy`. CI deploys on push to `main` (`.github/workflows/deploy.yml`).

## Architecture

- **Nuxt 4 SPA** (`ssr: false`). App code is in `app/`. Nuxt UI v4 components use the **`Nu` prefix** (`NuButton`, `NuModal`…). Tailwind v4 is configured in `app/assets/main.css`. Icons are Tabler (`i-tabler-*`).
- **Deploy target:** Cloudflare Workers through **Void** (`void.config.ts`, `voidPlugin()` in `nuxt.config.ts`). Bindings:
  - **KV** holds live games as `game:<id>` with a 24h TTL (`server/utils/game.ts`: `getGame` / `setGame`).
  - **D1** (`db/schema.ts`, imported as `@schema`) only stores finished-game stats, written by `POST /api/game/close`.
  - Nuxt Content also uses the D1 binding (`content/terms_*.md`).
- **Game flow:**
  1. `pages/board.vue` calls `POST /api/game/create`. The game ID is the first 8 hex characters of a UUID.
  2. The board draws numbers client-side from the fixed six-block tabellone layout and posts each one to `/api/game/extract`.
  3. Players use `pages/cards.vue`. Their cartelle are generated client-side, and they subscribe to `GET /game?id=…` (`server/routes/game.ts`). That route is an SSE stream that polls KV every second and pushes the full extractions array.
  4. `/api/game/join` only checks that the game exists.
- **Smorfia:** the regional number meanings are static JSON in `app/assets/*.json` (`{ number, original, translated }`). The board optionally reads them aloud with `useSpeechSynthesis`.
- **Auto-imports:** lodash-es is auto-imported with an **`_` prefix** by the local module `modules/lodash` (`_Sample`, `_Random`; `is*` functions keep their name). VueUse composables are auto-imported too.

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
