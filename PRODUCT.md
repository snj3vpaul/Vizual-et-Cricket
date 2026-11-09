# MoreThanCricket — Product Charter v1.0

## Promise
**Know your game better than the scoreboard does.** MoreThanCricket turns available, authorized amateur-cricket scorecard records into accurate explanations of how a player performs, develops and compares in observed circumstances. The underlying engine is named **CricketMind**.

## Who
1. **Club player** — proud of their CricHeroes history, wants progress narrative and useful feedback; many will open via WhatsApp on a phone.
2. **Teammate/friend** — wants a fair comparison and a one-tap shareable artifact.
3. **Coach/captain (v2)** — wants appropriate player-role evidence rather than raw averages.

## Jobs-to-be-done
- *Recognition:* Give me an attractive, truthful report I am comfortable sharing.
- *Improvement:* Show trends and gaps that standard batting/bowling averages hide.
- *Comparison:* Compare with same-format, same-role peers using a real cohort and disclosed sample sizes.
- *Autonomy:* Let me explore a demonstration without creating an account, and opt into sharing a report.

## North-star journey
`Land → Validate link → Authorized ingestion OR user import OR demo → Normalize → Compute → Explain → Dossier → Share / Compare / Revisit`.

**Important data-source constraint:** CricHeroes Terms of Service currently prohibit scraping. Do not automatically scrape public pages. Link entry alone does not guarantee data availability; route to authorized provider when one is available, otherwise clearly present manual import and illustrative demo. Do not claim real analysis of a URL when only its format has been validated.

## Product principles
1. Evidence before excitement: label data provenance, metric version, relevant samples, reference cohorts and uncertainty.
2. Missing evidence is a feature: `Insufficient evidence` is better than a misleading 87/100.
3. No fake social proof, artificial urgency, or fabricated progress narratives.
4. User owns the decision to share. No prechecked consent, no login wall.
5. Mobile-first, charts accessible and summarized in words, WCAG 2.1 AA.
6. Same-format comparisons; T10, T20, ODI, recreational variants are not directly mixed.
7. Pressure/nerve is a situational performance proxy, not a psychological assessment.

## Launch scope
- Branded landing, explainable demonstration, canonical importer, modular metric engine, comprehensive dossier, shareable demo route, compare readiness, accessible charts, real privacy copy, SEO, and event contracts.
- Authorized ingestion adapter is explicitly conditional on authorization; a credentials-free live scraper is **out of scope**.
- Inference engine gives low-sample or unavailable statuses, no made-up percentiles.

## Out of scope for v1
Always-on third-party scraping; paid data republishing without license; unapproved player images; proprietary scorecard copying; clinical personality judgments; fake reviews and stat counters; predictive betting recommendations.

## Metrics / tracking events
- `landing_view` (anonymous session)
- `source_link_submitted` / `source_link_rejected` (URL shape only; do not transmit raw URL to analytics)
- `import_started` / `import_completed` / `import_failed`
- `demo_opened`
- `dossier_viewed` with data-source label, anonymized project ID, parse version
- `methodology_opened` by metric type
- `share_initiated` / `share_completed`
- `compare_initiated` / `compare_completed`
- `return_visit_7d` only if consent settings support reliable measurement

**Targets, not results:** landing→valid submission 30%; median cached report under 3s; shares 15% of dossier views; seven-day return 20%; import success 95%. No public number until measured.

## Feature acceptance
- Any metric claim names sample and data-source provenance; formulas versioned.
- Cannot leak a user's private import via share URL without opt-in and valid persistence.
- All routes have productive loading/error/empty paths.
- No athlete portrait unless permission is confirmed; fallback initials.
- Each analysis route states `Demo`, `Imported` or `Authorized data` prominently.
- Performance and a11y audits at 375/768/1440.

## Known risks
- **Critical:** CricHeroes scraping ban. Seek a documented/authorized integration; manual import is fallback.
- **High:** Detail availability inconsistent; pressure and bowling phase metrics require ball-by-ball/context.
- **High:** Selection bias across amateur leagues/formats means percentiles require cohort normalization and sufficient n.
- **High:** Profile links alone are not identity proof. No unauthorized sharing of private data.
- **Medium:** Projection calibration and small sample sizes; favor wide bands and clear provenance.
- **Medium:** Photo permissions, names and data-deletion/retention control.

## Phase history
- Phase 0 (2026-11-08): chose Broadcast Studio × Performance Lab and Vercel-first Next.js; authorized ingestion boundary is non-negotiable.
