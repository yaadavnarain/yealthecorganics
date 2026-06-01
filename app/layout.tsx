import type { Metadata } from "next";
import { Quicksand, Nunito } from "next/font/google";
import "./globals.css";
import { FloatingCta } from "@/app/components/floating-cta";
import { AmbientParticles } from "@/app/components/ambient-particles";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["700"],
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
  title: "Yealth — Become a Farm Owner in Mauritius",
  description:
    "Own a piece of a real farm in Mauritius. Monthly passive income, real assets, generational wealth. Join the next webinar.",
  metadataBase: new URL("https://yealth.mu"),
  openGraph: {
    title: "Yealth — Become a Farm Owner in Mauritius",
    description:
      "Own a piece of a real farm in Mauritius. Monthly passive income, real assets, generational wealth. Join the next webinar.",
    url: "https://yealth.mu",
    siteName: "Yealth",
    type: "website",
    locale: "en",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yealth — Become a Farm Owner in Mauritius",
    description:
      "Own a piece of a real farm in Mauritius. Monthly passive income, real assets, generational wealth. Join the next webinar.",
    images: ["/og-image.png"],
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
      </body>
    </html>
  );
}