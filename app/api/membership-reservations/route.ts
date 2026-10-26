import { createReservationHandler } from "@/lib/reservations/handler.mjs";
import { createLocalTestStore } from "@/lib/reservations/local-store.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let handler: ReturnType<typeof createReservationHandler> | undefined;
let initialization: Promise<void> | undefined;

async function respond(request: Request) {
  // No public or production fallback. Configure a durable approved adapter first.
  if (process.env.RESERVATION_STORAGE_MODE !== "local-test" || process.env.VERCEL || !process.env.RESERVATION_TEST_DIR) {
    return Response.json({ message: "Live reservation storage is not connected. No details were saved." }, {
      status: 503, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
  try {
    initialization ??= (async () => {
      const store = await createLocalTestStore(process.env.RESERVATION_TEST_DIR!, process.cwd());
      handler = createReservationHandler({ store });
    })();
    await initialization;
    return handler!(request);
  } catch {
    return Response.json({ message: "Preview storage is unavailable. No details were saved." }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}

export const GET = respond;
export const POST = respond;
