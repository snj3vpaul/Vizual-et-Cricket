import { ImageResponse } from 'next/og';
import { demoDataset } from '../../../fixtures/demo';
import { buildReport } from '../../../lib/metrics';
export const runtime='edge';
export const alt='MoreThanCricket synthetic demo player report — illustrative data, not a real cricket rating';
export const size={width:1200,height:630};
export const contentType='image/png';
const r=buildReport(demoDataset);
export default async function Image({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const demo=id==='demo';
 return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:64,background:'#09131B',color:'#F4F7F8',fontFamily:'Arial,sans-serif',justifyContent:'space-between',position:'relative'}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontSize:28,fontWeight:800,display:'flex',gap:4}}>MoreThan<span style={{color:'#A5F05B'}}>Cricket</span></div><div style={{padding:'10px 20px',borderRadius:60,border:'1px solid #4CC6EC',color:'#4CC6EC',fontSize:18}}>SYNTHETIC DEMO · NOT REAL DATA</div></div>
   <div style={{display:'flex',flexDirection:'column',gap:16}}><div style={{color:'#A5F05B',fontSize:20,letterSpacing:3,fontWeight:700}}>CRICKETMIND / PLAYER INTELLIGENCE</div><div style={{fontSize:75,fontWeight:800,letterSpacing:-3}}>{demo?r.player.displayName:'Report unavailable'}</div><div style={{fontSize:27,color:'#B9C5CF'}}>{demo?`${r.matches} T20 matches · ${r.runs} runs · ${r.wickets} wickets`:'No public report at this address'}</div></div>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}><div style={{display:'flex',flexDirection:'column',gap:8}}><div style={{fontSize:17,color:'#B9C5CF'}}>ILLUSTRATIVE INDEX / 100</div><div style={{fontSize:98,lineHeight:1,color:'#A5F05B',fontWeight:800}}>{demo?r.overall??'—':'—'}</div></div><div style={{fontSize:20,color:'#B9C5CF'}}>The scoreboard tells you what happened.<div style={{color:'#F4F7F8'}}>We reveal the patterns.</div></div></div>
  </div>,size);
}
