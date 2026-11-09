# CricketMind — Metric Specification v1.0

## Universal calculation contract
- `formulaVersion: 'cm-1.0.0'`; future changes create a new version, never silently reinterpret old reports.
- All score values are **nullable** and 0–100 only when eligible; round to nearest 5 (avoid spurious precision). Every returned metric includes `n`, `status` (`ready`, `low_sample`, `insufficient_data`, `unsupported`), `inputs`, `plainEnglish`, `limitations`, `formulaVersion`, and `percentile|null`.
- A 0–100 score is a normalized *relative performance index*, never probability of success or psychological disposition. **Production intention:** a known matching-format/role cohort defines median/MAD robustZ and `clip(round5(50 + 15 * robustZ),0,100)`. **Current demo implementation:** each metric-specific signal is standardized by a documented heuristic scale and transformed with `clip(round5(50 + 15*z),0,100)`, then compared with a 128-item *synthetic*, non-empirical reference sequence for an illustrative percentile. The production cohort normalization is NOT implemented, and real imports therefore have null indices/percentiles. These are prototypes, not calibrated real-world ratings.
- Percentile only with a verified cohort of ≥100 comparable players in the same over-format and role grouping, each meeting eligibility; otherwise suppress. Record cohort ID, size, and date. Never compare T10/T20/ODI blindly.
- `n < 10` relevant match appearances/innings gets **Low sample — interpret with care** when underlying calculation is possible. Under metric-specific minimum, return null. Significant role/format shifts require segmenting.
- Confidence: sample bootstrap/empirical shrinkage where supported; otherwise descriptive wide bands. Avoid causal language and personal character judgments.
- A report rating is a weighted aggregation **only over eligible normalized metrics**, with disclosed coverage and a minimum of 3 independent metrics. Otherwise show `Not yet rated`.

## 1. Progression Rate
**Inputs:** dated innings with legal balls, runs, wickets/balls bowled, format, role, innings outcomes. **Eligibility:** ≥5 chronologically ordered innings in the same format and role; under 10 = low sample. **Logic:** the prototype computes a role-adjusted contribution (batting runs or wicket/economy weighted output) and a 5-appearance rolling mean; first-five versus last-five percent change plus difference in adjacent rolling windows flags acceleration/deceleration (≥15 appearances). A later calibrated version can replace this with robust regression. **Score:** percentile/robust Z of slope within matched cohort, or null without reference normalization. **Interpretation:** `Recent batting contribution is improving versus earlier appearances`; never `has become a better person/player` from one result. **Limitations:** batting position, pitch and opponent quality may not be observed.

## 2. Pressure Index (behavioral proxy)
**Inputs:** ball-level state (innings, runs, balls, target, wickets, batting/bowling player, format, competition stage), required RPO, score state before event. **Eligibility:** ≥5 observable high-stakes episodes and ≥5 comparable regular episodes, ideally ≥10 innings overall. **Tags:** a chase needing >baseline required rate in final portion; the last 3 overs of an appropriately long limited-overs format; official knockout/final when explicitly tagged; or verified high-leverage state using an auditable win-probability model. **Logic:** difference in role-adjusted contribution between verified high-pressure and comparable regular contexts, with Bayesian shrinkage toward zero for small n. **Score:** cohort-normalized delta, not a personality measure. **Limitations:** no inferred emotional state, match stakes, or career impact from a scorecard alone. Without ball-level data return insufficient_data.

## 3. Clutch Rating
**Inputs:** close-match outcomes, individual ball-by-ball contribution, dismissed batters' batting order, innings phase and opponent context. **Eligibility:** ≥5 eligible situational events; low sample until 10. **Logic:** aggregate recorded batting contributions of 20+ in documented close finishes, top-order wicket counts, and verified powerplay/death bowling phases under 7 RPO; compare expected impact for opportunities. `Economy under 7 RPO` can be shown as a transparent supporting fact, never as a universal virtue across formats. **Score:** normalized impact across comparable opportunities. **Limitations:** no attribution to a player without observed participation.

## 4. Consistency Profile
**Inputs:** ≥5 comparable batting or bowling appearances; output adjusted for opportunity. **Logic:** median, Q1/Q3 and p10/p90 performance distribution, robust coefficient of variation based on median absolute deviation; map streaks of consecutive above/below-baseline results. **Score:** 100 - role/format-normalized volatility (null without cohort). **Interpretation:** `Typical output varies between A and B`, not deterministic reliability. **Caution:** 5–9 relevant appearances low sample.

## 5. Momentum Map
**Inputs:** dated ordered appearances and normalized match contributions. **Logic:** 5-appearance moving/weighted average compared with earlier baseline, with 10-appearance optional long-term reference. Mark actual milestones only (highest score, first 5-for, final). **Score:** cohort-normalized recent-vs-past delta; null if fewer than 5. **Output:** chart of individual matches and smoothed recent contribution, with textual accessible summary.

## 6. Role Fitment
**Inputs:** batting position, scoring pace, legal balls faced, wickets, legal balls bowled, overs by phase, dismissals when known. **Eligibility:** ≥10 role-relevant appearances, ≥2 reliable role dimensions. **Logic:** compute normalized feature vector and compare to per-format archetype reference vectors (anchor, finisher, strike bowler, economical bowler, all-rounder) with missing-feature masking. **Score:** bounded similarity based on observed dimensions, only if cohort archetype baselines exist. **Limitations:** not a recommendation to change positions; pitch, team strategy and opportunity biases matter.

## 7. Weakness Radar
**Inputs:** supported match contextual split: spin/pace bowler classification, home/away venue role, batting-first/chasing, over phase. **Eligibility:** ≥5 exposures each side of any comparison; caution when <10. **Logic:** compute per-split output difference versus personal baseline and like-for-like cohort adjusted for opportunities. **Score:** normalized relative performance *by documented split*, not a blanket `weakness` diagnosis. **Limitations:** without verified bowler type, no spin/pace claim; without venue designation, no home/away claim. Prefer `Unknown`.

## 8. Projected Range
**Inputs:** ≥10 same-format ordered appearances (prefer ≥20) with contextual opportunities. **Logic:** recency-weighted resampling of comparable historical performances and optional opponent features, simulate next 5 matches 1,000+ times, report central 80% **predictive interval** for aggregate and expected per-match outcome. Evaluate via held-out rolling backtests before making calibration claims. **Score:** 0–100 *forecast reliability* only if validation evidence permits, otherwise null; the forecast itself is a range, not 0–100 ability. **Limitations:** no certainty about selection, batting position, weather, opposition or injury. `For illustration only` on synthetic fixture.

## Differences by data tier
- **Tier A (aggregate innings only):** progression, consistency, momentum, basic eligible role features, experimental broad projections. No pressure episodes / clutch details / spin vs pace splits.
- **Tier B (match scorecards + context):** verified chase vs setting totals and match outcomes, some close-match contributions, batting-first/second; still no precise pressure chronology.
- **Tier C (ball-by-ball with verified states):** eligible pressure, precise phase splits and better role fit. Requires authorized source or user-provided event detail.

## Scorecard truthfulness examples
- `Pressure Index: Insufficient evidence — ball-by-ball context is needed.`
- `Consistency: 24 matches, median 19 runs, middle half 11–31; illustrative only if synthetic.`
- `Peer percentile unavailable — no verified T20 batting-role cohort.`
- `Projected five-match total: 42–128 runs (80% predictive interval; based on 22 eligible innings, not a guarantee).`

## Test matrix
Known matches / zero innings / missing balls / bad chronology / mixed formats / super overs / retired not-out / wides/no-balls / DNB / missing scorecards / a rain-abandoned match / cohort too small / anomalous outliers / target inferred incorrectly / missing stage / unsupported bowler type / deterministic seed for demo / output score bounds / CI bands ordered / never NaN / exact formula version.

**Prototype implementation boundary:** The engine accepts already normalized appearances and event-derived context samples marked verified; it does NOT yet parse arbitrary raw CricHeroes ball-by-ball feeds, independently verify user-provided event flags, perform true robust cohort normalization, or claim calibrated coverage of forecast intervals. These are launch blockers recorded in `AUDIT.md`.
