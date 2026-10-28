import {neon} from '@neondatabase/serverless';
import {createHash} from 'node:crypto';
export function createFeedbackStore(connectionString, connect = neon) {
 const u=new URL(connectionString);
 if(!u.hostname.endsWith('.neon.tech')||u.username!=='membership_ingest'||u.pathname!=='/yealth_forms')throw Error('Restricted forms connection required');
 const sql=connect(connectionString);
 // Renew the deadline for each query, not once per cached handler.
 const options=()=>({fetchOptions:{cache:'no-store',signal:AbortSignal.timeout(10000)}});
 return {
  allow:async key=>(await sql.query('SELECT forms.website_feedback_rate_limit($1) AS allowed',[key],options()))[0]?.allowed===true,
  save:async(value,key)=>{
   const payload=JSON.stringify(value),hash=createHash('sha256').update(payload).digest('hex');
   try{return{id:(await sql.query('SELECT forms.save_website_feedback($1::uuid,$2,$3::jsonb) AS id',[key,hash,payload],options()))[0].id};}
   catch(e){if(e.code==='P0001'&&e.message==='IDEMPOTENCY_CONFLICT'){const conflict=Error('Changed request');conflict.code='IDEMPOTENCY_CONFLICT';throw conflict;}throw Error('Feedback storage failed');}
  }
 };
}
