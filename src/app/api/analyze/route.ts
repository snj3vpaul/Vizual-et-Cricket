import { NextResponse } from 'next/server';
import { validateCricHeroesURL } from '../../../lib/sources';
export async function POST(request:Request){
 try {
  if(Number(request.headers.get('content-length')??0)>2048)return NextResponse.json({code:'too_large',message:'This request is too large for a profile link.'},{status:413});
  const data=await request.json() as {url?:unknown};
  if(typeof data.url!=='string'||data.url.length>1024)return NextResponse.json({code:'invalid_url',message:'Provide a CricHeroes player profile URL.'},{status:400});
  const parsed=validateCricHeroesURL(data.url);
  if(!parsed.ok)return NextResponse.json({code:'invalid_url',message:parsed.message},{status:400});
  // Never fetch user-supplied links. CricHeroes public terms prohibit scraping.
  return NextResponse.json({code:'source_not_authorized',message:'Your profile link looks valid. Automatic CricHeroes ingestion is not enabled because a licensed data connection has not been established. You can import your own match records or explore a synthetic demonstration.',alternatives:{import:'/import',demo:'/dossier/demo'}},{status:422});
 } catch{return NextResponse.json({code:'invalid_request',message:'We could not read that request. Check the URL and try again.'},{status:400});}
}
