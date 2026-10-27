import { timingSafeEqual } from 'node:crypto';
import { deliveryConfigured, drainDeliveries } from '@/lib/reservations/dispatch';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
async function respond(request:Request){
 const expected=process.env.CRON_SECRET,actual=request.headers.get('authorization');
 const noStore={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 const actualBytes=Buffer.from(actual||''),expectedBytes=Buffer.from(`Bearer ${expected||''}`);
 if(!expected||!actual||actualBytes.length!==expectedBytes.length||!timingSafeEqual(actualBytes,expectedBytes))return Response.json({message:'Unauthorized'},{status:401,headers:noStore});
 if(!deliveryConfigured())return Response.json({message:'Delivery unavailable'},{status:503,headers:noStore});
 try{return Response.json({processed:await drainDeliveries()},{headers:noStore});}
 catch{return Response.json({message:'Delivery deferred'},{status:503,headers:noStore});}
}
export const GET=respond;
export const POST=respond;
