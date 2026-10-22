---
name: Ambo!
description: A calm, contemporary tombola where the cartella and the wooden numeretto are the only theme.
colors:
  tombola-red: "#c41e2a"
  tombola-red-deep: "#a31621"
  tombola-red-ink: "#84151e"
  tombola-red-soft: "#e4676d"
  beech: "#d6ad78"
  beech-edge: "#a97a45"
  ground-light: "#f6f6f4"
  panel-light: "#ffffff"
  muted-light: "#ededea"
  hairline-light: "#e4e4e0"
  hairline-accented-light: "#d2d2cd"
  ground-dark: "#0f0f0e"
  panel-dark: "#191917"
  muted-dark: "#232321"
  hairline-dark: "#2a2a27"
  text-light: "#292524"
  text-muted-light: "#57534e"
  text-highlighted-light: "#0c0a09"
  text-dark: "#e7e5e4"
  text-muted-dark: "#a8a29e"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.4
  numeral:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
  numeral-token:
    fontFamily: "Geist, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontFeature: "tnum"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
rounded:
  control: "8px"
  panel: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.tombola-red}"
    textColor: "{colors.panel-light}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  button-primary-hover:
    backgroundColor: "{colors.tombola-red-deep}"
  button-neutral-outline:
    backgroundColor: "{colors.panel-light}"
    textColor: "{colors.text-light}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  panel:
    backgroundColor: "{colors.panel-light}"
    rounded: "{rounded.panel}"
    padding: "16px"
  header-bar:
    backgroundColor: "{colors.tombola-red}"
    textColor: "{colors.panel-light}"
    padding: "12px 16px"
  numero-waiting:
    textColor: "{colors.tombola-red-deep}"
    typography: "{typography.numeral}"
  numero-on:
    backgroundColor: "{colors.beech}"
    textColor: "{colors.tombola-red-ink}"
    rounded: "{rounded.full}"
    typography: "{typography.numeral}"
  draw-token:
    backgroundColor: "{colors.beech}"
    textColor: "{colors.tombola-red-ink}"
    rounded: "{rounded.full}"
    typography: "{typography.numeral-token}"
    width: "224px"
---

# Design System: Ambo!

## Overview

**Creative North Star: "The Printed Cartella"**

Ambo! is quiet contemporary product UI wrapped around two objects taken straight from the family tombola: the paper cartella printed in red, and the round beech numeretto pulled from the bag. Those two objects are the entire theme. Everything else (header, forms, prize split, footer) is plain, neutral and hairline-thin so the numbers can be read from across a room.

The palette is a single brand red on warm neutral grey, plus one material: flat beech wood. Red is ink (numerals, grid lines, the hatch of empty cells, the header bar, primary actions); beech is the token that lands on a drawn or marked number. There is no faked grain, no folk ornament and no texture beyond the faint diagonal hatch of a blank cell. Density is calm: generous gaps, one panel per job, Geist throughout with semibold tabular numerals.

The world explicitly rejects the folk-costume tombola (the earlier carretto direction, turned down as dated) and the generic neon bingo app.

**Key Characteristics:**
- One brand red (#c41e2a family) used as print, never as fill for large surfaces beyond the slim header bar and card headers.
- Drawn and marked numbers become flat beech tokens with a darker beech edge and a soft cast shadow, carrying a deep red numeral.
- Neutral warm-grey ground with white or near-black panels, 1px hairlines and 16px corners.
- Geist only; numerals are semibold and tabular everywhere.
- Light and dark themes share the same structure; dark lifts the print to a softer red.

## Colors

Restrained: one red ink, one wood, and warm stone neutrals.

### Primary
- **Tombola Red** (`tombola-red`): the brand. Header bar, primary buttons, progress fill, the remaining-count numeral, card header strips, selection highlight, PWA theme and icon background. Part of the `tombola-50..950` ramp registered as Nuxt UI `primary`.
- **Deep Print Red** (`tombola-red-deep`): the printed ink of cartelle and tabellone in light mode (numerals waiting to be drawn) and the primary button hover.
- **Token Ink** (`tombola-red-ink`): the numeral on every beech token, in both themes, so contrast is held against wood rather than against the ground.
- **Soft Print Red** (`tombola-red-soft`): the print colour in dark mode, and the source of the dark hatch and grid line tints.

### Secondary
- **Beech** (`beech`): the face of a drawn or marked numero and of the large draw token. A material, not an accent; it appears only where a number has been drawn or marked.
- **Beech Edge** (`beech-edge`): the darker rim of every token (1.5px on grid tokens, 2px on the draw token).

### Neutral
- **Light Ground** (`ground-light`) / **Dark Ground** (`ground-dark`): page background.
- **Panel White** (`panel-light`) / **Panel Night** (`panel-dark`): elevated panels, the draw-token dish.
- **Muted** (`muted-light` / `muted-dark`): progress track, subtle fills.
- **Hairline** (`hairline-light` / `hairline-dark`, accented `hairline-accented-light`): panel borders and dividers.
- **Stone text**: Nuxt UI `neutral` is `stone`; body text `text-light` / `text-dark`, muted `text-muted-light` / `text-muted-dark`, highlighted `text-highlighted-light` (pure white in dark).
- **Print line and hatch**: red at low alpha (light: 28% line, 10% hatch of #c41e2a; dark: 30% / 10% of #e4676d). Grid panels swap their neutral hairline for the print line.

### Named Rules
**The Ink, Not Paint Rule.** Red is printed: numerals, grid lines, hatch, a slim bar. It never floods a panel or a page section.

**The Wood Means Drawn Rule.** Beech appears only on a number that has been drawn or marked. A wooden surface anywhere else breaks the game's own signal.

## Typography

**Display Font:** Geist (with sans-serif)
**Body Font:** Geist (with sans-serif)

**Character:** A single contemporary grotesque; hierarchy comes from weight and size, never from a second face. Numbers are the hero, so every numeral is semibold with tabular figures.

### Hierarchy
- **Display** (600, 3.75rem desktop / 2.25rem mobile, tight tracking): the home headline and the error status code (larger, 6rem, in red).
- **Headline** (600, 2.25rem, tight tracking): info-page titles (contacts, terms headings).
- **Title** (500, 1.125-1.25rem): game header ("Tabellone - 81 numeri rimanenti") with the count in semibold red; smorfia line (600, 1.125rem).
- **Numeral** (600, 1.125-1.25rem, tabular, line-height 1): tabellone and cartella cells.
- **Numeral Token** (600, 3.75rem mobile / 4.5rem desktop, tabular, tight): the large draw token.
- **Body** (400, 1rem; 1.125rem muted for the home lede, max-width prose).
- **Label** (400, 0.875rem, muted): field labels, game-ID label, captions, footer. Card header strips use 0.75rem.

### Named Rules
**The Tabular Numeral Rule.** Every number (cells, tokens, counts, game ID, prize amounts) is set with tabular figures so columns and counts never jitter.

**The One Face Rule.** Geist only. Emphasis is weight (500/600) and the red, not a display face or letterspaced caps.

## Layout

Centred content inside a 80rem (max-w-7xl) container with 16px gutters (12px vertical on mobile). Pages stack panels with 20px gaps (board) or 24px (cards); home is a single centred column capped at 42rem, with controls at 28rem.

The board is a three-column grid at xl (16rem draw column, fluid tabellone, 17rem settings), two columns at lg (settings drop under the draw column), one column below. The tabellone is one panel split into six 5x3 blocks by print-line hairlines (2 columns from sm). Cartelle are 9-column grids, one per row, two per row at lg, each capped at 36rem. Spacing rhythm is Tailwind's 4px base, used mostly at 12 / 16 / 20px.

## Elevation & Depth

Flat by default. Panels are separated from the ground by tone and a 1px hairline, not shadow. Shadow exists only to say "this is a physical object": the beech tokens and the dish that holds the draw token.

### Shadow Vocabulary
- **Token cast** (`box-shadow: 0 6px 16px -6px rgb(60 35 10 / 0.45)`): the large beech draw token.
- **Grid token cast** (`box-shadow: 0 2px 4px -1px rgb(60 35 10 / 0.35)`): drawn/marked numbers in grids.
- **Dish** (`box-shadow: 0 12px 32px -16px rgb(28 25 23 / 0.35)`): the round panel under the draw token.
- **Latest ring** (`box-shadow: 0 0 0 2px <panel>, 0 0 0 4px <tombola-red>`): the most recent draw on the tabellone; the ring uses the soft red in dark mode.

### Named Rules
**The Only Objects Cast Rule.** Only wooden tokens and their dish carry shadows. UI panels, buttons and inputs stay flat.

## Shapes

Gently rounded UI (8px controls via Nuxt UI `--ui-radius`), softly rounded panels (16px), and perfect circles for every token and the draw dish. Cartella and tabellone grids are clipped inside their panel so cell hairlines meet the rounded edge cleanly. The logo tile uses a 22% squircle-ish radius with a thin white ring on the red header.

## Components

### Buttons
- **Shape:** gently rounded (8px).
- **Primary:** tombola red with white label, medium weight; xl size for main actions (Estrai, Tabellone), often full width with a leading Tabler icon.
- **Hover / Focus:** darkens to deep red; focus is a 2px red outline offset 2px (global).
- **Neutral outline / subtle / ghost:** neutral outline for the secondary home action; ghost neutral icon buttons for fullscreen and exit; on the red header, ghost buttons are white with a 15% white hover.

### Cards / Containers (Panel)
- **Corner Style:** 16px.
- **Background:** panel white / panel night.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px hairline; grid panels use the red print line instead.
- **Internal Padding:** 16px for settings panels, 12-20px for the game-ID strip; grids are edge to edge.

### Inputs / Fields
- **Style:** Nuxt UI defaults on the neutral tokens (8px radius, hairline ring); game ID input uses wide tracking and tabular figures.
- **Focus:** red ring from the primary colour.

### Navigation
- **Header:** a slim tombola-red bar, logo plus "Ambo!" in semibold white, theme switch on the right.
- **Footer:** hairline top border, small muted links that turn highlighted on hover, a red heart icon.
- **Game header:** fullscreen icon, centred title with red remaining count, exit icon opening a confirm modal.

### Numero (signature)
One cell component shared by tabellone, cartelle, the home sample and the last-draws row. Waiting: red print numeral on the panel. On (drawn/marked): a beech disc scales in behind the numeral (0.4s, cubic-bezier(0.16, 1, 0.3, 1)) and the numeral turns token ink. Latest: the same disc plus a red ring. Empty cartella cells carry the faint 135deg red hatch (1px line every 7px). Marked cells hover with a 5% red wash.

### Draw Token (signature)
A 224px max circle: neutral dish with hairline and soft shadow, a beech token inset 11% carrying the number at display numeral size. A new draw rolls in: from 24% above, a quarter turn back and 60% scale, settling over 0.55s on cubic-bezier(0.16, 1, 0.3, 1); the old one shrinks out in 0.2s. Reduced motion becomes a 0.15s fade.

### Cartella header strip
Each cartella has a red strip with the card index and the marked count (n/15) in small white tabular text.

## Do's and Don'ts

### Do:
- **Do** use red only as print and as small solid accents (header bar, primary button, progress, card strip).
- **Do** show every drawn or marked number as a beech token with the darker beech edge and a token-ink numeral.
- **Do** set every numeral in Geist semibold with tabular figures.
- **Do** separate surfaces with 1px hairlines and 16px panel corners; switch to the red print line for grids.
- **Do** honour reduced motion: tokens fade instead of rolling or scaling.

### Don't:
- **Don't** add folk ornament, carretto motifs, painted borders or faked wood grain; the beech is flat colour.
- **Don't** put shadows on panels, buttons or inputs; shadow is reserved for wooden objects.
- **Don't** use beech for anything other than a drawn or marked number (the logo is the one approved exception).
- **Don't** introduce a second typeface or letterspaced uppercase labels.
