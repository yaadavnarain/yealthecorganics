import { ArrowUpRight } from "lucide-react";
import styles from "./membership.module.css";

// Approved public reservation hostname.
const RESERVATION_URL = "https://membership.yealth.mu";

export function ReservationCta() {
  return (
    <div className={styles.ctaGroup}>
      <a className={styles.cta} href={RESERVATION_URL}>
        Reserve My Membership <ArrowUpRight size={20} aria-hidden="true" />
      </a>
    </div>
  );
}
