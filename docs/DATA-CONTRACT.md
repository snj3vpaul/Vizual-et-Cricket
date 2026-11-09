# CricketMind — Canonical Data Contract v1.0

## Principle
The authorized input source is not the metric model. Normalize every source into verified canonical types, with per-field quality and provenance. A URL is merely an identifier until an authorized integration exists.

## Entities
`Player`: id, displayName, sourceProfileUrl?, avatarUrl? (permission required), battingHand?, bowlingStyle?, userProvided flag.

`Match`: id, dateISO, format (`T5|T10|T20|ODI|OTHER`), scheduledOvers?, tournament?, stage? (`group|semifinal|final|unknown`), venue?, homeTeamId?, innings[], result? (`winnerTeamId|tie|no_result|unknown`), dataTier (`aggregate|scorecard|ball_by_ball`), provenance.

`Innings`: id, matchId, inningsNumber, battingTeamId, bowlingTeamId, targetRuns? (chase only), totalRuns?, wicketsLost?, legalBalls?, battingRecords[], bowlingRecords[], events?; don't infer absent target or overs as zero.

`BattingRecord`: playerId, battingPosition?, runs, ballsFaced, fours?, sixes?, dismissal? (`out|not_out|retired_hurt|unknown`), didNotBat false for valid row.

`BowlingRecord`: playerId, legalBalls, runsConceded, wickets, maidens?, phaseLegalBalls?; exclude run-outs from bowler wicket totals when known.

`BallEvent`: index, overIndex, legalBallInOver, strikerId?, bowlerId?, battingTeamId, batterRuns, extras?, totalRuns, wicket? with creditedBowler and batterId, `stateBefore` with chaseTarget?, runsRequired?, ballsRemaining?, wicketsRemaining?; track wides and no-balls as nonlegal deliveries.

`Provenance`: sourceKind (`synthetic_demo|user_import|authorized_provider`), sourceUri?, importedAtISO, originalFormat?, adapterVersion, permissionState (`demonstration|user_supplied|authorized|unknown`), dataCoverage flags and warnings.

## Data quality
- Schema validation must require nonnegative integer runs, balls and wickets, valid ISO date, stable IDs, and declared format.
- Keep legal balls and overs distinct: cricket `4.3 overs` = 27 legal balls, never 4.3 decimal overs.
- Do not treat `DNB`, absent batting record, a retired-hurt non-dismissal, and scored zero as the same case.
- Deduplicate records by stable match identifier, not names.
- Avoid mixing teams/tournaments with inferred player identities; player id is authoritative within a supplied dataset.
- Only per-field observed values can drive pressure, role or spin/pace claims. Unknown = null.
- Numeric inputs must be range-checked; protect against extremely large user-import files and malformed JSON.
- Retention: store only the minimum source and derived data necessary; implement player deletion before making personal import publicly shareable.

## Ingestion adapters
`validateProfileURL`: allow only https and known CricHeroes hosts, strict player path shape; never dereference user-supplied URL on a server without an allowlisted, licensed adapter and redirect checks.

`AuthorizedProvider`: abstract interface fetch profile/matches if a contract or public authorized API allows it; by default disabled, yielding a meaningful `not_configured` response.

`UserUpload`: accept validated JSON/CSV as user-controlled content, normalize on server when deployment supports persistence. Imported material is private unless explicitly shared.

`SyntheticDemo`: hardcoded or deterministically generated data. Every view, image, metadata and share action must display an unmistakable `Demo · Illustrative data` label.

## API / presentation boundaries
- `POST /api/analyze`: URL shape checked; if no provider configured returns `source_not_authorized` with import/demo options; no pretend success.
- `POST /api/import`: canonical schema upload with byte limit and validation; if storage absent return a client-session result not a public report.
- `GET /dossier/demo`: stable synthetic example, not a real player record.
- Future `GET /dossier/[id]`: resolve persisted **explicitly shared** report only, validate authorization and retention.
- Report view model includes `dataStatus`, provenance, coverage summary, formula version, per-metric eligibility and error/empty reasons.

## Threat model
SSRF on URL input; redirect to internal address; accidental server logs of profile links; privacy of player names/portraits; untrusted HTML; malicious oversized CSV; unauthorized upstream scraping; stale caches after deletion; unreliable claims generated from null context; fake percentiles. Do not shortcut these guardrails for demo convenience.
