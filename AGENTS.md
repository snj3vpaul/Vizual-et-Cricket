# MoreThanCricket — Build Conventions

Before modifying features, **read `DESIGN.md`, `PRODUCT.md`, and `AGENTS.md`**. Before changing formulas, also read `docs/METRICS.md`; before changing data ingestion, read `docs/DATA-CONTRACT.md`.

## Architecture
- **Frontend:** Next.js App Router / React / TypeScript, mobile-first, server components by default. Client components only for actual interactions, not decoration.
- **Data:** source adapter (authorized API or user-supplied file) → ingestion validation and provenance → canonical data schema → pure metric computation → presentation model → accessible UI. Avoid coupling render components to source website markup.
- **Metrics:** pure TypeScript modules, versioned, testable without network and deterministic with fixed data. Do not use LLM-generated numbers.
- **Data stores:** repository contains demo fixtures only. Real persistence requires explicit secure storage and deletion workflow; do not pretend local demo storage enables universal sharing.
- **Hosting:** Vercel for server routes and OG generation. GitHub Pages is not compatible with dynamic routes and ingestion requirements without an external backend.

## Engineering rules
1. Never scrape CricHeroes automatically unless future permission and contractual compliance are independently verified. No OTP bypass, hidden endpoints, scraping proxies, or rate-limit evasion.
2. Reject untrusted URL hosts/redirects; validate URL at the boundary to prevent SSRF. URL text is never a fetch instruction by itself.
3. Every score has `status`, `value|null`, `n`, `formulaVersion`, `confidence`, `inputs`, `explanation`, and `limitations`; null means not measurable.
4. Never invent a percentile. Percentile needs same-format, comparable-role cohort with sample size; flag insufficient cohorts.
5. Never manufacture loading-event counts. Show stage labels only for actual work; simulate honestly labeled stages in demo only.
6. All demo people, matches and statistics are clearly marked **synthetic illustration**. Never describe them as real users.
7. Treat internationalization and privacy as architecture, not later cosmetic fixes; do not log raw source URLs.
8. Show a plain-English `figcaption` or accessible summary for each SVG chart. Prefer `role="img"` + `<title>` and meaningful table/summary text.
9. Respect reduced motion, keyboard activation, and visible focus rings. Minimum touch target 44px.
10. No one-off hard-coded colors or spacings. Use DESIGN.md semantic tokens and shared classes.
11. Match-level calculations: never mix formats without segmentation, never assume missing data equals zero, distinguish ball events from player innings.
12. Before handover run lint, TypeScript check, metric tests, and targeted accessibility/performance review. If environment prevents running checks, declare explicitly.

## Module and component naming
- Domain types in `src/lib/schema.ts`.
- Source validation in `src/lib/sources.ts`; user-import parser is independent of any upstream service.
- Metrics in `src/lib/metrics.ts`, with a single version constant and pure functions.
- Synthetic fixture in `src/fixtures/demo.ts`.
- Display in `src/components/` as semantic named sections, not huge anonymous pages.
- API contracts in `src/app/api/` and dynamic OG in `src/app/dossier/[id]/opengraph-image.tsx`.
- Metadata follows player provenance: demo share cards cannot masquerade as actual stats.

## Process
- Phase gate: Discovery → Foundation → Landing → Engine → Dossier → Audit → Launch. Record decisions in docs when changed.
- Quality bar: 375px / 768px / 1440px, keyboard, error/empty/loading, honest copy, reduced motion, source eligibility.
- When prompted `polish`: audit current work against `DESIGN.md`, fix drift. When prompted `explain`: report last decision and evidence.
- Do not describe an untested integration, unexecuted test, or undeployed site as working.
