import { NextRequest, NextResponse } from "next/server";

// HTTP Basic Auth gate for the off-grid solar calculator only. The matcher
// restricts this middleware to exactly two paths, so the rest of the site is
// never touched. Credentials come from env — no password in page source.

const NOINDEX = "noindex, nofollow";

function challenge(): NextResponse {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Yealth Solar Calculator", charset="UTF-8"',
      "X-Robots-Tag": NOINDEX,
    },
  });
}

// Length-aware, constant-time-ish comparison.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const PROTECTED = new Set(["/pvcalculatoroffgrid", "/tools/pvcalculator.html"]);

export function middleware(req: NextRequest) {
  // Defensive: anything the matcher lets through that isn't a protected path
  // passes untouched.
  if (!PROTECTED.has(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const user = process.env.PV_CALC_USER;
  const pass = process.env.PV_CALC_PASSWORD;

  // Fail closed if credentials were never configured.
  if (!user || !pass) {
    return new NextResponse("Calculator credentials are not configured.", {
      status: 503,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Basic ")) return challenge();

  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return challenge();
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return challenge();

  const givenUser = decoded.slice(0, sep);
  const givenPass = decoded.slice(sep + 1);

  if (safeEqual(givenUser, user) && safeEqual(givenPass, pass)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", NOINDEX);
    return res;
  }
  return challenge();
}

export const config = {
  matcher: ["/pvcalculatoroffgrid", "/tools/pvcalculator.html"],
};
