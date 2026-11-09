'use client';
import { FormEvent, useId, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Link2, LoaderCircle } from 'lucide-react';
import { validateCricHeroesURL } from '../lib/sources';
import { track } from '@vercel/analytics';
export function LinkInput({compact=false}:{compact?:boolean}){
  const [value,setValue]=useState('');const [status,setStatus]=useState<'idle'|'loading'|'limited'>('idle');const [error,setError]=useState('');const errorId=useId();
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();const result=validateCricHeroesURL(value);
    if(!result.ok){track('source_link_rejected');setError(result.message);setStatus('idle');return;}
    track('source_link_submitted');setError('');setStatus('loading');
    try {
      const response=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:result.canonicalUrl})});
      const body=await response.json() as {message?:string};
      setError(body.message??'This source is not available for automatic analysis yet.');setStatus('limited');
    } catch{setError('We could not reach the analysis service. Try again or use the illustrative demo.');setStatus('idle');}
  }
  return <div className="link-form"><form onSubmit={submit} noValidate aria-label="Analyze a CricHeroes profile URL">
    <div className="form-box"><label className="form-input-wrap"><Link2 size={20} aria-hidden="true"/><span className="screenreader">CricHeroes player profile URL</span><input type="url" value={value} onChange={e=>{setValue(e.target.value);setError('');setStatus('idle');}} placeholder="https://cricheroes.com/player-profile/..." autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-invalid={!!error} aria-describedby={error?errorId:undefined}/></label>
      <button type="submit" className="button button-primary" disabled={status==='loading'}>{status==='loading'?<><LoaderCircle size={17} className="loading-spinner"/> Checking access</>:<>Analyze player <ArrowRight size={18}/></>}</button>
    </div>{error&&<div role="alert" id={errorId} className="error-text">{error}</div>}
  </form>
  {!compact&&<div className="form-note">URL validation is available. Automatic CricHeroes data access requires authorization.</div>}
  {status==='limited'&&<div className="notice notice-warning" style={{marginTop:14}}><strong>Next step:</strong> Use an authorized data export or explore a synthetic demonstration. <Link className="inline-link" href="/import">Import your records</Link>.</div>}
  <div className="form-fallback"><Link className="inline-link" href="/dossier/demo">Try the illustrated demo <ArrowRight size={14} style={{verticalAlign:'middle'}}/></Link><span className="text-muted" style={{fontSize:12}}>·</span><Link className="inline-link" href="/import">Import match data</Link></div>
  </div>;
}
