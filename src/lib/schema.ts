/** Canonical ANALYTIC APPEARANCE model. Source adapters transform authorized scorecards
 * into this model; do not invent missing context (see docs/DATA-CONTRACT.md). */
export type Format = 'T5' | 'T10' | 'T20' | 'ODI' | 'OTHER';
export type DataTier = 'aggregate' | 'scorecard' | 'ball_by_ball';
export type SourceKind = 'synthetic_demo' | 'user_import' | 'authorized_provider';
export type Role = 'batter' | 'bowler' | 'all_rounder' | 'unknown';
export interface Player {
  id: string;
  displayName: string;
  role: Role;
  battingHand?: 'left' | 'right';
  bowlingStyle?: string;
}
export interface Batting {
  runs: number;
  balls: number;
  position?: number;
  fours?: number;
  sixes?: number;
  dismissed?: boolean;
}
export interface Bowling {
  wickets: number;
  legalBalls: number;
  runsConceded: number;
  topOrderWickets?: number;
}
/** Context observations are aggregations of verified event-level data, NOT guessed from totals. */
export interface ContextSample {
  kind: 'pressure' | 'routine';
  phase?: 'powerplay' | 'middle' | 'death';
  battingRuns: number;
  battingBalls: number;
  bowlingRunsConceded?: number;
  bowlingLegalBalls?: number;
  wicketsTaken?: number;
  verified: boolean;
  description?: string;
}
export interface ExposureSplit {
  kind: 'spin' | 'pace' | 'setting' | 'chasing' | 'home' | 'away';
  battingRuns: number;
  battingBalls: number;
  verified: boolean;
}
export interface Appearance {
  matchId: string;
  dateISO: string;
  format: Format;
  team: string;
  opponent: string;
  batting?: Batting;
  bowling?: Bowling;
  stage?: 'group' | 'semi_final' | 'final' | 'unknown';
  matchResult?: 'win' | 'loss' | 'tie' | 'no_result' | 'unknown';
  chasing?: boolean;
  closeFinish?: boolean;
  contextSamples?: ContextSample[];
  splits?: ExposureSplit[];
}
export interface Provenance {
  kind: SourceKind;
  dataTier: DataTier;
  importedAtISO: string;
  adapterVersion: string;
  permission: 'demonstration' | 'user_supplied' | 'authorized';
  sourceUrl?: string;
  warnings?: string[];
}
export interface PlayerDataset {
  schemaVersion: '1.0';
  player: Player;
  appearances: Appearance[];
  provenance: Provenance;
}

const formats: ReadonlyArray<string> = ['T5','T10','T20','ODI','OTHER'];
const roles: ReadonlyArray<string> = ['batter','bowler','all_rounder','unknown'];
const safeText = (v: unknown, max: number): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max && !/[<>]/.test(v);
const count = (v: unknown) => Number.isSafeInteger(v) && (v as number) >= 0;
const validDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T00:00:00Z`).valueOf()) && new Date(`${v}T00:00:00Z`).toISOString().startsWith(v);
export class DatasetValidationError extends Error { constructor(message: string) { super(message); this.name = 'DatasetValidationError'; } }
export function parseDataset(raw: unknown): PlayerDataset {
  if (!raw || typeof raw !== 'object') throw new DatasetValidationError('The file must contain a JSON object.');
  const d = raw as Record<string, unknown>;
  if (d.schemaVersion !== '1.0') throw new DatasetValidationError('Unsupported schemaVersion. Expected "1.0".');
  const p = d.player as Record<string, unknown> | null;
  if (!p || !safeText(p.id, 100) || !safeText(p.displayName, 120) || !roles.includes(p.role as string))
    throw new DatasetValidationError('Provide player.id, player.displayName and a valid role.');
  if (!Array.isArray(d.appearances) || d.appearances.length > 1000)
    throw new DatasetValidationError('appearances must be a list containing at most 1,000 matches.');
  const prov = d.provenance as Record<string, unknown> | null;
  if (!prov || !['synthetic_demo','user_import','authorized_provider'].includes(prov.kind as string) || !['aggregate','scorecard','ball_by_ball'].includes(prov.dataTier as string) || !safeText(prov.adapterVersion,60) || !validDate((prov.importedAtISO as string)?.slice(0,10)))
    throw new DatasetValidationError('Missing or invalid data provenance.');
  if (prov.kind !== 'synthetic_demo' && prov.permission !== 'user_supplied' && prov.permission !== 'authorized')
    throw new DatasetValidationError('Non-demo datasets require a valid user_supplied or authorized permission label.');
  const used = new Set<string>();
  for (const [i, entry] of d.appearances.entries()) {
    if (!entry || typeof entry !== 'object') throw new DatasetValidationError(`Match ${i+1}: expected an object.`);
    const a = entry as Record<string, unknown>;
    if (!safeText(a.matchId,100) || used.has(a.matchId)) throw new DatasetValidationError(`Match ${i+1}: missing or repeated matchId.`);
    used.add(a.matchId);
    if (!validDate(a.dateISO) || !formats.includes(a.format as string)) throw new DatasetValidationError(`Match ${i+1}: invalid dateISO or format.`);
    if (!safeText(a.team,120) || !safeText(a.opponent,120)) throw new DatasetValidationError(`Match ${i+1}: missing teams.`);
    if (a.batting !== undefined) {
      const b = a.batting as Record<string, unknown>;
      if (!b || !count(b.runs) || !count(b.balls) || (b.position !== undefined && (!count(b.position) || (b.position as number) > 11)))
        throw new DatasetValidationError(`Match ${i+1}: batting runs/balls must be nonnegative integers.`);
    }
    if (a.bowling !== undefined) {
      const b = a.bowling as Record<string, unknown>;
      if (!b || !count(b.wickets) || !count(b.legalBalls) || !count(b.runsConceded) || (b.wickets as number) > 10)
        throw new DatasetValidationError(`Match ${i+1}: bowling values must be valid integers.`);
    }
    if (a.contextSamples!==undefined && (!Array.isArray(a.contextSamples)||a.contextSamples.length>1000)) throw new DatasetValidationError(`Match ${i+1}: invalid contextSamples array.`);
    if (a.splits!==undefined && (!Array.isArray(a.splits)||a.splits.length>1000)) throw new DatasetValidationError(`Match ${i+1}: invalid splits array.`);
    for (const s of (a.contextSamples ?? []) as Record<string, unknown>[]) {
      if (prov.dataTier !== 'ball_by_ball') throw new DatasetValidationError(`Match ${i+1}: pressure context requires ball_by_ball provenance.`);
      if (!s || !['pressure','routine'].includes(s.kind as string) || (s.phase!==undefined&&!['powerplay','middle','death'].includes(s.phase as string)) || s.verified !== true || !count(s.battingRuns) || !count(s.battingBalls) || (s.bowlingLegalBalls!==undefined&&!count(s.bowlingLegalBalls)) || (s.bowlingRunsConceded!==undefined&&!count(s.bowlingRunsConceded)))
        throw new DatasetValidationError(`Match ${i+1}: invalid context sample.`);
    }
    for (const s of (a.splits ?? []) as Record<string, unknown>[]) {
      if (!s || !['spin','pace','setting','chasing','home','away'].includes(s.kind as string) || s.verified !== true || !count(s.battingRuns) || !count(s.battingBalls))
        throw new DatasetValidationError(`Match ${i+1}: invalid verified split.`);
    }
  }
  // Strongly validate fields that are rendered; React escapes text. Adapters must maintain provenance.
  return JSON.parse(JSON.stringify(d)) as PlayerDataset;
}
