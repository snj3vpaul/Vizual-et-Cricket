# Phase 5 — Polish & Engineering Audit (2026-11-08)

## Evidence-based audit, not a claim of production readiness

| Quality bar | Check | Result |
|---|---|---|
| DESIGN.md exists with nine required sections | File inspection | PASS |
| Tokens and type scale documented for dark/light | File inspection | PASS |
| Normal-text AA contrast for primary combinations | Python WCAG relative luminance checks, representative pairs | PASS (10.66:1 secondary on dark canvas, 7.47:1 secondary on light canvas, 12.29:1 dark accent on surface) |
| Minimum 44px navigation targets | CSS styles: theme toggle, buttons, range input | PASS by code review; browser verification pending |
| Accessible chart text and keyboard range | Code review of charts and descriptions | IMPLEMENTED; screen-reader/browser audit pending |
| Reduced-motion support | CSS query + demo teaser matchMedia check | PASS by code review |
| Genuine no-data, invalid-URL, low-sample states | API, schema and metrics tests | PASS in domain smoke tests |
| Show per-metric formulas and version | `Formula` details in Dossier | PASS by code review |
| Never fake percentiles or aggregate scores on real imports | Metric guard + smoke test | PASS |
| No fake quotes, counters, urgency, email wall | Copy/content inspection | PASS |
| No unauthorized scraping calls | URL allowlist and 422 API | PASS |
| Forecast band rather than single certain score | Deterministic resampling + ordering smoke test | PASS |
| Responsive 375/768/1440 visual inspection | Browser rendering | **UNVERIFIED:** Chromium headless timed out in environment |
| Full Next.js TypeScript/lint/build | Requires downloaded npm dependencies | **UNVERIFIED:** package registry unavailable in this environment |
| Full Vitest suite | Requires npm dependencies | **UNVERIFIED:** separate domain smoke checks passed |
| Lighthouse ≥90 across 4 axes | Needs running build, browser + network profiling | **UNVERIFIED / TARGET ONLY** |
| Interactive dossier in <3s on 4G | Needs realistic hosted trace | **UNVERIFIED / TARGET ONLY** |
| Vercel deployment / live preview | Requires connected Vercel credentials | **NOT DEPLOYED** |
| Real CricHeroes ingestion | Terms prohibit scraping, no authorized API credentials | **BLOCKED BY UPSTREAM ACCESS RIGHTS** |
| Real peer percentiles | No verified comparable cohort data | **UNAVAILABLE BY DESIGN** |
| User-specific public share URLs | Needs secure store, opt-in, deletion control | **NOT IMPLEMENTED** |
| Raw ball-by-ball to canonical source adapter | Only precomputed context observations accepted | **NOT IMPLEMENTED** |

## Tests actually executed

- Global TypeScript compiler, strict `--noEmit` check on core modules: `schema.ts`, `sources.ts`, `metrics.ts`, `demo.ts` — PASS.
- Global TypeScript parser, syntax pass across `src/` and `tests/` — PASS, 24 TS/TSX files before the SVG share route, recheck at delivery.
- Node smoke harness executes the actual compiled source modules in memory: 13 checks passed, including URL host safety, fixture totals (969/36), score bounds, projection ordering, insufficient pressure evidence, format isolation, no fabricated import percentile, low-sample caution and duplicate match validation.
- Vitest test suite is supplied at `tests/metrics.test.ts` but was not run because dependencies could not be installed.

## Defects found and corrected during internal review

1. Demo teaser totals were hardcoded inconsistently with the fixture (corrected to 969 runs / 36 wickets).
2. Root layout used a client event handler inside a server component (replaced with a pure-CSS skip link).
3. Missing context collection shape guards (added array bounds and stricter count validation).
4. Initially unimplemented phase economy evidence in Clutch score (added verified powerplay/death phase spell contribution).
5. Pressure metric over-weighted batting for bowlers (added role-dependent bowling-adjusted delta).
6. Role-fit numeric targets could appear calibrated for real imports (suppressed uncalibrated real role fit and index).
7. Explicit split coverage originally omitted setting-versus-chasing evidence (added multiple supported split pairs).
8. Share action had no editable image export (added 1200x630 downloadable SVG, synthetic demo only).
9. Initial funnel metrics captured import but not source validation or dossier sharing (wired anonymous Vercel Analytics custom events, plan-dependent).

## Remaining work before a genuine production launch

1. Connect Vercel, install dependencies, run full CI and fix any build and lint issues.
2. Execute visual and accessibility audits on 375/768/1440 and keyboard/screen-reader devices; iterate actual rendered UI.
3. Obtain an authorized upstream data integration OR an official permissible player export; implement robust raw scorecard normalization.
4. Independently validate context samples, career records and scorecard data quality.
5. Calibrate real role/format cohorts, predictive interval coverage and objective role-fitness archetypes before publishing ranked player claims.
6. Add opt-in consent, persistent report storage, access control, deletion and privacy-preserving public sharing.
7. Add CI, measured Lighthouse and live-web telemetry before claiming targets achieved.

**Decision:** Favor truthful, accessible user flows with explicit capability boundaries over a deceptively polished demo pretending to analyze real profiles.
