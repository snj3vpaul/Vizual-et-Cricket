# MoreThanCricket — Design System v1.0

> **Design lock:** Broadcast Studio × Performance Lab. Chosen during Phase 0 on 2026-11-08. Do not silently change direction. Read this file, `PRODUCT.md`, and `AGENTS.md` before feature work. This file follows the nine-section awesome-design-md convention.

## 1. Visual Theme & Atmosphere

**Personality:** Premium cricket broadcast meets a credible sports-science notebook. Dark-mode-first and data-forward; energetic headlines and bright but limited cues, calm chart surfaces, editorial explanations. Always make the player the hero and the metric an argument supported by evidence.

**Emotional journey:** Landing = possibility and confidence. Loading = honest, specific progress, not invented statistics. Dossier = one dominant trend, then guided exploration. Share = proud but accurately labeled. No manufactured tension or fake prestige.

**Inspiration boundaries:** Borrow from Fantasy Premier League the *patterns* of instantly scannable identity, ranking, numbers and comparisons. Borrow from Strava the feeling of progress. Borrow from The Athletic legible explanations. Do not reproduce trade dress, logos, artwork, or layout one-to-one.

**Signature motif:** SVG cricket-pitch crease and segmented rolling-performance curves; use small tick marks, time scales, and scorecard dividers. No decorative stock players, generic balls, or visual noise. Cards transition via state, not perpetual motion.

## 2. Color Palette & Roles

All visual colors are CSS custom properties mapped to semantic roles. No arbitrary hex in components.

| Token | Dark | Light | Role |
|---|---|---|---|
| `--canvas` | `#09131B` | `#F5F8F8` | Page background |
| `--surface` | `#101E28` | `#FFFFFF` | Content and chart panels |
| `--surface-raised` | `#162934` | `#E9F1F2` | Hovered/raised cards, popovers |
| `--surface-soft` | `#1C303B` | `#DDE9EB` | Subtle chips and lanes |
| `--text-primary` | `#F4F7F8` | `#15232B` | Content/headings |
| `--text-secondary` | `#B9C5CF` | `#365562` | Body, metadata |
| `--text-tertiary` | `#91A4B0` | `#526D78` | Caption: verify contrast against background |
| `--outline` | `#30414D` | `#C0CFD3` | Borders, grids |
| `--action` | `#A5F05B` | `#234D21` | Primary action/focus/data-up; use dark ink on lime |
| `--action-ink` | `#09131B` | `#FFFFFF` | Text on action |
| `--info` | `#4CC6EC` | `#116078` | Alternate information series |
| `--positive` | `#A5F05B` | `#234D21` | Up-trend paired with arrow and label |
| `--negative` | `#F47B86` | `#9F2635` | Down-trend paired with arrow and label |
| `--caution` | `#FFB85C` | `#845100` | Sample/data warning paired with text |
| `--neutral` | `#B9C5CF` | `#365562` | No change, unknown |

**Color rules:** Max two expressive accents per view (action-lime and information-cyan); warning and error hues are for real states, not decoration. Never encode performance with color alone. Contrast checks: `#B9C5CF` on `#09131B` ≈ 10.7:1; `#A5F05B` on `#101E28` ≈ 12.3:1; `#365562` on `#F5F8F8` ≈ 7.5:1. Check every new pair using WCAG 2.1 AA; normal text ≥4.5:1 and UI components ≥3:1. Theme tokens have light parity; theme switch must not change meaning.

## 3. Typography Rules

Body base ≥16px. Use `Inter`/system UI stack for legibility; numbers have `font-variant-numeric: tabular-nums`, large stat numerals use a condensed stat stack (`"Arial Narrow", "Roboto Condensed", "Bahnschrift", system-ui, sans-serif`) with `font-stretch: condensed` where available.

| Role | Mobile | Desktop | Weight | Line height | Use |
|---|---|---|---|---|---|
| Display | 42px | 68px | 800 | 1.03 | Landing proposition / share header |
| H1 | 34px | 52px | 780 | 1.08 | Dossier player name |
| H2 | 26px | 36px | 750 | 1.18 | Main section |
| H3 | 20px | 24px | 700 | 1.25 | Card heading |
| Hero stat | 48px | 76px | 800 | 0.98 | Dominant data points |
| Stat | 30px | 40px | 760 | 1.03 | Secondary numeric cards |
| Body | 16px | 17px | 400 | 1.55 | Explain metrics |
| Small | 14px | 14px | 500 | 1.45 | Labels and filter text |
| Caption | 12px | 12px | 550 | 1.5 | Dense chart labels; not substantive body |

Use sentence case except compact statistic labels. Avoid all-uppercase paragraphs. Break long figures and dates cleanly. Always show units and format context: `runs/innings`, `RPO`, `matches`, `T20`, not anonymous numbers.

## 4. Component Stylings

- **Buttons:** Primary = solid `--action` with `--action-ink`, 48px high, radius 12px, medium-bold; hover translateY(-1px) and slight shadow; focus 3px visible outline with 2px offset; pressed scale(.99); loading retains width and displays real spinner + accessible text; disabled uses faded neutral surface but maintains text contrast. Secondary = elevated outline; ghost = text/icon, always 44px click/tap minimum.
- **Inputs:** 52–56px high, strong visible border; valid state has check icon + text, invalid state has concise inline error + `aria-describedby`, submitting uses spinner. Never rely only on green/red.
- **Cards:** Stat card radius 16px, border; highlighted stat area uses one accent. Chart card border, flat `--surface`, 20–24px padding desktop, 16px mobile. Player-header card gradient uses surfaces, not opaque bursts. Hero chart is larger than surrounding cards.
- **Chips/badges:** Percentile badge only with real cohort and `n`; upward/downward chip includes arrow and comparison period. Caution chip states `Low sample — interpret with care`. Demo chip states `Illustrative data`. No fake rating leaderboards.
- **Tabs:** Underlined active label and `aria-selected` via real tab pattern; keyboard arrows, Home, End if tabs. May use ordinary nav links when routes are distinct.
- **Metric methodology disclosures:** Native `<details><summary>` or accessible dialog; must show formula, included data, eligible samples, normalization, version, exclusions, and data-provenance note.
- **Tooltips:** Not the only path to essential content; click/focus as well as hover. Plain-English interpretation always visible.
- **Skeleton:** Reflect final layout geometry, pulse only once/under slow motion, static under reduced-motion. Do not show fabricated progress counts.
- **Empty/error:** Name the issue; give primary recovery action (retry, import, demo, or home), not generic error codes. No mystery zero scores.
- **Modals:** Only for consequential actions (delete, privacy, explicit share), focus-trapped, Escape-close, restore focus. Toasts dismiss and use polite live region.
- **Share card:** 1200x630 SVG or OG image with player, one observation, data date, and demo provenance. No invented ranks.

## 5. Layout Principles

- Mobile-first 12-column container, max width 1280px, viewport padding 20px mobile / 32px tablet / 48px desktop. Landing uses deliberate single-column hierarchy; dossier uses 8/4 hero + supporting metrics and 6/6 comparative grids.
- Spacing unit = 4px. Prefer 4, 8, 12, 16, 24, 32, 48, 64, 96px. Gaps consistent at 16–24px. Page sections 64px apart mobile and 96px desktop.
- Information hierarchy: player name → headline insight → main time chart → situational explanations → projections → CTA. Avoid equal-height-card grids when a chart deserves dominance.
- Charts reserve 28px for y-axis labels and 32px for x-axis; mobile chart scrolls horizontally when necessary, or shows fewer labeled ticks. Always render adjacent textual chart summary.
- Every page and every state should offer a meaningful next action.

## 6. Depth & Elevation

Four tiers, keeping data visualizations flat:

| Tier | Token | Use |
|---|---|---|
| 0 | `--shadow-0: none` | Charts, static panels |
| 1 | `--shadow-1: 0 4px 12px rgba(0,0,0,.12)` | Buttons, hovering cards |
| 2 | `--shadow-2: 0 12px 32px rgba(0,0,0,.22)` | Raised menus, inline callouts |
| 3 | `--shadow-3: 0 24px 64px rgba(0,0,0,.32)` | Dialogs and share preview |

Never use colored glows around data. Use 1px outlines for surface separation, and gradients only for isolated accents/hero textures.

## 7. Do's & Don'ts

**Do:** explain every metric; show source, update time and formula version; label demonstrations; make missing data visible; pair trend icons and words; keep a share action within reach; render chart summaries; use real crease/radar SVG motifs; follow 2-accent limit; prevent SSRF on remote URL input; support both themes.

**Don't:** animate charts on every scroll; present pressure as a personality judgment; invent percentiles, testimonials, counters, or sample sizes; show fake progress numbers; fabricate spin/pace splits from scorecard aggregates; create broken dead-end pages; copy the FPL or CricHeroes look and feel; obstruct user access with sign-up/email walls; claim unauthorized ingestion works.

**Interaction motion:** entry ≤400ms; hover ≤180ms; one-time reveal only with motion permitted. Reduced-motion media query disables non-essential transitions and animated auto-carousels. Show informative progress text only when corresponding stage actually executes.

## 8. Responsive Behavior

| Width | Layout | Charts | Navigation |
|---|---|---|---|
| 0–599px | 1 column, 20px gutters, sticky share toolbar only where useful | Wide chart with 4–5 x ticks, vertically stack splits; keep summary in text | 44px target, accessible compact nav |
| 600–899px | 6-column effective grid, split cards when readable | Use chart container width and abbreviated ticks | Horizontal nav or compact header |
| 900–1279px | 12-column grid, 8/4 stats | Full label density | Desktop nav |
| ≥1280px | Max 1280px central grid | Large hero trend and comparison panels | Desktop nav |

Test at **375**, **768**, **1440** pixels. No horizontal page overflow. Charts may independently scroll if preserving legibility requires it. Keyboard reaches all controls. Do not turn important information into hover-only reveals.

## 9. Agent Prompt Guide

Read `DESIGN.md`, `PRODUCT.md`, `AGENTS.md` before every feature. Build **MoreThanCricket / Broadcast Studio × Performance Lab**: charcoal `--canvas`, flat `--surface` charts, lime `--action` with occasional cyan `--info`, compact uppercase labels, strong tabular statistics, subtle pitch crease line motifs, accessible charts with text equivalents, honest insufficiency states, and real user-initiated interactions.

**Feature checklist:** What observable evidence supports this component? Can a screen-reader understand it? What if data is missing? What happens on mobile? How does the visitor proceed? Does it introduce precision unsupported by data? Has reduced motion been tested? If a component deviates from a token, explain it in an updated decision log before changing this file.

**Design decision history:** `2026-11-08` — selected Broadcast Studio visual identity with Performance Lab analytical discipline; preserves excitement without making the data appear more certain than it is.
