import type { Metadata } from "next";
import { Quicksand, Nunito } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FloatingCta } from "@/app/components/floating-cta";
import { AmbientParticles } from "@/app/components/ambient-particles";
import CookieConsent from "@/components/CookieConsent";
import ClarityAnalytics from "@/components/ClarityAnalytics";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "yealth. Financial Freedom for the Youth.",
  description:
    "A membership for young Mauritians that gives you access to business ownership and new ways to earn. Apply now.",
  metadataBase: new URL("https://yealth.mu"),
  openGraph: {
    title: "yealth. Financial Freedom for the Youth.",
    description:
      "A membership for young Mauritians that gives you access to business ownership and new ways to earn. Apply now.",
    url: "https://yealth.mu",
    siteName: "yealth",
    type: "website",
    locale: "en",
    // og:image comes from app/opengraph-image.tsx, which generates it at build
    // time. Listing it here as well would let the two disagree.
  },
  twitter: {
    card: "summary_large_image",
    title: "yealth. Financial Freedom for the Youth.",
    description:
      "A membership for young Mauritians that gives you access to business ownership and new ways to earn. Apply now.",
    // twitter:image comes from app/twitter-image.tsx.
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${quicksand.variable} ${nunito.variable}`}>
      <body className="font-body bg-yealth-black text-yealth-offwhite antialiased">
        <AmbientParticles />
        {children}
        <FloatingCta />
        <Analytics />
        <SpeedInsights />
        <CookieConsent />
        <ClarityAnalytics />
      </body>
    </html>
  );
}