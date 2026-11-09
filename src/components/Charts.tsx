import type { MatchPoint } from '../lib/metrics';
export function Sparkline({series=[20,29,19,37,31,44,53],tone='action',label='Illustrative trend'}:{series?:number[];tone?:'action'|'info';label?:string}){
 const w=240,h=58,min=Math.min(...series)-4,max=Math.max(...series)+4;
 const p=series.map((v,i)=>`${i/(series.length-1)*w},${h-(v-min)/Math.max(1,max-min)*(h-4)-2}`).join(' ');
 return <svg viewBox="0 0 240 60" width="100%" height="60" role="img" aria-label={label}><polyline points={p} fill="none" stroke={`var(--${tone})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="240" cy={p.split(' ').at(-1)?.split(',')[1]} r="4" fill={`var(--${tone})`}/></svg>
}
export function TrajectoryChart({points,active=-1,small=false}:{points:MatchPoint[];active?:number;small?:boolean}){
 if(points.length===0)return <p className="text-muted">No comparable match history is available.</p>;
 const width=820,height=260,padL=42,padR=24,padT=19,padB=43;
 const values=points.map(p=>p.contribution),wave=points.map(p=>p.running);
 const max=Math.max(10,...values,...wave)*1.12;const min=Math.min(0,...values,...wave);
 const x=(i:number)=>padL+i/Math.max(1,points.length-1)*(width-padL-padR);
 const y=(v:number)=>padT+(max-v)/Math.max(1,max-min)*(height-padT-padB);
 const path=(v:number[])=>v.map((n,i)=>`${i?'L':'M'} ${x(i).toFixed(1)} ${y(n).toFixed(1)}`).join(' ');
 const current=active>=0?Math.min(points.length-1,active):points.length-1;
 const tickIds=[0,Math.floor((points.length-1)/3),Math.floor(2*(points.length-1)/3),points.length-1].filter((n,i,a)=>a.indexOf(n)===i);
 return <div className="chart-holder" style={{overflowX:'auto'}}><svg className={small?'':'wide-chart'} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Role-adjusted contribution across ${points.length} matches. Latest rolling value ${wave.at(-1)}; selected match ${current+1}.`} style={small?{maxHeight:190}:{minWidth:points.length>12?580:0}}>
  <title>Performance progression over time</title><desc>Muted lines are individual match contributions; brighter line is a five-match rolling average. Select an appearance using the slider below.</desc>
  {[0,.25,.5,.75,1].map(t=><g key={t}><line x1={padL} x2={width-padR} y1={padT+t*(height-padT-padB)} y2={padT+t*(height-padT-padB)} stroke="var(--outline)" strokeDasharray="3 6" opacity=".7"/><text x="34" y={padT+t*(height-padT-padB)+4} textAnchor="end" fontSize="12" fill="var(--text-tertiary)">{Math.round(max-(max-min)*t)}</text></g>)}
  {tickIds.map(i=><text key={i} x={x(i)} y={height-11} textAnchor={i===0?'start':i===points.length-1?'end':'middle'} fontSize="12" fill="var(--text-secondary)">{new Date(points[i].dateISO+'T00:00:00Z').toLocaleDateString('en',{month:'short',year:'2-digit',timeZone:'UTC'})}</text>)}
  <path d={path(values)} fill="none" stroke="var(--info)" strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="4 5" opacity=".65"/>
  <path d={path(wave)} fill="none" stroke="var(--action)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  <line x1={x(current)} x2={x(current)} y1={padT} y2={height-padB} stroke="var(--text-secondary)" strokeDasharray="5 5" opacity=".65"/>
  <circle cx={x(current)} cy={y(wave[current])} r="7" fill="var(--action)" stroke="var(--canvas)" strokeWidth="3"/>
 </svg></div>;
}
export function RoleRadar({roles}:{roles:{name:string;score:number}[]}){
 const w=300,c=150,r=110;
 const angles=roles.map((_,i)=>(-Math.PI/2)+i*2*Math.PI/roles.length);
 const points=(fraction:number)=>angles.map(a=>`${c+Math.cos(a)*r*fraction},${c+Math.sin(a)*r*fraction}`).join(' ');
 const actual=roles.map((d,i)=>`${c+Math.cos(angles[i])*r*d.score/100},${c+Math.sin(angles[i])*r*d.score/100}`).join(' ');
 return <svg viewBox={`0 0 ${w} ${w}`} width="100%" role="img" aria-label={`Archetype fits: ${roles.map(r=>`${r.name} ${r.score} out of 100`).join(', ')}. Illustrative model similarity, not a talent rating.`}>
  <title>Role archetype fit radar</title><desc>Four-axis spider chart; a text list with each score appears alongside.</desc>
  {[.25,.5,.75,1].map(v=><polygon key={v} points={points(v)} fill="none" stroke="var(--outline)" strokeWidth="1.5"/>)}
  {angles.map((a,i)=><line key={i} x1={c} y1={c} x2={c+Math.cos(a)*r} y2={c+Math.sin(a)*r} stroke="var(--outline)" strokeWidth="1"/>)}
  <polygon points={actual} fill="var(--action)" fillOpacity=".19" stroke="var(--action)" strokeWidth="3" strokeLinejoin="round"/>
  {angles.map((a,i)=><circle key={i} cx={c+Math.cos(a)*r*roles[i].score/100} cy={c+Math.sin(a)*r*roles[i].score/100} r="4.5" fill="var(--action)"/>)}
 </svg>;
}
export function VolatilityBand({p25,p75,median}:{p25:number|null;p75:number|null;median:number|null}){
 if(p25===null||p75===null||median===null)return <p className="text-muted">At least five comparable innings are needed for a score range.</p>;
 const end=Math.max(60,p75*1.45);const left=Math.min(100,p25/end*100);const width=Math.max(2,(p75-p25)/end*100);
 return <><div className="band" role="img" aria-label={`The middle half of innings scores ranges from ${p25} to ${p75} runs.`}><div className="band-fill" style={{left:`${left}%`,width:`${width}%`}}/><div className="band-dot" style={{left:`${Math.min(100,median/end*100)}%`}}/></div><div className="band-labels"><span>0 runs</span><span>Middle 50%: {p25}–{p75} runs</span><span>{Math.round(end)}+</span></div></>;
}
