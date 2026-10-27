import { createReservationHandler } from "@/lib/reservations/handler.mjs";
import { createLocalTestStore } from "@/lib/reservations/local-store.mjs";
import { createNeonStore } from "@/lib/reservations/neon-store.mjs";
import { createHash } from "node:crypto";
import { scheduleDelivery } from '@/lib/reservations/dispatch';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

let handler: ReturnType<typeof createReservationHandler> | undefined;
let initialization: Promise<void> | undefined;

async function respond(request: Request) {
  const live = process.env.RESERVATION_STORAGE_MODE === "neon" && Boolean(process.env.MEMBERSHIP_DATABASE_URL);
  const local = process.env.RESERVATION_STORAGE_MODE === "local-test" && !process.env.VERCEL && Boolean(process.env.RESERVATION_TEST_DIR);
  if (!live && !local) {
    return Response.json({ message: "Live reservation storage is not connected. No details were saved." }, {
      status: 503, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
  try {
    initialization ??= (async () => {
      if (live) {
        const connection = process.env.MEMBERSHIP_DATABASE_URL!;
        const store = createNeonStore(connection);
        const allowedHosts = ["membership.yealth.mu", "yealth.mu", process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].filter(Boolean) as string[];
        handler = createReservationHandler({ store, mode: "live", allowedHosts,
          signingSecret: createHash("sha256").update(`membership-challenge:${connection}`).digest() });
      } else {
        const store = await createLocalTestStore(process.env.RESERVATION_TEST_DIR!, process.cwd());
        handler = createReservationHandler({ store });
      }
    })();
    await initialization;
    const response = await handler!(request);
    scheduleDelivery(request, response);
    return response;
  } catch {
    return Response.json({ message: "Preview storage is unavailable. No details were saved." }, {
      status: 503, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
}

export const GET = respond;
export const POST = respond;
