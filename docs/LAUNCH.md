# Phase 6 — Launch Preparation and Handover

## Hosting choice
**Vercel.** A Next.js App Router site with server routes and dynamic OG images requires a compute-capable host; a static GitHub Pages export is not suitable for this architecture.

## Developer handoff
1. Unzip the project. Read `DESIGN.md`, `PRODUCT.md`, `AGENTS.md` and domain specifications.
2. Use Node 22 LTS (`node -v`). From project root run `npm install && npm run dev`.
3. Smoke-check `/`, `/dossier/demo`, `/compare`, `/import`, `/privacy`, `/api/share-card` and `POST /api/analyze`.
4. Run `npm run typecheck && npm test && npm run lint && npm run build` and correct failures.
5. Connect your GitHub repository to Vercel and deploy with its Next.js framework preset, or run `npx vercel --prod` after authenticating.
6. Set `NEXT_PUBLIC_SITE_URL=https://<your-production-domain>` to generate the correct metadata, sitemap and canonical share links.
7. Enable Web Analytics in the Vercel dashboard; custom events require an eligible Vercel plan. Never send file bodies, player identities or profile URLs to analytics.
8. Re-run contrast, keyboard and reduced-motion tests; take Lighthouse audits on an actual preview URL; measure 4G timing before publishing performance claims.
9. Do **not** enable automated CricHeroes harvesting without an authorized agreement and a source/retention assessment. A valid profile URL is not a data license.

## Deployment limitation of current handover
The project files were created and checked in a local environment only. A Vercel connection, registry-backed dependency install, live URL, full Next.js build and real performance trace were **not available**. Installation/deployment is an external action that cannot be reported as completed. The design static preview is `preview.html` (not the running application).

## Priority v2
P0: documented authorized CricHeroes access or permitted user export; raw event parser/normalizer; real schema coverage audit; secure report persistence/deletion.
P1: same-format peer cohorts and calibration; opt-in player-to-player comparison; consent-based share cards/links; role-specific forecasts with backtests.
P2: private leagues and club leaderboards; coach mode; tracked-player notifications where source usage permits; longitudinal insight digests.

## Release gate
**NO-GO for real-player production claims until permitted ingestion, real calibration, security/privacy controls, hosted QA and performance audits are satisfied.** A synthetic demo can be deployed separately with conspicuous provenance labels.
