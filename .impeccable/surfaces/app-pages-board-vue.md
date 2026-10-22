---
version: 1
slug: "app-pages-board-vue"
primary_target: "app/pages/board.vue"
related_targets: ["app/pages/index.vue","app/pages/cards.vue","app/layouts/default.vue"]
---

## Scope

Whole app (home, board, cards, info, error). Mode: Operate (host runs the board on a laptop/TV at a family table; players use phones).

## Direction contract

THESIS: A calm, contemporary tombola app: the game's own objects (the 3x9 cartella grid, the round number token) are the only theme; everything else is quiet product UI. Refuses both the folk-ornament costume (carretto round, rejected by the user as dated) and a generic bingo app.

OWN-WORLD: Neutral warm-grey ground (#f6f6f4 light, #0f0f0e dark), white or near-black elevated panels with 1px hairlines and 16px radius, tombola red #c41e2a as the brand: red header bar, primary buttons, progress, and the red print of cartelle and tabellone (numerals and grid lines); drawn/marked numbers are turned beech-wood tokens with red numerals. Geist for everything, semibold tabular numerals. Empty cartella cells carry a faint red diagonal hatch.

STORY: The host reads the drawn number and its smorfia line from across the room, sees progress and prize split; players mark their cartelle and see the last five draws.

FIRST VIEWPORT: Board: slim header; game-ID strip with copy/share and a thin 9/90 progress bar; left the large wooden draw token, smorfia line, Estrai button; centre the tabellone as one panel split into six blocks by hairlines; right the smorfia select, announcer switch and prize split. Signature: the drawn token rolls in (quarter turn, settle); reduced motion fades.

FORM: user-steered after rejection of the pinned carretto direction ("tombola feel, but not that much… minimalistic, something actual"); seed: d08dc0a2ad92fb9a

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
