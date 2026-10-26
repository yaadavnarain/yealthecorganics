import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Reserve My yealth Membership. Earn. Save. Live Well.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ReservationImage() {
  const logo = await readFile(join(process.cwd(), "public/images/yealth-logo-og.png"));
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "64px 72px", background: "#1d1c1f", color: "#fffff4", borderBottom: "12px solid #f5c842" }}>
      <img src={`data:image/png;base64,${logo.toString("base64")}`} width={350} height={63} alt="yealth" />
      <div style={{ display: "flex", flexDirection: "column", marginTop: 68, fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
        <span>Reserve My</span><span style={{ color: "#f5c842" }}>yealth Membership</span>
      </div>
      <div style={{ display: "flex", marginTop: 35, fontSize: 30, color: "#34d399" }}>Earn. Save. Live Well.</div>
    </div>, size,
  );
}
