'use client';
import { ChangeEvent,useState } from 'react';
import Link from 'next/link';
import { FileJson, UploadCloud, ArrowRight, LockKeyhole, Download, Info } from 'lucide-react';
import { Dossier } from './Dossier';
import { buildReport, type Report } from '../lib/metrics';
import { DatasetValidationError, parseDataset } from '../lib/schema';
import { track } from '@vercel/analytics';
const MAX_FILE=2*1024*1024;
export function ImportClient(){
 const [report,setReport]=useState<Report|null>(null);const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 async function onFile(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];if(!file)return;
  setBusy(true);setError('');track('import_started');
  try{
   if(file.size>MAX_FILE)throw new DatasetValidationError('Files must be 2 MB or smaller.');
   if(!file.name.toLowerCase().endsWith('.json'))throw new DatasetValidationError('This prototype accepts canonical JSON files only.');
   const d=parseDataset(JSON.parse(await file.text()));
   // User uploads must never inherit claims of upstream authorization or become shareable.
   d.provenance={...d.provenance,kind:'user_import',permission:'user_supplied',sourceUrl:undefined};
   const result=buildReport(d);setReport(result);track('import_completed');
  }catch(err){setError(err instanceof Error?err.message:'We could not read this JSON file.');track('import_failed');}
  finally{setBusy(false);e.target.value='';}
 }
 if(report)return <><div className="container" style={{paddingTop:20}}><button className="button button-ghost" type="button" onClick={()=>setReport(null)}>← Return to import</button></div><Dossier report={report}/></>;
 return <main className="container" style={{padding:'60px 0 95px'}}><div className="kicker">PRIVATE INPUT / YOUR MATCH HISTORY</div><h1 className="display-heading" style={{maxWidth:790}}>Bring your own <span style={{color:'var(--action)'}}>scorecard data.</span></h1><p className="lead">Try the genuine calculation engine without relying on prohibited scraping. Your canonical JSON is analyzed within this browser session. The report is private and cannot be shared publicly.</p>
  <div className="report-grid report-grid--hero"><div className="import-drop"><UploadCloud size={42} color="var(--action)" aria-hidden="true"/><h2 style={{margin:0,fontSize:22}}>Select a JSON match dataset</h2><label htmlFor="dataset-file" className="screenreader">Choose a canonical cricket dataset JSON file</label><input id="dataset-file" type="file" accept="application/json,.json" onChange={onFile} disabled={busy}/><p className="text-muted" style={{fontSize:14,textAlign:'center'}}>Maximum 2 MB · Schema v1.0 · Up to 1,000 appearances</p>{busy&&<div className="pill pill-accent" role="status"><span className="loading-spinner"/> Computing verified metrics…</div>}{error&&<div role="alert" className="error-text">{error}</div>}</div>
    <div className="panel"><h3>How to structure your file</h3><p>Match records need date, format, player role, and observed batting/bowling returns. Situational calculations need separately verified event context. Missing fields are not zero.</p><div className="notice"><Info size={17} style={{verticalAlign:'middle'}}/> We provide a fully synthetic reference dataset to illustrate the expected schema.</div><div className="report-actions"><a href="/sample-dataset.json" download className="button button-secondary"><Download size={17}/> Download sample dataset</a><Link href="/dossier/demo" className="button button-outline">View the demo <ArrowRight size={17}/></Link></div></div>
  </div>
  <div className="report-grid" style={{marginTop:22}}><div className="notice"><LockKeyhole size={17} style={{verticalAlign:'middle'}}/> <strong>Privacy:</strong> Parsing and metric computation occur in your browser. The file is not sent to a server by this page.</div><div className="notice"><FileJson size={17} style={{verticalAlign:'middle'}}/> <strong>Authenticity:</strong> This is a user-provided dataset; claimed event details are not independently verified by MoreThanCricket.</div></div>
 </main>;
}
