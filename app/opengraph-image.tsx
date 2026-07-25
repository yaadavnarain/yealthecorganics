import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Generated social preview card, 1200x630. Replaces the static /og-image.png
// that never existed, so shares stopped rendering with a blank preview.
//
// Colours are the brand tokens from tailwind.config.ts, copied as literals
// because satori cannot resolve Tailwind classes.
const GOLD = "#F5C842";
const MINT = "#34D399";
const BLACK = "#1D1C1F";
const OFFWHITE = "#FFFFF4";
const GREY = "#A0A0A0";

export const alt = "yealth. Financial Freedom for the Youth.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The wordmark, read off disk at module scope and inlined as a data URI so the
// render needs no network at build or request time. The source jpeg carries a
// 1px white frame and a wide flat surround, so the committed file here is a
// pre-trimmed 300x56 copy with the background made transparent. Transparency
// rather than a flat fill because the logo's own backdrop is #1D1D1F, one unit
// off the card's #1D1C1F, which would otherwise show as a faint rectangle.
const LOGO_DATA_URI = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "images", "yealth-logo-og.png"),
).toString("base64")}`;

/**
 * Quicksand is loaded through next/font/google for the site itself, which hands
 * back a CSS class rather than font data. satori needs the raw bytes, and there
 * is no copy of the file in the repo, so the only route to real brand glyphs is
 * a build-time fetch.
 *
 * Send no User-Agent. Google's css2 endpoint serves woff2 to anything it
 * recognises as a modern browser and satori cannot read woff2; with the header
 * absent it returns truetype, which satori can. Measured, not assumed: an IE11
 * User-Agent returns woff, no User-Agent returns truetype.
 *
 * Wrapped so a cold build with no network degrades to the font bundled with
 * @vercel/og rather than failing. The log line records which branch ran.
 */
async function loadHeadingFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Quicksand:wght@700",
    ).then((r) => r.text());

    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) {
      console.log("[og-image] font: FALLBACK (no truetype url in the css)");
      return null;
    }

    const data = await fetch(url).then((r) => r.arrayBuffer());
    console.log(`[og-image] font: Quicksand 700 loaded, ${data.byteLength} bytes`);
    return data;
  } catch (err) {
    console.log(`[og-image] font: FALLBACK (${(err as Error).message})`);
    return null;
  }
}

export default async function Image() {
  const heading = await loadHeadingFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BLACK,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA_URI} width={300} height={56} alt="" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              color: GOLD,
              letterSpacing: "-0.02em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>Financial Freedom</div>
            <div style={{ display: "flex" }}>for the Youth</div>
          </div>

          <div
            style={{
              marginTop: 36,
              fontSize: 32,
              color: OFFWHITE,
              display: "flex",
            }}
          >
            A membership for young Mauritians.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", width: 120, height: 6, background: MINT }} />
          <div style={{ display: "flex", marginLeft: 28, fontSize: 26, color: GREY }}>
            yealth.mu
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // Only pass `fonts` when the fetch actually produced data. Passing an
      // empty array overrides the font bundled with @vercel/og and satori then
      // throws "No fonts are loaded"; omitting the key falls back to it.
      ...(heading
        ? {
            fonts: [
              { name: "Quicksand", data: heading, weight: 700 as const, style: "normal" as const },
            ],
          }
        : {}),
    },
  );
}
