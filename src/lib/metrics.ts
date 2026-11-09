import type { Appearance, PlayerDataset, Role } from './schema';
import { syntheticCohort } from '../fixtures/demo';

export const FORMULA_VERSION = 'cm-1.0.0';
export type MetricKey = 'progression'|'pressure'|'clutch'|'consistency'|'momentum'|'role'|'weakness'|'projection';
export type MetricStatus = 'ready'|'low_sample'|'insufficient_data'|'unsupported';
export interface Metric {
  key: MetricKey;
  title: string;
  score: number|null;
  percentile: number|null;
  status: MetricStatus;
  n: number;
  summary: string;
  formula: string;
  inputs: string;
  limitations: string;
  formulaVersion: string;
  evidence: string[];
}
export interface MatchPoint { matchId: string; dateISO: string; runs: number|null; wickets: number|null; contribution: number; running: number; }
export interface Report {
  player: PlayerDataset['player'];
  provenance: PlayerDataset['provenance'];
  formulaVersion: string;
  format: string;
  matches: number;
  battingInnings: number;
  runs: number;
  wickets: number;
  strikeRate: number|null;
  overall: number|null;
  coverage: number;
  metrics: Record<MetricKey,Metric>;
  trajectory: MatchPoint[];
  p25: number|null;
  p75: number|null;
  progressionPercent: number|null;
  acceleration: 'accelerating'|'slowing'|'steady'|'unavailable';
  forecast: { lower: number; upper: number; expected: number; level: string }|null;
  roleFits: {name:string; score:number}[];
  spinVsPace: {spin:number; pace:number; spinN:number; paceN:number}|null;
  splitComparisons: {key:string;name:string;leftLabel:string;rightLabel:string;leftSR:number;rightSR:number;leftN:number;rightN:number}[];
  situational: { pressure: number; routine: number; nPressure:number; nRoutine:number }|null;
  pressureTimeline: {matchId:string;dateISO:string;delta:number|null;kind:'up'|'down'|'unknown'}[];
  verdict: string;
}
const nearest5 = (n:number) => Math.round(n/5)*5;
const clamp = (n:number,min=0,max=100) => Math.max(min,Math.min(max,n));
const sum = (a:number[]) => a.reduce((acc,v)=>acc+v,0);
const avg = (a:number[]) => a.length?sum(a)/a.length:0;
function quantile(sorted:number[],p:number):number {
  if (!sorted.length) return 0;
  const pos=(sorted.length-1)*p, lo=Math.floor(pos), hi=Math.ceil(pos);
  return sorted[lo]+(sorted[hi]-sorted[lo])*(pos-lo);
}
const sorted = (a:number[]) => [...a].sort((a,b)=>a-b);
const formatRate = (n:number) => Math.round(n*10)/10;
function contribution(a:Appearance,role:Role):number {
  const bat = a.batting?.runs ?? 0;
  const bowl = a.bowling?.wickets ?? 0;
  // Declared role determines weights. These are descriptive demo composites, not equivalent-to-runs conversions.
  return role==='bowler'?bowl*12 + (a.bowling?.legalBalls? Math.max(-6, (7 - a.bowling.runsConceded*6/a.bowling.legalBalls)*2):0)
    :role==='all_rounder'? bat*0.65+bowl*12*0.35 :bat;
}
function rolling(data:number[],size:number):number[] {
  return data.map((_,i)=>avg(data.slice(Math.max(0,i-size+1),i+1)));
}
function seededUniform(seed:number):()=>number {
  let s=seed>>>0;
  return ()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296;};
}
function simulateNextFive(history:number[],count=1800):{lower:number;upper:number;expected:number} {
  const relevant=history.slice(-20); const rand=seededUniform(20261108+sum(relevant)*17);
  const weights=relevant.map((_,i)=>i+3); const total=sum(weights);
  function sample():number {const u=rand()*total;let acc=0;for(let i=0;i<weights.length;i++){acc+=weights[i];if(u<=acc)return relevant[i];}return relevant[relevant.length-1];}
  const sims=Array.from({length:count},()=>Array.from({length:5},sample).reduce((a,b)=>a+b,0));
  const order=sorted(sims);
  return {lower:nearest5(quantile(order,.1)),upper:nearest5(quantile(order,.9)),expected:nearest5(avg(sims))};
}
const texts:Record<MetricKey,{title:string;formula:string;inputs:string;limitations:string}> = {
  progression:{title:'Progression rate',formula:'Calculate a role-adjusted contribution per appearance; compare the latest five to the first five, and assess the slope. Index is a normalized relative change, not the probability of improvement.',inputs:'Dated, same-format runs, balls, wickets and declared player role.',limitations:'Opponent quality, batting position and playing conditions may change.'},
  pressure:{title:'Pressure index',formula:'Compare observed performance per ball during verified high-leverage and routine episodes, shrink small differences toward zero, and normalize within a comparable reference set.',inputs:'Verified ball-by-ball pressure flags, runs/balls and match context.',limitations:'A scoring-pattern proxy only. This cannot measure nerve, confidence or psychological toughness.'},
  clutch:{title:'Clutch rating',formula:'Evaluate documented contributions in close finishes, confirmed top-order wickets and economical situations relative to opportunities.',inputs:'Close-finish outcomes, verified role contributions and batter dismissal order.',limitations:'Not all pivotal moments appear in aggregate scorecards; opportunity and format matter.'},
  consistency:{title:'Consistency profile',formula:'Take the middle-half run range (25th–75th percentile), then measure robust dispersion relative to a player’s typical output.',inputs:'Same-format batting returns, excluding absent/did-not-bat records.',limitations:'A tight distribution can reflect limited opportunity rather than reliable ability.'},
  momentum:{title:'Momentum map',formula:'Compare the last five opportunity-adjusted appearances with the preceding five; show a five-match rolling curve.',inputs:'Chronologically ordered match contribution and match dates.',limitations:'A short run of form is not evidence of future causation.'},
  role:{title:'Role fitment',formula:'Compare observed strike rate, batting opportunity and wicket rate with transparent reference archetypes; exclude missing dimensions.',inputs:'Runs, balls faced, wickets, legal balls bowled, playing format.',limitations:'Archetypes are a descriptive fit, not team-selection advice.'},
  weakness:{title:'Strengths & gaps',formula:'Compare batting strike rates against explicitly verified spin and pace exposure; show a gap only when both sides are supported.',inputs:'Verified bowler-type splits with runs, balls and exposures.',limitations:'A gap does not imply an immutable weakness; surface and bowler quality vary.'},
  projection:{title:'Projected range',formula:'Use recency-weighted resampling from the last 20 same-format innings to simulate five upcoming scores; report central 80% predictive interval.',inputs:'At least 10 eligible dated batting innings; optional future context is not assumed.',limitations:'Results depend on selection, opportunities, opponents, venue and conditions; not a guarantee.'}
};
function makeMetric(dataset:PlayerDataset,key:MetricKey,n:number,z:number|null,summary:string,evidence:string[],minimum=5):Metric {
  const spec=texts[key];
  const valid=n>=minimum && z!==null && Number.isFinite(z);
  const low=valid && n<10;
  // These values are ONLY rendered for the explicitly identified synthetic dataset.
  const demo=dataset.provenance.kind==='synthetic_demo' && dataset.provenance.permission==='demonstration';
  const score = valid && demo ? clamp(nearest5(50+15*z!)) : null;
  const cohort = demo ? syntheticCohort(key) : [];
  const percentile = score!==null && cohort.length>=100 ? clamp(nearest5(cohort.filter(v=>v<=z!).length*100/cohort.length)) : null;
  return {
    key,title:spec.title,score,percentile,
    status:valid?(low?'low_sample':'ready'):'insufficient_data',n,
    summary:valid?summary:`Insufficient evidence — ${key==='pressure'?'verified ball-by-ball context is needed':key==='weakness'?'verified split data is needed':key==='projection'?'at least ten comparable batting innings are needed':'more comparable appearances are needed'}.`,
    formula:spec.formula,inputs:spec.inputs,limitations:spec.limitations,
    formulaVersion:FORMULA_VERSION,evidence:valid?evidence:[]
  };
}
export function buildReport(dataset:PlayerDataset):Report {
  const candidates=dataset.appearances.filter(a=>a.batting||a.bowling);
  const counts=new Map<string,number>();
  for(const a of candidates) counts.set(a.format,(counts.get(a.format)??0)+1);
  const format=[...counts.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0]??'UNKNOWN';
  // Never combine formats. Select the most represented format, show it openly.
  const aps=candidates.filter(a=>a.format===format).sort((a,b)=>a.dateISO.localeCompare(b.dateISO));
  const bats=aps.filter(a=>a.batting!==undefined);
  const bowls=aps.filter(a=>a.bowling!==undefined);
  const runs=bats.map(a=>a.batting!.runs);
  const totalRuns=sum(runs);
  const wickets=sum(bowls.map(a=>a.bowling!.wickets));
  const balls=sum(bats.map(a=>a.batting!.balls));
  const points=aps.map(a=>contribution(a,dataset.player.role));
  const wave=rolling(points,5);
  const trajectory=aps.map((a,i)=>({matchId:a.matchId,dateISO:a.dateISO,runs:a.batting?.runs??null,wickets:a.bowling?.wickets??null,contribution:formatRate(points[i]),running:formatRate(wave[i])}));
  const first5=avg(points.slice(0,5)),last5=avg(points.slice(-5));
  const pct=points.length>=5&&first5>0?(last5-first5)/first5*100:null;
  const acceleration=points.length>=15?((avg(points.slice(-5))-avg(points.slice(-10,-5)))-(avg(points.slice(5,10))-avg(points.slice(0,5)))):null;
  const accelerationStatus:Report['acceleration']=acceleration===null?'unavailable':acceleration>Math.max(3,first5*.2)?'accelerating':acceleration<-Math.max(3,first5*.2)?'slowing':'steady';
  const recent10=points.slice(-10);
  const momPct=recent10.length>=10&&avg(recent10.slice(0,5))>0
    ?(avg(recent10.slice(5))-avg(recent10.slice(0,5)))/avg(recent10.slice(0,5))*100:null;
  const range=sorted(runs), median=quantile(range,.5), absDeviations=sorted(runs.map(r=>Math.abs(r-median)));
  const mad=quantile(absDeviations,.5), p25=runs.length>=5?Math.round(quantile(range,.25)):null,p75=runs.length>=5?Math.round(quantile(range,.75)):null;
  const consistentZ = bats.length>=5 ? (0.5-mad/(median+5))/.3 : null;
  // Context observations are trustworthy only when the provider declares and verifies event-level provenance.
  const samples=dataset.provenance.dataTier==='ball_by_ball'
    ? aps.flatMap(a=>a.contextSamples??[]).filter(s=>s.verified):[];
  const press=samples.filter(s=>s.kind==='pressure'&&s.battingBalls>0);
  const routine=samples.filter(s=>s.kind==='routine'&&s.battingBalls>0);
  const pressRate=sum(press.map(s=>s.battingRuns))/Math.max(1,sum(press.map(s=>s.battingBalls)));
  const regularRate=sum(routine.map(s=>s.battingRuns))/Math.max(1,sum(routine.map(s=>s.battingBalls)));
  const pressureN=Math.min(press.length,routine.length);
  const pressureBowl=press.filter(s=>(s.bowlingLegalBalls??0)>0);
  const routineBowl=routine.filter(s=>(s.bowlingLegalBalls??0)>0);
  const econ=(ss:typeof press)=>6*sum(ss.map(s=>s.bowlingRunsConceded??0))/Math.max(1,sum(ss.map(s=>s.bowlingLegalBalls??0)));
  const bowlingDelta=routineBowl.length>=5&&pressureBowl.length>=5?(econ(routineBowl)-econ(pressureBowl))/2:null;
  const battingDelta=(pressRate-regularRate)/.45;
  const roleAdjustedPressure=dataset.player.role==='bowler'?bowlingDelta:dataset.player.role==='all_rounder' && bowlingDelta!==null ? .65*battingDelta+.35*bowlingDelta : battingDelta;
  const pressureZ=pressureN>=5 && roleAdjustedPressure!==null ? roleAdjustedPressure*pressureN/(pressureN+10) : null;
  const highStakes=aps.filter(a=>a.closeFinish || a.bowling?.topOrderWickets);
  const finishContrib=highStakes.filter(a=>a.closeFinish&&(a.batting?.runs??0)>=20).length;
  const topOrders=sum(aps.map(a=>a.bowling?.topOrderWickets??0));
  const phaseSample=press.filter(s=>(s.phase==='death'||s.phase==='powerplay')&&(s.bowlingLegalBalls??0)>=6);
  const economicalPhases=phaseSample.filter(s=>(s.bowlingRunsConceded??0)*6/Math.max(1,s.bowlingLegalBalls??0)<7).length;
  const clutchN=Math.max(highStakes.length,phaseSample.length);
  const clutchZ=clutchN>=5?((finishContrib+topOrders*.7+economicalPhases*.5)/Math.max(1,highStakes.length+phaseSample.length)-.4)*2:null;
  // Archetype fit represents transparent distance from reference vectors, not selection advice.
  const sr=balls>0?totalRuns/balls*100:0;
  const meanBalls=bats.length?balls/bats.length:0;
  const wicketRate=bowls.length?wickets/bowls.length:0;
  const archetypes=[
    {name:'Anchor',strike:108,balls:29,wickets:.1},
    {name:'Finisher',strike:160,balls:15,wickets:.1},
    {name:'Strike bowler',strike:75,balls:5,wickets:1.7},
    {name:'All-rounder',strike:132,balls:20,wickets:1.1}
  ];
  const roleFits = archetypes.map(a=>{
    const dims: number[]=[];
    if(bats.length>=5){dims.push((sr-a.strike)/65, (meanBalls-a.balls)/24);}
    if(bowls.length>=5)dims.push((wicketRate-a.wickets)/1.6);
    return {name:a.name,score:dims.length?nearest5(clamp(100-31*Math.sqrt(avg(dims.map(d=>d*d))))):0};
  }).sort((a,b)=>b.score-a.score);
  const roleZ=(roleFits[0]?.score??0)-65;
  const spin=aps.flatMap(a=>a.splits??[]).filter(s=>s.verified&&s.kind==='spin'&&s.battingBalls>0);
  const pace=aps.flatMap(a=>a.splits??[]).filter(s=>s.verified&&s.kind==='pace'&&s.battingBalls>0);
  const spinRate=100*sum(spin.map(s=>s.battingRuns))/Math.max(1,sum(spin.map(s=>s.battingBalls)));
  const paceRate=100*sum(pace.map(s=>s.battingRuns))/Math.max(1,sum(pace.map(s=>s.battingBalls)));
  const splitValid=spin.length>=5&&pace.length>=5;
  const splitKeys:[string,string,string][]=[['spin','pace','Bowler type'],['setting','chasing','Innings situation'],['home','away','Venue split']];
  const splitComparisons=splitKeys.flatMap(([left,right,name])=>{
    const l=aps.flatMap(a=>a.splits??[]).filter(s=>s.verified&&s.kind===left&&s.battingBalls>0);
    const rr=aps.flatMap(a=>a.splits??[]).filter(s=>s.verified&&s.kind===right&&s.battingBalls>0);
    if(l.length<5||rr.length<5)return [];
    return [{key:`${left}-${right}`,name,leftLabel:left==='setting'?'Setting a target':left==='home'?'Home':left==='spin'?'Vs spin':left,rightLabel:right==='chasing'?'Chasing':right==='away'?'Away':right==='pace'?'Vs pace':right,
      leftSR:formatRate(100*sum(l.map(s=>s.battingRuns))/sum(l.map(s=>s.battingBalls))),rightSR:formatRate(100*sum(rr.map(s=>s.battingRuns))/sum(rr.map(s=>s.battingBalls))),leftN:l.length,rightN:rr.length}];
  });
  const weaknessN=splitComparisons.length?Math.min(...splitComparisons.map(s=>Math.min(s.leftN,s.rightN))):0;
  const weaknessZ=splitComparisons.length?1-avg(splitComparisons.map(s=>Math.abs(s.leftSR-s.rightSR)))/40:null;
  const projection=runs.length>=10?simulateNextFive(runs):null;
  const roleName=roleFits[0]?.name??'Unclassified';
  const met:Record<MetricKey,Metric>={
    progression:makeMetric(dataset,'progression',aps.length,pct===null?null:pct/35,pct===null?'No trend yet':`Last five contributions are ${Math.abs(nearest5(pct))}% ${pct>=0?'higher':'lower'} than the opening five; the trend is ${accelerationStatus}.`,[`First five mean: ${formatRate(first5)} role-adjusted units`,`Last five mean: ${formatRate(last5)} role-adjusted units`,`Trend acceleration: ${accelerationStatus}`]),
    pressure:makeMetric(dataset,'pressure',pressureN,pressureZ,`In verified pressure episodes, scoring rate was ${formatRate(pressRate*100)} per 100 balls versus ${formatRate(regularRate*100)} in routine episodes.`,[`Verified pressure episodes: ${press.length}`,`Routine comparison episodes: ${routine.length}`]),
    clutch:makeMetric(dataset,'clutch',clutchN,clutchZ,`${finishContrib} batting contributions of 20+ in close finishes, ${topOrders} recorded top-order wickets and ${economicalPhases} verified short phase-spells below 7 RPO.`,[`Close-finish contributions (20+ runs): ${finishContrib}`,`Top-order wickets: ${topOrders}`,`Powerplay/death phase spells under 7 RPO: ${economicalPhases} of ${phaseSample.length}`]),
    consistency:makeMetric(dataset,'consistency',bats.length,consistentZ,`The middle half of recorded innings falls between ${p25} and ${p75} runs.`,[`Median: ${Math.round(median)} runs`,`Middle 50% range: ${p25}–${p75} runs`]),
    momentum:makeMetric(dataset,'momentum',recent10.length,momPct===null?null:momPct/30,momPct===null?'Not enough matches':`Recent five-match contribution is ${Math.abs(nearest5(momPct))}% ${momPct>=0?'above':'below'} the preceding five.`,[`Earlier five: ${formatRate(avg(recent10.slice(0,5)))}`,`Latest five: ${formatRate(avg(recent10.slice(5)))}`],10),
    role:makeMetric(dataset,'role',Math.min(bats.length,bowls.length)||Math.max(bats.length,bowls.length),dataset.provenance.kind==='synthetic_demo'&&roleFits[0]?(roleName==='Unclassified'?null:roleZ/20):null,dataset.provenance.kind==='synthetic_demo'?`The observed contribution most resembles the ${roleName.toLowerCase()} archetype.`:'Role fit is uncalibrated without a verified archetype cohort.',[`Strike rate: ${formatRate(sr)}`,`Wickets per bowling appearance: ${formatRate(wicketRate)}`],10),
    weakness:makeMetric(dataset,'weakness',weaknessN,weaknessZ,splitComparisons.length?`${splitComparisons.length} documented split comparison${splitComparisons.length===1?'':'s'} available. Review match opportunity and context before interpreting gaps.`:'No comparable verified split pairs available.',splitComparisons.map(x=>`${x.leftLabel}: ${x.leftSR} SR (n=${x.leftN}); ${x.rightLabel}: ${x.rightSR} SR (n=${x.rightN})`)),
    projection:makeMetric(dataset,'projection',runs.length,null,projection?`Central 80% range across the next five appearances: ${projection.lower}–${projection.upper} total runs.`:'Not enough innings to estimate the next-five range.',projection?[`Expected total: ~${projection.expected} runs`,`80% predictive interval: ${projection.lower}–${projection.upper}`]:[],10)
  };
  // A projected range is valid even if model reliability cannot be honestly scored.
  if(projection){met.projection.status=runs.length<20?'low_sample':'ready';met.projection.summary=`Next five-match total: ${projection.lower}–${projection.upper} runs (central 80% predictive interval).`;}
  const keys:MetricKey[]=['progression','pressure','clutch','consistency','momentum','role','weakness'];
  const available=keys.map(k=>met[k].score).filter((s):s is number=>s!==null);
  const overall=available.length>=3?nearest5(avg(available)):null;
  const coverage=[...keys,'projection' as MetricKey].filter(k=>met[k].status==='ready'||met[k].status==='low_sample').length;
  const progressionDirection=pct===null?'not yet clear':pct>5?'trending upward':pct < -5?'trending downward':'broadly stable';
  const consistencyStatement=p25!==null&&p75!==null?`The middle half of recorded batting returns sits between ${p25} and ${p75} runs.`:'There are not enough comparable batting scores for a reliable range.';
  const verdict=`Across ${aps.length} ${format} appearances, ${dataset.player.displayName}'s role-adjusted contribution is ${progressionDirection}. ${consistencyStatement} ${pressureN>=5?`Verified situational splits suggest a ${pressRate>regularRate?'higher':'lower'} scoring rate in defined pressure episodes, though this is a behavioral proxy only.`:'Pressure-context evidence remains insufficient.'} ${projection?`A historical-resampling illustration puts the next five-match batting total in a wide ${projection.lower}–${projection.upper} run range (central 80% predictive interval).`:''}`;
  const pressureTimeline=aps.map(a=>{
    const p=(a.contextSamples??[]).find(s=>s.kind==='pressure'&&s.verified&&s.battingBalls>0);
    const r=(a.contextSamples??[]).find(s=>s.kind==='routine'&&s.verified&&s.battingBalls>0);
    const valid=dataset.provenance.dataTier==='ball_by_ball'&&p&&r;
    const delta=valid ? (p.battingRuns/p.battingBalls-r.battingRuns/r.battingBalls)*100 : null;
    return {matchId:a.matchId,dateISO:a.dateISO,delta,kind:(delta===null?'unknown':delta>=0?'up':'down') as 'up'|'down'|'unknown'};
  });
  return {
    player:dataset.player,provenance:dataset.provenance,formulaVersion:FORMULA_VERSION,format,
    matches:aps.length,battingInnings:bats.length,runs:totalRuns,wickets,strikeRate:balls?formatRate(sr):null,
    overall,coverage,metrics:met,trajectory,p25,p75,progressionPercent:pct===null?null:nearest5(pct),acceleration:accelerationStatus,
    forecast:projection?{...projection,level:'80% predictive interval'}:null,
    roleFits,spinVsPace:splitValid?{spin:formatRate(spinRate),pace:formatRate(paceRate),spinN:spin.length,paceN:pace.length}:null,splitComparisons,
    situational:pressureN>=5?{pressure:formatRate(pressRate*100),routine:formatRate(regularRate*100),nPressure:press.length,nRoutine:routine.length}:null,
    pressureTimeline,
    verdict
  };
}
