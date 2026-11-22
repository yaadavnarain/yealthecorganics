import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReservationCta } from "./reservation-cta";
import { MembershipPerks } from "./membership-perks";
import styles from "./membership.module.css";
import { Footer } from "@/app/components/footer";
import { BrandEquation } from "@/app/components/yealth-equation";

export const metadata: Metadata = {
  title: { absolute: "Earn. Save. Live Well." },
  description: "Side hustles to help you meet the high cost of living. Support to grow your career or start a business.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "yealth Membership | Earn. Save. Live Well.",
    description: "Side hustles to help you meet the high cost of living. Support to grow your career or start a business.",
    url: "https://yealth.mu/membership",
  },
  twitter: {
    title: "yealth Membership | Earn. Save. Live Well.",
    description: "Side hustles to help you meet the high cost of living. Support to grow your career or start a business.",
  },
};

export default function MembershipPage() {
  return (
    <div className={styles.page}>
      <a href="#membership-content" className={styles.skip}>Skip to content</a>
      <header className={styles.header}>
        <Link href="/" aria-label="yealth home" className={styles.logo}>
          <Image src="/images/yealth-mark.png" alt="yealth" width={683} height={336} priority />
        </Link>
        {process.env.VERCEL_ENV !== "production" && <span className={styles.previewBadge}>Membership preview</span>}
      </header>

      <main id="membership-content">
        <section className={styles.hero} aria-labelledby="membership-heading">
          <div className={styles.heroAura} aria-hidden="true" />
          <h1 id="membership-heading" className={styles.headline}>
            <span className={styles.gold}>Earn.</span>{" "}<span>Save.</span>{" "}
            <span className={styles.mint}>Live Well.</span>
          </h1>
          <div className={styles.intro}>
            <p>Earn extra through side hustles.</p>
            <p>Grow your career or business.</p>
            <p>Save with discounts and deals.</p>
            <p>Eat well. Support your fitness.</p>
          </div>
          <ReservationCta />
          <div className={styles.heroRule} aria-hidden="true"><span>01 / 10</span><i /></div>
        </section>

        <BrandEquation />

        <MembershipPerks />

        <section className={styles.closing} aria-label="Reserve your membership">
          <p className={styles.termsNote}>* Terms &amp; Conditions Apply.</p>
          <ReservationCta />
        </section>
      </main>

      <Footer />
    </div>
  );
}
