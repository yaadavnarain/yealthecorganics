import {createHash} from 'node:crypto';
import {createFeedbackHandler} from '@/lib/feedback/handler.mjs';
import {createFeedbackStore} from '@/lib/feedback/store.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
let handler:ReturnType<typeof createFeedbackHandler>|undefined;
async function respond(request:Request){
 try{
  const connection=process.env.MEMBERSHIP_DATABASE_URL;
  if(process.env.RESERVATION_STORAGE_MODE!=='neon'||!connection)throw Error('Not configured');
  handler??=createFeedbackHandler({store:createFeedbackStore(connection),mode:'live',allowedHosts:['websitefeedback1.yealth.mu','yealth.mu',process.env.VERCEL_URL,process.env.VERCEL_BRANCH_URL].filter(Boolean) as string[],signingSecret:createHash('sha256').update(`website-feedback-challenge:${connection}`).digest()});
  return await handler(request);
 }catch{return Response.json({message:'Feedback storage is unavailable. Nothing was saved. Please try again later.'},{status:503,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
}
export const GET=respond;
export const POST=respond;
