import { createHmac } from 'node:crypto';
// Infrastructure adapter only. No route/schedule enabled before access approval.
export async function deliverBatch({store,endpoint,secret,fetcher=fetch,now=Date.now,batchSize=2}) {
  const url=new URL(endpoint);
  if(url.protocol!=='https:'||url.hostname!=='script.google.com'||!/^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname)||url.search||url.hash||!secret||secret.length<32)throw new Error('Invalid CRM configuration');
  const jobs=await store.claim(Math.min(2,Math.max(1,batchSize)));
  for(const job of jobs){
    let result='retry';
    try{
      const timestamp=now(),data=JSON.stringify(job.event),signature=createHmac('sha256',secret).update(timestamp+'.'+data).digest('hex');
      const response=await fetcher(url.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({timestamp,data,signature}),signal:AbortSignal.timeout(20000)});
      if(response.ok){const body=await response.json();if(body.sheet==='saved'&&['sent','review'].includes(body.alert))result=body.alert;}
    }catch{/* No personal data or secrets in logs; leave durable retry state. */}
    await store.finish(job.id,job.lease,result);
  }
  return jobs.length;
}
