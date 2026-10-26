import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReservationForm } from "./reservation-form";
import styles from "./reservation.module.css";

export const metadata: Metadata = {
  title: "Reserve My yealth Membership",
  description: "Reserve your interest in yealth Membership and tell us which perks matter most to you.",
  robots: { index: false, follow: false },
  openGraph: { title: "Reserve My yealth Membership", description: "Earn. Save. Live Well.", url: "https://membership.yealth.mu" },
  twitter: { card: "summary_large_image", title: "Reserve My yealth Membership", description: "Earn. Save. Live Well." },
};

export default function ReservePage() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#reservation">Skip to form</a>
      <header className={styles.header}>
        <Link href="https://yealth.mu/membership" aria-label="yealth Membership"><Image src="/images/yealth-mark.png" width={683} height={336} alt="yealth" priority /></Link>
        <Link href="https://yealth.mu/membership">View membership</Link>
      </header>
      <main className={styles.main} id="reservation">
        <h1 className="sr-only">Membership Reservation Form</h1>
        <ReservationForm />
      </main>
      <footer className={styles.footer}>
        <nav aria-label="Legal"><Link href="https://yealth.mu/terms">Terms of Use</Link><Link href="https://yealth.mu/privacy">Privacy Policy</Link></nav>
      </footer>
    </div>
  );
}
