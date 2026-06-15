"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { AnimatedCounter } from "@/app/components/ui/animated-counter";

// Slim full-width social-proof strip that sits directly under the hero.
// Stat content + styling carried over verbatim from the old video-stats
// section; only the wrapper is reframed as a trust bar (thin top/bottom
// dividers, slim vertical padding) instead of a full section.
export function StatsStrip() {
  return (
    <section className="border-y border-yealth-offwhite/10 bg-yealth-black">
      <motion.div
        {...fadeUp(0)}
        className="mx-auto grid max-w-[1200px] grid-cols-3 gap-4 px-6 py-8 md:gap-8 md:px-8 md:py-10"
      >
        <div className="text-center">
          <div className="font-heading text-2xl font-bold text-yealth-gold md:text-4xl">
            <AnimatedCounter end={26} prefix="Rs " suffix="M+" />
          </div>
          <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
            raised so far
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading text-2xl font-bold text-yealth-gold md:text-4xl">
            <AnimatedCounter end={4500} suffix="+" />
          </div>
          <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
            youth already in
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading text-2xl font-bold text-yealth-gold md:text-4xl">
            <AnimatedCounter end={225} suffix="+" />
          </div>
          <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
            Gen Z &amp; Millennials
          </div>
        </div>
      </motion.div>
    </section>
  );
}
