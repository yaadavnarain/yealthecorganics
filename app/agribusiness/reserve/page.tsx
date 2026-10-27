import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReservationForm } from "./reservation-form";
import styles from "../../membership/reserve/reservation.module.css";

export const metadata: Metadata = {
  title: "Agribusiness Reservation Form",
  description: "Record your interest in an agribusiness and your monthly contribution potential.",
  robots: { index: false, follow: false },
  openGraph: { title: "Agribusiness Reservation Form", description: "Record your agribusiness interest.", url: "https://agribusiness.yealth.mu" },
  twitter: { card: "summary_large_image", title: "Agribusiness Reservation Form", description: "Record your agribusiness interest." },
};

export default function ReservePage() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#reservation">Skip to form</a>
      <header className={styles.header}>
        <Link href="https://yealth.mu/agribusiness" aria-label="yealth Agribusiness"><Image src="/images/yealth-mark.png" width={683} height={336} alt="yealth" priority /></Link>
        <Link href="https://yealth.mu/agribusiness">View agribusiness</Link>
      </header>
      <main className={styles.main} id="reservation">
        <h1 className="sr-only">Agribusiness Reservation Form</h1>
        <ReservationForm />
      </main>
      <footer className={styles.footer}>
        <nav aria-label="Legal"><Link href="https://yealth.mu/terms">Terms of Use</Link><Link href="https://yealth.mu/privacy">Privacy Policy</Link></nav>
      </footer>
    </div>
  );
}
