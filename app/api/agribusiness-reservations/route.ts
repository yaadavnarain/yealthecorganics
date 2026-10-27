import { createAgribusinessHandler } from "@/lib/reservations/agribusiness-handler.mjs";
import { createAgribusinessStore } from "@/lib/reservations/agribusiness-store.mjs";
import { createHash } from "node:crypto";
import { scheduleDelivery } from '@/lib/reservations/dispatch';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
let handler: ReturnType<typeof createAgribusinessHandler> | undefined;

async function respond(request: Request) {
  try {
    const connection = process.env.MEMBERSHIP_DATABASE_URL;
    if (process.env.RESERVATION_STORAGE_MODE !== "neon" || !connection) throw new Error("Storage not connected");
    handler ??= createAgribusinessHandler({
      store: createAgribusinessStore(connection), mode: "live",
      allowedHosts: ["agribusiness.yealth.mu", "yealth.mu", process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].filter(Boolean) as string[],
      signingSecret: createHash("sha256").update(`agribusiness-challenge:${connection}`).digest(),
    });
    const response = await handler(request);
    scheduleDelivery(request, response);
    return response;
  } catch {
    return Response.json({ message: "Reservation storage is unavailable. No details were saved." }, {
      status: 503, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
}
export const GET = respond;
export const POST = respond;
