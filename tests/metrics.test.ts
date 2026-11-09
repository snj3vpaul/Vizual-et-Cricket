import { describe,it,expect } from 'vitest';
import { buildReport, FORMULA_VERSION } from '../src/lib/metrics';
import { parseDataset } from '../src/lib/schema';
import { validateCricHeroesURL } from '../src/lib/sources';
import { demoDataset } from '../src/fixtures/demo';
const clone=<T,>(a:T):T=>JSON.parse(JSON.stringify(a)) as T;
describe('CricHeroes profile link safety',()=>{
 it('accepts only known HTTPS public profile patterns',()=>{
  expect(validateCricHeroesURL('https://cricheroes.in/player-profile/1234567/Aarav-Sen').ok).toBe(true);
  expect(validateCricHeroesURL('https://cricheroes.com/player-profile/1').ok).toBe(true);
 });
 it.each(['http://cricheroes.com/player-profile/123','https://cricheroes.com.evil.org/player-profile/123','https://127.0.0.1/player-profile/123','https://cricheroes.com/admin','https://username@cricheroes.com/player-profile/123','javascript:alert(1)'])('rejects unsafe URL %s',value=>{
  expect(validateCricHeroesURL(value).ok).toBe(false);
 });
});
describe('canonical data validation',()=>{
 it('accepts synthetic fixture',()=>expect(parseDataset(demoDataset).appearances).toHaveLength(32));
 it('rejects duplicate match IDs',()=>{const d=clone(demoDataset);d.appearances[1].matchId=d.appearances[0].matchId;expect(()=>parseDataset(d)).toThrow(/repeated/);});
 it('rejects malformed and negative scorecards',()=>{const d=clone(demoDataset);d.appearances[0].batting!.runs=-1;expect(()=>parseDataset(d)).toThrow(/nonnegative/);});
 it('rejects unsupported context provenance',()=>{const d=clone(demoDataset);d.provenance.dataTier='aggregate';expect(()=>parseDataset(d)).toThrow(/ball_by_ball/);});
 it('rejects malicious excess match count',()=>{const d=clone(demoDataset);d.appearances=Array.from({length:1001},()=>clone(demoDataset.appearances[0]));expect(()=>parseDataset(d)).toThrow(/1,000/);});
});
describe('metrics engine',()=>{
 const report=buildReport(demoDataset);
 it('is deterministic and versioned',()=>{expect(buildReport(demoDataset)).toEqual(report);expect(report.formulaVersion).toBe(FORMULA_VERSION);});
 it('never returns index outside 0–100',()=>{for(const m of Object.values(report.metrics)){if(m.score!==null)expect(m.score).toBeGreaterThanOrEqual(0);if(m.score!==null)expect(m.score).toBeLessThanOrEqual(100);}});
 it('produces a truthful count and ordered 80% forecast band',()=>{expect(report.matches).toBe(32);expect(report.runs).toBe(969);expect(report.wickets).toBe(36);expect(report.forecast!.lower).toBeLessThanOrEqual(report.forecast!.upper);});
 it('never fabricates real percentiles when source is imported',()=>{const d=clone(demoDataset);d.provenance.kind='user_import';d.provenance.permission='user_supplied';const imported=buildReport(d);expect(imported.metrics.consistency.percentile).toBeNull();expect(imported.overall).toBeNull();});
 it('gives insufficient pressure data for aggregate scorecards',()=>{const d=clone(demoDataset);d.provenance.dataTier='aggregate';d.appearances.forEach(a=>{delete a.contextSamples;delete a.splits;});const result=buildReport(d);expect(result.metrics.pressure.score).toBeNull();expect(result.metrics.pressure.status).toBe('insufficient_data');});
 it('keeps mixed formats separate',()=>{const d=clone(demoDataset);d.appearances[31].format='T10';const result=buildReport(d);expect(result.matches).toBe(31);expect(result.format).toBe('T20');});
 it('shows low sample without fabricating a zero',()=>{const d=clone(demoDataset);d.appearances=d.appearances.slice(0,7);const result=buildReport(d);expect(result.metrics.consistency.status).toBe('low_sample');expect(result.metrics.projection.score).toBeNull();expect(result.forecast).toBeNull();});
 it('does not crash on empty match history',()=>{const d=clone(demoDataset);d.appearances=[];const result=buildReport(d);expect(result.overall).toBeNull();expect(result.trajectory).toHaveLength(0);});
});
