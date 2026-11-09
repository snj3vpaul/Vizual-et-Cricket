# MoreThanCricket · CricketMind

> **Status: working source-code prototype, not a deployed production service.** Live CricHeroes ingestion is intentionally disabled pending authorized access. Demo records are fictional. External dependencies and a hosting account are required to run/deploy the Next.js app.

![Project](https://img.shields.io/badge/project-MoreThanCricket-A5F05B) ![engine](https://img.shields.io/badge/engine-cm--1.0.0-4CC6EC)

## Start in one command

```bash
npm install && npm run dev
```

Open `http://localhost:3000`. Node.js ≥20.9 required. For deployment, link this repository to Vercel (Next.js preset) or use `npx vercel --prod` after Vercel login, project setup, and environment configuration. Enable Vercel Web Analytics in your own dashboard. **No live deployment was made in this deliverable.**

## Where to look

- `/` — branded landing: URL validation, demo teaser, six metrics, truthful social-proof alternative, FAQ and final CTA.
- `/dossier/demo` — fictional but genuinely computed report: 8 metrics, 10 report sections, confidence context, 1200×630 dynamic OG image.
- `/compare` — synthetic comparative dossier with a matched T20 format.
- `/api/share-card` — downloadable 1200×630 SVG social graphic, explicitly labeled synthetic demo.
- `/import` — browser-local canonical JSON import, computes the actual metric engine (with missing evidence as null).
- `/privacy` — privacy, data source, analytic limits and persistence policy.
- `POST /api/analyze` — HTTPS link validator; no third-party fetch; explicit authorization error and fallback paths.
- `src/lib/metrics.ts` — deterministic formula v`cm-1.0.0`.
- `src/lib/schema.ts` — canonical analytic appearance model + validation.
- `tests/metrics.test.ts` — unit tests for source URL safety, data eligibility, format separation, forecasting and uncertainty.

## Read before editing

`DESIGN.md` → nine-section visual token system. `PRODUCT.md` → privacy, requirements, success metrics. `AGENTS.md` → engineering conventions. `docs/METRICS.md` → formula definitions and limits. `docs/DATA-CONTRACT.md` → canonical source records and permitted ingestion.

## Legal boundary

CricHeroes Terms of Service explicitly state that scraping the platform is prohibited, even though compliant crawling is conditionally allowed. Therefore the URL validator does not scrape, bypass access checks or call unpublished APIs. Integrating real CricHeroes profiles is blocked on explicit upstream authorization or a suitable user-owned data import/export flow. See: https://cricheroes.com/terms-of-services.

No real-player rankings, fake testimonials, imaginary usage counters, or fabricated live loading events are published. All `/dossier/demo` metrics, portraits/initials, opponent names and data are visibly marked synthetic. Peer percentiles in the fictional demo are **simulated examples**, not real cohorts. Real imported datasets lack cohort-derived 0–100 indices until a validated cohort is configured.

## How user import works

Use `/import` and upload JSON with the canonical `PlayerDataset` structure in `src/lib/schema.ts`. A sample file is available at `/sample-dataset.json`. Inputs are validated, then `buildReport` runs in-browser. Data is not sent to this application server by the import flow. Imported reports cannot currently be shared via public URLs; adding that requires explicit opt-in and secure storage/deletion workflows.

### Data tiers

| Tier | Can compute | Intentionally unavailable |
|---|---|---|
| Aggregate | Progression, consistency, momentum, approximate projections | High-stakes event comparisons, spin/pace splits without source data |
| Scorecard | Aggregate metrics and some verified match outcomes | Ball-by-ball situational pressure |
| Ball by ball | Event-derived context samples, role/split comparisons if verified | Psychological claims |

The current prototype consumes **precomputed verified context observations** in the canonical record. Source adapters that reconstruct context from individual BallEvent data and persistent storage remain future work.

## Release verification commands

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

Confirm in the browser at **375, 768, 1440px**, keyboard-only, light/dark, reduced-motion, slow network, no match data, malformed JSON, bogus link, and disconnected internet. Lighthouse ≥90 across all four axes and interactive dossier <3s on 4G are targets, not measured results in this environment.

## Analytics

`@vercel/analytics` tracks page views when enabled on a connected Vercel project. Custom events (`import_started`, `import_completed`, etc.) need Vercel Pro/Enterprise and the feature enabled; no raw URL or player name is passed. Returning-visitor measurement is **not** claimed until a privacy-respecting mechanism is implemented. No fake conversion numbers appear in UI.

## Prioritized v2

1. CricHeroes authorized provider integration, explicit use rights and deletion workflow.
2. Persistent **consent-based** shareable dossiers, access controls and real per-player OG cards.
3. Normalization/calibration cohort with same-format/role percentiles; historical holdout tests for predictive intervals.
4. Reliable raw ball-by-ball ingestion and high-leverage state model, phase-aware bowling and other splits.
5. Opt-in leagues/leaderboards, friends comparison and coach mode.
6. Optional tracked-player notifications, privacy/retention controls and accessibility test automation.

## Deployment notes

Vercel is recommended because dynamic Next.js routes, API validation and OG image generation will not work as a static GitHub Pages export. Set `NEXT_PUBLIC_SITE_URL` to the live HTTPS origin. Do not expose source-provider credentials to public/client environment variables. Real ingestion/persistence requires a licensed data source and properly secured database before launch.
