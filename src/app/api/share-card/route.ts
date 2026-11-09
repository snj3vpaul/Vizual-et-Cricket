import { demoDataset } from '../../../fixtures/demo';
import { buildReport } from '../../../lib/metrics';
const r=buildReport(demoDataset);
function xml(s:string){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
/** Downloadable, editable SVG social card; demo only until opt-in report persistence exists. */
export function GET(){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Fictional MoreThanCricket player report">
 <rect width="1200" height="630" fill="#09131B"/>
 <rect x="60" y="60" width="1080" height="510" rx="24" fill="#101E28" stroke="#30414D" stroke-width="2"/>
 <path d="M80 95H1120" stroke="#30414D"/><path d="M80 545H1120" stroke="#30414D"/>
 <text x="94" y="137" font-family="Arial,sans-serif" font-size="30" font-weight="800" fill="#F4F7F8">MoreThan<tspan fill="#A5F05B">Cricket</tspan></text>
 <rect x="790" y="102" width="310" height="45" rx="22" fill="#162934" stroke="#4CC6EC"/>
 <text x="945" y="132" font-family="Arial,sans-serif" font-size="16" font-weight="700" text-anchor="middle" fill="#4CC6EC">DEMO · SYNTHETIC DATA</text>
 <text x="94" y="234" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="3" fill="#A5F05B">CRICKETMIND · PLAYER INTELLIGENCE</text>
 <text x="94" y="331" font-family="Arial,sans-serif" font-size="78" font-weight="800" fill="#F4F7F8">${xml(r.player.displayName)}</text>
 <text x="94" y="389" font-family="Arial,sans-serif" font-size="26" fill="#B9C5CF">${r.matches} ${xml(r.format)} matches  ·  ${r.runs} runs  ·  ${r.wickets} wickets</text>
 <text x="94" y="485" font-family="Arial,sans-serif" font-size="22" fill="#B9C5CF">Illustrative index / 100</text>
 <text x="375" y="488" font-family="Arial,sans-serif" font-size="56" font-weight="800" fill="#A5F05B">${r.overall??'—'}</text>
 <text x="800" y="480" font-family="Arial,sans-serif" font-size="20" fill="#F4F7F8">Know your game better</text><text x="800" y="505" font-family="Arial,sans-serif" font-size="20" fill="#F4F7F8">than the scoreboard does.</text>
 <text x="95" y="565" font-family="Arial,sans-serif" font-size="15" fill="#91A4B0">FICTIONAL MATCHES &amp; DEMO PEER INDICES · FORMULA ${xml(r.formulaVersion)}</text>
 </svg>`;
 return new Response(svg,{headers:{'Content-Type':'image/svg+xml; charset=utf-8','Content-Disposition':'attachment; filename="morethancricket-demo-card.svg"','Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'}});
}
