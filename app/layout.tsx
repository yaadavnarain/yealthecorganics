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
  title: "Yealth — Own a Farm in Mauritius",
  description:
    "Become a farm owner for Rs 1,288/mo. Monthly passive income, real assets, generational wealth.",
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