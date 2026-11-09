import type { Appearance, PlayerDataset } from '../lib/schema';
/** Entirely fictional fixture. Never describe these individuals or numbers as real. */
const battingRuns = [12,24,7,19,32,8,38,18,25,42,4,35,27,11,40,24,29,48,14,31,36,43,17,51,29,45,21,54,36,46,41,62];
const wickets = [1,0,1,2,0,1,1,2,0,1,1,2,0,2,1,1,2,0,2,1,2,0,1,2,1,1,2,1,0,2,1,2];
function buildDemo(offset = 0, name = 'Aarav Sen', id = 'demo-aarav'): PlayerDataset {
  const appearances: Appearance[] = battingRuns.map((v,i) => {
    const runs = Math.max(0, v + (offset ? (i % 4) * 2 - offset + (i > 24 ? -6 : 6) : 0));
    const balls = Math.max(4, Math.min(44, Math.round(runs / (1.1 + (i%5)*0.11) + 4)));
    const spinBalls = Math.floor(balls*0.46);
    const spinRuns = Math.floor(runs*0.38);
    return {
      matchId:`${id}-m-${String(i+1).padStart(2,'0')}`,
      dateISO:new Date(Date.UTC(2025,2,4+i*15)).toISOString().slice(0,10),
      format:'T20', team:'Harbour XI', opponent:['Parkside CC','North Star CC','Willow CC','Crescent XI'][i%4],
      stage: i===19 || i===31 ? 'final' : 'group',
      matchResult:i%3===0?'loss':'win', chasing:i%2===0,
      closeFinish:i%3===0 || i%7===0,
      batting:{runs,balls,position:i%4===0?3:5,fours:Math.floor(runs/9),sixes:Math.floor(runs/19),dismissed:i%5!==0},
      bowling:{wickets:wickets[(i+offset)%wickets.length],legalBalls:12+(i%4)*6,runsConceded:16+(i%6)*4,topOrderWickets:i%4===0?1:0},
      // Verified against the intentionally generated synthetic event scenario.
      contextSamples:[
        {kind:'pressure',phase:'death',battingRuns:2+i%6,battingBalls:2+i%4,bowlingRunsConceded:4+i%4,bowlingLegalBalls:6+(i%3)*3,wicketsTaken:i%5===0?1:0,verified:true,description:'Synthetic late-innings leverage situation'},
        {kind:'routine',phase:'middle',battingRuns:2+i%5,battingBalls:3+i%4,bowlingRunsConceded:4+i%5,bowlingLegalBalls:6+(i%3)*3,wicketsTaken:0,verified:true,description:'Synthetic regular-innings situation'}
      ],
      splits:[
        {kind:'spin',battingRuns:spinRuns,battingBalls:spinBalls,verified:true},
        {kind:'pace',battingRuns:runs-spinRuns,battingBalls:balls-spinBalls,verified:true},
        {kind:i%2===0?'chasing':'setting',battingRuns:runs,battingBalls:balls,verified:true}
      ]
    };
  });
  return {schemaVersion:'1.0',player:{id,displayName:name,role:'all_rounder',battingHand:'right'},appearances,provenance:{kind:'synthetic_demo',dataTier:'ball_by_ball',importedAtISO:'2026-11-08T00:00:00Z',adapterVersion:'demo-1.0.0',permission:'demonstration',warnings:['Fictional player and matches, generated for product illustration.']}};
}
export const demoDataset = buildDemo();
export const comparisonDemoDataset = buildDemo(8,'Devika Rao','demo-devika');
/** Simulated peer values may only be used for explicitly synthetic demos. */
export function syntheticCohort(key: string): number[] {
  const offset = Array.from(key).reduce((a,c)=>a+c.charCodeAt(0),0);
  return Array.from({length:128},(_,i)=>{
    const noise = Math.sin((i+1)*2.399+offset)*0.34 + Math.cos((i+3)*1.163+offset)*0.25;
    return -2.5+(i/127)*5+noise;
  });
}
