---
name: Ambo!
description: Tombola board and cartelle painted like a Sicilian carretto.
colors:
  ink: "#1a1209"
  giallo: "#ffd04a"
  arancio: "#ff8904"
  rosso: "#d7262e"
  verde: "#0f7a45"
  blu: "#1f4fa3"
  carta: "#ffffff"
  lacca: "#15100b"
  giallo-pale: "#fff1c7"
  giallo-wash: "#ffe08a"
  umber-toned: "#3d2f20"
  umber-muted: "#594734"
  umber-dimmed: "#6b5a45"
  umber-rule: "#8a7458"
  lacca-raised: "#241b12"
  lacca-muted: "#2e2318"
  lacca-accented: "#3a2d1f"
  bone: "#f7ecda"
  bone-bright: "#fff8ec"
  bone-muted: "#c2b29a"
  bone-dimmed: "#a8977f"
  bone-rule: "#7d6c55"
typography:
  display:
    fontFamily: "Sancreek, serif"
    fontSize: "clamp(3rem, 7vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.25
  headline:
    fontFamily: "Sancreek, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.2
  numeral-hub:
    fontFamily: "Alfa Slab One, serif"
    fontSize: "4.5rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum"
  numeral:
    fontFamily: "Alfa Slab One, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum"
  body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  control: "6px"
  field: "6.4px"
  panel: "12px"
  disc: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.arancio}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
  button-primary-hover:
    backgroundColor: "#ff6900"
    textColor: "{colors.ink}"
  button-neutral:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.carta}"
    rounded: "{rounded.control}"
  cart-panel:
    backgroundColor: "{colors.rosso}"
    rounded: "{rounded.panel}"
    padding: "12px 8px"
  cart-field:
    backgroundColor: "{colors.carta}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
  numero-on:
    backgroundColor: "{colors.arancio}"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.disc}"
  input:
    backgroundColor: "{colors.carta}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  header-rail:
    backgroundColor: "{colors.arancio}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
---

# Design System: Ambo!

## Overview

**Creative North Star: "The Painted Cart"**

Ambo! is painted like a Sicilian carretto. Every tabellone block and every cartella is a framed cart panel: a flat frame of saturated paint, a black keyline, a dente di lupo zigzag frieze along the top and bottom edge, a folk rosette at each corner, and a white field where the numbers sit. The page itself is the cart body, painted chrome yellow by day and black lacquer by night; the header is an orange rail closed by a four-ink frieze.

The paint is flat. No gradients anywhere: colour changes happen at keylines, the way a cart painter separates fields. The density is that of a board game at a family table: big numerals readable from across the room, generous controls, few words. Decoration lives in the frames and friezes, never inside the number field, so the ornament never competes with the draw.

The build landed slightly differently from the direction: the contract had orange owning the shell, but the shipped shell is chrome yellow (`giallo`) with orange reserved for the header rail, the primary action and the drawn-number disc. The build is the system.

**Key Characteristics:**
- Flat saturated inks separated by black keylines (3px on panels, discs and the primary button; 2px on form controls).
- Framed cart panels with frieze and corner rosettes as the single container grammar.
- Three typefaces with strict jobs: Sancreek lettering, Alfa Slab One numerals, Figtree UI.
- Orange disc means drawn or marked; a blue ring (yellow at night) means latest.
- Same inks in both themes; only the ground and the text tones change.

## Colors

Six carretto inks on a yellow cart body, with warm umber tones for text and a black lacquer night ground.

### Primary
- **Carretto Orange** (`arancio`): the Nuxt UI primary (orange-400). The header rail, the primary button, the drawn/marked number disc, text selection, and the signwriter's shade under display lettering. Always carries ink text: white on orange fails contrast.

### Secondary
- **Chrome Yellow** (`giallo`): the light-theme page ground (`--ui-bg`), the prize table panel, hover fill on playable cartella cells, the rosette disc, and the latest-number ring at night.

### Tertiary
- **Vermilion** (`rosso`), **Emerald** (`verde`), **Cobalt** (`blu`): panel frames and filler blocks, cycled in order across panels. Vermilion also paints the error footer and error code; cobalt is the latest-number ring and focus outline by day; emerald and vermilion carry found/not-found status text.

### Neutral
- **Cart Ink** (`ink`): every keyline, all text on paint, the dark footer, the neutral button.
- **Paper White** (`carta`): number fields, elevated surfaces, the wheel hub.
- **Pale Yellow / Yellow Wash** (`giallo-pale`, `giallo-wash`): muted and accented backgrounds in the light theme.
- **Umber tones** (`umber-toned`, `umber-muted`, `umber-dimmed`): secondary text in the light theme; `umber-rule` for muted borders.
- **Black Lacquer** (`lacca`): the night ground; `lacca-raised` is the night field and elevated surface, `lacca-muted` and `lacca-accented` the muted/accented backgrounds.
- **Bone** (`bone`, `bone-bright`, `bone-muted`, `bone-dimmed`): night text and borders; `bone-rule` for muted night borders.

### Named Rules
**The Flat Paint Rule.** No gradients, on any surface, in either theme. Colour changes only at a keyline.

**The Ink On Paint Rule.** Text on orange, yellow and white is always Cart Ink. Paper White text appears only on ink or vermilion grounds.

**The Same Inks Rule.** Night mode swaps the ground to black lacquer and the text to bone; the six inks keep their exact values.

## Typography

**Display Font:** Sancreek (with serif)
**Numeral Font:** Alfa Slab One (with serif)
**Body Font:** Figtree (with sans-serif)

**Character:** Sancreek is the cart's tuscan signwriting, loud and ornamental; Alfa Slab One gives the numbers the weight of painted slab figures; Figtree stays quiet so the other two can shout.

### Hierarchy
- **Display** (Sancreek 400, 3rem rising to 4.5rem at sm, leading-tight): the home welcome and info page titles, painted with the signwriter's shade.
- **Headline** (Sancreek 400, 1.5rem to 1.875rem): game header titles, modal titles (1.5rem), the smorfia line under the wheel.
- **Numeral, hub** (Alfa Slab One 400, 3.75rem to 4.5rem, line-height 1, tabular): the latest number in the wheel hub; the error code at 6rem.
- **Numeral** (Alfa Slab One 400, 1.125rem to 1.5rem, tabular): tabellone and cartella cells, the game ID, the "n / 90" tally, prize amounts.
- **Body** (Figtree 400/500, 0.875rem to 1.125rem): descriptions and help text, capped at `max-w-prose`.
- **Label** (Figtree 600): button labels, field labels, prize names, footer navigation.

### Named Rules
**The Three Hands Rule.** Sancreek only for lettering (wordmark, titles, smorfia), Alfa Slab One only for numbers, Figtree for everything else. Never set a number in Sancreek or a sentence in Alfa Slab One.

**The Tabular Rule.** Every numeral that changes (cells, tally, remaining count, prizes) uses tabular figures so the board never jitters.

## Layout

Single column on phones, opening to a board grid on large screens: board page is `18rem | 1fr` at lg and `17rem | 1fr | 17rem` at xl (wheel and draw on the left, six tabellone panels in a 2-column grid in the middle, settings panel on the right). Containers cap at 48rem (home), 72rem (cards, footer) and 80rem (board). Rhythm is on a 4px base: 4px between cells, 16px between panels and controls, 24px between cartelle and major blocks. Primary actions are block-width and tall (16px vertical padding, 1.25rem label) because they are pressed at a table, often on a phone.

## Elevation & Depth

Mostly flat, with one soft cast shadow that lifts painted objects off the cart body. Panels and the wheel are the only lifted things; fields, controls and cells sit flat inside them and are separated by keylines, not shadows.

### Shadow Vocabulary
- **Panel cast** (`box-shadow: 0 6px 14px -6px rgb(26 18 9 / 0.45)`): under every cart panel.
- **Wheel cast** (`filter: drop-shadow(0 8px 10px rgb(26 18 9 / 0.35))`): under the carretto wheel.
- **Signwriter's shade** (`text-shadow: 0.05em 0.05em 0 var(--color-arancio)`): a flat second ink painted under display lettering, the cart painter's shading, not a depth effect.

### Named Rules
**The Keyline Not Shadow Rule.** Inside a panel, separation is a black keyline. Shadows belong only to whole painted objects (panels, the wheel).

## Shapes

Softly rounded painted boards (12px) holding slightly rounded fields (about 6px), with circles reserved for number discs, the wheel and the hub. Controls share Nuxt UI's 6px radius. Every shape carries a black keyline: 3px on panels, fields, discs, the hub and the primary button; 2px on inputs, selects, switches, the prize table and cartella cell dividers. In dark mode keylines on panels become pure black, and control rings switch to the bone border.

## Components

### Buttons
- **Shape:** gently rounded (6px), 3px ink keyline on primary (black in dark mode).
- **Primary:** Carretto Orange with Cart Ink label, semibold. Hover deepens to orange-500; disabled drops to orange-200.
- **Neutral:** Cart Ink solid with paper text (light), bone solid at night; used for the second home action.
- **Ghost neutral:** icon-only header actions (fullscreen, exit, theme, language).
- **Focus:** 3px cobalt outline, 2px offset (chrome yellow at night), shared by every focusable element.

### Cart Panel (signature container)
- **Frame:** a flat paint frame (vermilion, emerald, cobalt or orange), cycled vermilion, emerald, cobalt across repeated panels.
- **Ornament:** dente di lupo frieze (ink band with yellow and white teeth) along top and bottom inner edges; a yellow, cobalt, vermilion and orange rosette in each corner (1.5rem).
- **Border:** 3px keyline, 12px radius, panel cast shadow, 12px by 8px padding.
- **Field:** the child field is Paper White (lacca-raised at night) with its own 3px keyline and 6px radius; all content sits there.

### Numero (number cell)
- **Waiting:** plain numeral on the field.
- **Drawn / marked:** an orange disc with a 3px ink keyline scales in behind the numeral (0.45s, `cubic-bezier(0.16, 1, 0.3, 1)`); instant under reduced motion.
- **Latest:** the orange disc plus a 3px cobalt ring (chrome yellow at night).
- **Cartella cells:** 9-column grid with 2px ink dividers; empty slots are solid ink blocks (vermilion, yellow, emerald, cobalt); playable cells fill chrome yellow on hover.

### Inputs / Fields
- **Style:** elevated background (paper by day, lacca-raised at night) with a 2px inset ink ring (bone at night), 6px radius.
- **Switch:** 2px ink border on the track.
- **Modal:** 3px ink border instead of a ring; Sancreek title at 1.5rem.

### Navigation
- **Header:** orange rail, ink wordmark in Sancreek 1.875rem beside the logo in a 2px ink ring, ghost theme switch at the end, closed by the four-ink frieze (vermilion, yellow, emerald, cobalt teeth on ink, 12px tall).
- **Footer:** ink band (vermilion on error pages) opened by the same frieze; semibold Figtree links, orange on hover with underline.

### Carretto Wheel (signature move)
A painted cart wheel: ink tyre, orange felloe with 24 yellow studs, 16 spokes cycling vermilion, yellow, emerald and cobalt, ink hub ring, and a paper hub with a 3px keyline holding the latest number in hub numerals. Each draw spins it 720 to 1080 degrees over 1.2s (`cubic-bezier(0.16, 1, 0.3, 1)`); the new number scales into the hub after 0.8s. Reduced motion removes both transitions.

## Do's and Don'ts

### Do:
- **Do** put every board, cartella and settings group inside a cart panel with a white field; cycle frames vermilion, emerald, cobalt.
- **Do** separate colour fields with ink keylines: 3px for panels, discs and primary buttons, 2px for form controls and cell dividers.
- **Do** set ink text on orange, yellow and white, including the primary button.
- **Do** mark drawn numbers with the orange disc and the latest with the cobalt ring (yellow at night), on both board and cartelle.
- **Do** honour `prefers-reduced-motion` on every spin, disc and hub transition.

### Don't:
- **Don't** use gradients on any surface, in either theme.
- **Don't** put white text on orange or yellow.
- **Don't** set numbers in Sancreek or running text in Alfa Slab One.
- **Don't** add shadows inside a panel; depth belongs to whole panels and the wheel.
- **Don't** change ink values for dark mode; only the ground and text tones switch.
