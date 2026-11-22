"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MEMBERSHIP_PERKS, GREEN_PERKS } from "@/lib/membership-perks.mjs";
import styles from "./membership.module.css";

// The price card and the ten perks, linked.
//
// Card ("guided"): a counter, the perk's name and a gold progress bar. It
// shows PT Work by default and on every scroll; only hovering a perk (or
// tapping one on a phone) shows that perk instead.
// Perks ("spotlight"): with a mouse, the perk under the pointer lights up, the
// others step back and a line draws above it. Nothing is dimmed on touch.
// Small screens: the card is not sticky there, so a slim strip carries the
// counter and the bar instead.
export function MembershipPerks() {
  const [active, setActive] = useState(0);
  // Scrolling always brings the card back to the first perk (PT Work).
  useEffect(() => {
    const reset = () => setActive(0);
    window.addEventListener("scroll", reset, { passive: true });
    return () => window.removeEventListener("scroll", reset);
  }, []);

  const total = MEMBERSHIP_PERKS.length;
  const count = `${String(active + 1).padStart(2, "0")} / ${total}`;
  const tone = GREEN_PERKS.has(MEMBERSHIP_PERKS[active].id) ? styles.mint : styles.gold;
  const fill = { transform: `scaleX(${(active + 1) / total})` };

  return (
    <section className={styles.membership} aria-labelledby="membership-title">
      <div className={styles.membershipIntro}>
        <div className={styles.pricePanel}>
          <div className={styles.panelMark} aria-hidden="true"><span /><span /><span /></div>
          <h2 id="membership-title">yealth Membership</h2>
          <p className={styles.price}>
            <strong>Rs 2,800</strong>{" "}one-time joining fee,{" "}
            <strong>Rs 2,800</strong>{" "}per month thereafter.
          </p>
          <div className={styles.panelBottom}>
            <Image src="/images/yealth-logo-og.png" alt="yealth" width={300} height={54} />
            <p className={styles.guide} aria-hidden="true">
              <span>{count}</span>
              <b className={tone}>{MEMBERSHIP_PERKS[active].title}</b>
            </p>
          </div>
          <div className={styles.guideBar} aria-hidden="true"><i style={fill} /></div>
        </div>
      </div>

      <div className={styles.perksColumn}>
        <div className={styles.guideStrip} aria-hidden="true">
          <p>
            <span>{count}</span>
            <b className={tone}>{MEMBERSHIP_PERKS[active].title}</b>
          </p>
          <div className={styles.guideBar}><i style={fill} /></div>
        </div>
        <ol className={styles.perks} onPointerLeave={() => setActive(0)}>
          {MEMBERSHIP_PERKS.map(({ id, title, description }, index) => (
            <li
              key={title}
              className={`${styles.perk} ${GREEN_PERKS.has(id) ? styles.perkMint : ""} ${index === active ? styles.perkActive : ""}`}
              // Mouse: hovering a perk shows it on the card. Touch: a tap does.
              onPointerMove={(event) => {
                if (event.pointerType === "mouse") setActive(index);
              }}
              onClick={() => setActive(index)}
            >
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3 className={GREEN_PERKS.has(id) ? styles.mint : styles.gold}>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
