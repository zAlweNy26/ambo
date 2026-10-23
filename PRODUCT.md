# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (installable PWA, mobile-first for players, laptop/TV for the host)

## Purpose

Ambo! is a digital Italian tombola: play the traditional holiday game without carrying the box, the cartelle and the beans.

## Users and scene

The primary scene is a family table during the holidays. One host runs the **board** (tabellone) on a laptop or TV that everyone can see; the other players join from their phones with the game ID and play their **cards** (cartelle). Players range from kids to grandparents, so legibility at a distance and on small screens matters.

## Capabilities

- Host creates a game, gets an 8-character game ID, shares or copies it (link `?id=`).
- Host draws numbers 1–90; drawn numbers mark on the tabellone (six 15-number blocks).
- Host sets a total prize; the app splits it across ambo, terna, quaterna, cinquina, tombola.
- Host picks a regional smorfia (Napoletana, Trapanese, Romana, Piemontese, Livornese); each drawn number shows its smorfia meaning, optionally read aloud by speech synthesis.
- Host shows a QR code of the join link; the board resumes its game after a reload or crash.
- Players join with the game ID choosing 1–6 cartelle (3×9 grid, 15 numbers each), receive draws live (WebSocket), see the last 5 draws, tap to mark numbers (or turn on auto-mark), and search a number across their cards. Cartelle are dealt by the server, so they survive a reload; marks are kept on the phone.
- Players claim ambo…tombola from a cartella; the server verifies the claim against the player's dealt cartella and the draws, the board announces the winner and shows names next to each prize, and same-draw claims split the prize amount.
- Wake lock and fullscreen during games; exit confirmation.
- Terms and contacts pages; 404/error page.

## Terminology

Tombola, tabellone (board), cartella/cartelle (cards), ambo, terna, quaterna, cinquina, tombola (winning combinations), smorfia (number-meaning tradition), estrazione (draw).

## Constraints

- UI in 5 languages (en, it, es, fr, de) via i18n; Italian game terms stay Italian.
- Built with Nuxt 4 + Nuxt UI v4 (component prefix `Nu`), Tailwind v4, Tabler icons.
- Light and dark themes both supported (brand commitment).

## Brand commitments

- Tombola red is the brand color (PWA theme color `#c41e2a`), with beech-wood tokens as markers; the user moved it from orange (2026-10-22). The logo asset is still orange.
- Style: minimal and contemporary, with tombola cues carried by red print and wooden tokens; heavy folk ornament was rejected.
- Keep the light/dark toggle.
- A donation link (PayPal) exists today; placement may change.
