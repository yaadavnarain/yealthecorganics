import { after } from 'next/server';
import { createDeliveryStore } from './delivery-store.mjs';
import { deliverBatch } from './delivery.mjs';

export function deliveryConfigured() {
  return Boolean(process.env.CRM_DELIVERY_DATABASE_URL && process.env.CRM_ENDPOINT && process.env.CRM_SIGNING_SECRET);
}
export async function drainDeliveries() {
  if (!deliveryConfigured()) throw new Error('Delivery not configured');
  return deliverBatch({store:createDeliveryStore(process.env.CRM_DELIVERY_DATABASE_URL!),endpoint:process.env.CRM_ENDPOINT!,secret:process.env.CRM_SIGNING_SECRET!});
}
export function scheduleDelivery(request: Request, response: Response) {
  if(request.method!=='POST'||response.status!==201||!deliveryConfigured()) return;
  // Runs after the saved-form response. Failed remote delivery cannot change it.
  after(async()=>{try{await drainDeliveries();}catch{/* Durable lease/backoff recovers; no PII logging. */}});
}
