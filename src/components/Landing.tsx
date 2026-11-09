'use client';
import Link from 'next/link';
import { useEffect,useState } from 'react';
import { ArrowRight, ArrowUpRight, TrendingUp, Radar, ChartNoAxesCombined, ShieldCheck, CircleHelp, Workflow, Target, Gauge, Pause, Play } from 'lucide-react';
import { LinkInput } from './LinkInput';
import { Sparkline } from './Charts';
import { TrackView } from './AnalyticsClient';
import { track } from '@vercel/analytics';
const slides=[
 {label:'FORM TREND',title:'See the direction, not just the average.',metric:'+25%',sub:'Illustrative rolling contribution',series:[11,19,12,24,20,31,27,43,39,52,48,62]},
 {label:'SCORE VARIATION',title:'Understand your reliable range.',metric:'14–38',sub:'Illustrative middle-half run range',series:[23,20,28,19,24,25,22,31,26,27,24,30]},
 {label:'ROLE SIGNAL',title:'Learn where your numbers fit.',metric:'80/100',sub:'Illustrative archetype similarity',series:[18,30,20,34,33,37,35,48,46,49,54,57]}
];
export function DemoTeaser(){
 const [active,setActive]=useState(0);const [paused,setPaused]=useState(false);
 useEffect(()=>{
  if(paused||typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const interval=window.setInterval(()=>setActive(x=>(x+1)%slides.length),5400);return()=>window.clearInterval(interval);
 },[paused]);
 const s=slides[active];
 return <div className="demo-teaser" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)}>
  <div><div className="kicker">Inside a player dossier</div><h3 className="section-heading" style={{marginTop:12}}>{s.title}</h3><p className="section-subtitle">One transparent view of a fictional player’s game. Switch between reports, then open the complete interactive example.</p>
    <div className="demo-tabs" role="group" aria-label="Illustrative demo previews">{slides.map((slide,i)=><button key={slide.label} className={`tab-dot ${i===active?'active':''}`} type="button" aria-label={`Show ${slide.label.toLowerCase()} preview`} aria-pressed={i===active} onClick={()=>setActive(i)}>{i+1}</button>)}<button type="button" className="tab-dot" aria-label={paused?'Resume automatic preview':'Pause automatic preview'} onClick={()=>setPaused(!paused)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></div>
    <Link className="button button-primary" href="/dossier/demo" onClick={()=>track('demo_opened')}>Explore full dossier <ArrowUpRight size={17}/></Link>
  </div>
  <div className="panel"><div className="preview-top"><span className="kicker">{s.label}</span><span className="pill pill-info">DEMO · SYNTHETIC</span></div><div className="metric-number" style={{color:'var(--action)'}}>{s.metric}</div><p className="text-muted" style={{margin:'0 0 25px',fontSize:13}}>{s.sub}</p><div className="preview-chart"><Sparkline series={s.series} label={`Fictional ${s.label.toLowerCase()} sparkline`}/></div><div className="preview-foot"><span>FORM / LAST 12</span><span>Formula version cm-1.0.0</span></div></div>
 </div>;
}
const features=[
 {n:'01',title:'Career progression',text:'Watch your contribution evolve across matches, not just seasons.',series:[12,16,14,26,23,33,39],icon:TrendingUp},
 {n:'02',title:'Pressure patterns',text:'Compare verified high-stakes situations with ordinary play.',series:[21,14,30,18,27,24,37],icon:Target},
 {n:'03',title:'Consistency',text:'Know the band of results you produce most often.',series:[25,23,27,24,26,25,28],icon:Gauge},
 {n:'04',title:'Momentum',text:'Spot emerging hot streaks without overreacting to one match.',series:[26,14,22,29,20,41,50],icon:ChartNoAxesCombined},
 {n:'05',title:'Role fitment',text:'See the cricket archetypes your observed output resembles.',series:[30,35,31,40,42,48,50],icon:Radar},
 {n:'06',title:'Projected ranges',text:'See honest, uncertainty-aware possibilities for what comes next.',series:[25,22,36,29,40,35,44],icon:Workflow}
];
const faqs=[
 ['Does this connect directly to CricHeroes?','Not automatically at launch. CricHeroes terms prohibit scraping. We validate links, but a live profile import needs authorized access. You can inspect a clearly labeled synthetic demo or supply your own match dataset.'],
 ['Are the ratings psychological assessments?','No. Pressure and clutch metrics are estimates inferred from observable cricket events. They do not measure confidence, courage, nerve, or any personality trait.'],
 ['Are the predictions guaranteed?','No. A five-match projection is a historical-resampling range with uncertainty and eligibility rules. A player’s selection, role, opposition and conditions can change outcomes.'],
 ['What happens if my scorecard is incomplete?','We only calculate metrics supported by enough relevant events. Missing details are shown as Insufficient evidence; fewer than 10 relevant innings receive a low-sample warning.'],
 ['Will my private match data be published?','No. User-imported JSON is processed in your current browser session in this prototype. It cannot be publicly shared through a link. Real persistent reports will require explicit opt-in and a deletion mechanism.'],
 ['Can I compare myself to other cricketers?','There is a clearly labeled synthetic comparison demo. Real peer percentiles require a verified same-format, same-role reference cohort; they are not invented.']
];
export function LandingPage(){
 return <main><TrackView event="landing_view"/>
  <section className="hero"><div className="container hero-grid"><div className="hero-copy">
   <div className="kicker">PERFORMANCE INTELLIGENCE FOR EVERY CRICKETER</div>
   <h1>Know your game <em>better than the scoreboard</em> does.</h1>
   <p className="lead">Your best knock is more than a number. Discover the trends behind your game — progression, pressure patterns, consistency and what might come next.</p>
   <LinkInput/>
   <div className="trust-row"><span><ShieldCheck size={15}/> Explainable metrics</span><span><Target size={15}/> Real sample-size warnings</span><span><CircleHelp size={15}/> No signup to explore</span></div>
  </div><div className="preview-outer"><div className="preview-panel"><div className="preview-top"><span className="kicker">CRICKETMIND / PLAYER INTELLIGENCE</span><span className="pill pill-info">DEMO</span></div>
   <div className="preview-person"><div className="avatar" aria-hidden="true">AS</div><div><h3>Aarav Sen</h3><p>All-rounder · T20 · Fictional player</p></div></div>
   <div className="preview-stat-row"><div className="preview-stat"><strong>32</strong><small>Matches</small></div><div className="preview-stat"><strong>969</strong><small>Runs*</small></div><div className="preview-stat"><strong>36</strong><small>Wickets*</small></div></div>
   <div className="preview-top" style={{marginBottom:12}}><span className="kicker kicker-muted">CAREER TRAJECTORY</span><span className="pill pill-accent">↗ POSITIVE TREND</span></div>
   <div className="preview-chart"><Sparkline series={[10,16,11,24,19,31,21,38,30,43,42,59]} label="Illustrative fictional player career trajectory"/></div>
   <div className="preview-foot"><span>THE STORY BEHIND THE STATS</span><span>*Illustrative only</span></div>
  </div></div></div></section>
  <section className="section section-soft" id="preview"><div className="container"><div className="section-top"><div><div className="kicker">THE DIFFERENCE</div><h2>Numbers are just the beginning.</h2><p>From a scorecard to an honest, personal performance story.</p></div><span className="pill pill-info">ALL EXAMPLES ARE SYNTHETIC</span></div><DemoTeaser/></div></section>
  <section className="section" id="features"><div className="container"><div className="section-top"><div><div className="kicker">THE TOOLKIT</div><h2>Six ways to see the bigger picture.</h2><p>Each view is transparent about what it measures, which evidence supports it and what remains unknown.</p></div><Link href="/dossier/demo" className="button button-secondary">See every metric <ArrowRight size={16}/></Link></div><div className="section-grid">{features.map(f=><article className="feature-card" key={f.n}><div className="feature-index"><span>/{f.n}</span><f.icon size={20}/></div><h3>{f.title}</h3><p>{f.text}</p><div className="feature-graphic"><Sparkline series={f.series} label={`Illustrative ${f.title.toLowerCase()} trend`}/></div></article>)}</div></div></section>
  <section className="editorial-band"><div className="container editorial-layout"><div className="kicker">BUILT FOR THE GAME BEYOND THE SPOTLIGHT</div><p className="editorial-statement">The Saturday afternoon fifty. The final-over spell. The quiet comeback. <span>Every club cricketer has a story worth examining.</span></p></div></section>
  <section className="section" id="how"><div className="container"><div className="section-top"><div><div className="kicker">HOW IT WORKS</div><h2>From match history to meaningful insight.</h2></div></div><div className="steps">
   <div className="step"><div className="step-number">01</div><h3>Bring your records</h3><p>Paste a CricHeroes link for validation or use a supported import. We won’t imply unauthorized access.</p></div>
   <div className="step"><div className="step-number">02</div><h3>Measure the patterns</h3><p>CricketMind normalizes formats, checks evidence and calculates what your data can actually support.</p></div>
   <div className="step"><div className="step-number">03</div><h3>Know your game</h3><p>Get an explainable dossier with accessible charts, useful ranges and the next meaningful action.</p></div>
  </div></div></section>
  <section className="section section-soft" id="faq"><div className="container"><div className="section-top"><div><div className="kicker">GOOD QUESTIONS</div><h2>Trust the method. Not just the number.</h2></div></div><div className="faq-stack">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
  <section className="section"><div className="container"><div className="final-cta"><div className="kicker">THE NEXT INNINGS</div><h2 className="section-heading">You played the matches.<br/>Discover the patterns.</h2><p className="section-subtitle" style={{marginBottom:26}}>Start with a profile link, import your own records, or explore our fully transparent fictional demonstration.</p><LinkInput compact/></div></div></section>
 </main>;
}
