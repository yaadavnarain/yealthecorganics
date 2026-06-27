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
        className="mx-auto flex max-w-[1200px] flex-col items-center px-6 py-8 text-center md:px-8 md:py-10"
      >
        <div className="font-heading text-5xl font-bold leading-none text-yealth-gold sm:text-7xl lg:text-8xl">
          <AnimatedCounter end={4500} suffix="+" />
        </div>
        <div className="mt-3 text-sm text-yealth-offwhite/60 md:text-base">
          youths believe in the project
        </div>
      </motion.div>
    </section>
  );
}
