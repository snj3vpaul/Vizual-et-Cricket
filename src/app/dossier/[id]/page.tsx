import type { Metadata } from 'next';
import Link from 'next/link';
import { Dossier } from '../../../components/Dossier';
import { demoDataset } from '../../../fixtures/demo';
import { buildReport } from '../../../lib/metrics';
const report=buildReport(demoDataset);
type Props={params:Promise<{id:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {id}=await params;
 if(id!=='demo')return {title:'Report unavailable',robots:{index:false,follow:false}};
 return {title:'Aarav Sen — Illustrative player dossier',description:'Explore a fictional player’s progression, pressure situations, consistency and next-five-match projection. Synthetic data only.',robots:{index:true,follow:true},openGraph:{title:'MoreThanCricket · Aarav Sen (Fictional demonstration)',description:'Cricket intelligence, illustrated with synthetic scorecard records.'}};
}
export default async function DossierPage({params}:Props){
 const {id}=await params;
 if(id==='demo')return <Dossier report={report} canShare/>;
 return <main className="container"><div className="centered-state"><div className="kicker">REPORT UNAVAILABLE</div><h1>There’s no public dossier at this address.</h1><p>Real imported records are private in this prototype. Public sharing will require explicit player consent and a configured persistence layer; we will never invent a report just because a URL was requested.</p><div className="report-actions"><Link className="button button-primary" href="/dossier/demo">Explore illustrative demo</Link><Link className="button button-secondary" href="/import">Import your match history</Link></div></div></main>;
}
