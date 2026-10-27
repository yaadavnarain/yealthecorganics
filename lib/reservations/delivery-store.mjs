import {neon} from '@neondatabase/serverless';
export function createDeliveryStore(connectionString){
 const u=new URL(connectionString);
 if(!u.hostname.endsWith('.neon.tech')||u.username!=='forms_delivery'||u.pathname!=='/yealth_forms')throw new Error('Restricted delivery connection required');
 const sql=neon(connectionString,{fetchOptions:{cache:'no-store',signal:AbortSignal.timeout(10000)}});
 return {claim:limit=>sql`SELECT * FROM forms.claim_deliveries(${limit})`,finish:(id,lease,result)=>sql`SELECT forms.finish_delivery(${id}::uuid,${lease}::uuid,${result})`};
}
