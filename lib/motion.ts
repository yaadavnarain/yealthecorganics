'use client';

import type { Variants } from "motion/react";

/**
 * Global entrance: subtle rise + de-blur, fired once on scroll-into-view.
 * Pass a `delay` to stagger siblings (e.g. fadeUp(i * 0.1)).
 */
export const fadeUp = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 24, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }) as const;

/** Stagger container for grouped reveals. */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};
