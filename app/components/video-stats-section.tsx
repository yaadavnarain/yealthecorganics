"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { AnimatedCounter } from "@/app/components/ui/animated-counter";

// TODO: When the video is ready, set VIDEO_URL to the MP4 path
// (e.g., "/videos/muktish-explainer.mp4") and the player will swap in automatically.
const VIDEO_URL: string | null = null;

export function VideoStatsSection() {
  return (
    <section className="section-pad mx-auto max-w-[1200px] px-6 md:px-8">
      <motion.div
        {...fadeUp(0)}
        className="mb-10 text-center md:mb-14"
      >
        <h2 className="font-heading text-[26px] font-bold text-yealth-offwhite md:text-[36px]">
          Watch how it works in 60 seconds
        </h2>
        <p className="mt-3 font-body text-base text-yealth-offwhite/70 md:text-lg">
          Muktish explains the whole thing — no fluff, no fine print.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp(0.1)}
        className="relative mx-auto aspect-video w-full max-w-[900px] overflow-hidden rounded-yealth border border-yealth-offwhite/10 bg-yealth-black/40"
      >
        {VIDEO_URL ? (
          <video
            src={VIDEO_URL}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-yealth-black/60 to-yealth-black px-6 text-center">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(234,179,8,0)",
                  "0 0 0 12px rgba(234,179,8,0.1)",
                  "0 0 0 0 rgba(234,179,8,0)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-yealth-gold/30 bg-yealth-gold/5"
            >
              <div className="h-3 w-3 animate-pulse rounded-full bg-yealth-gold" />
            </motion.div>
            <p className="font-heading text-base font-bold uppercase tracking-wider text-yealth-gold md:text-lg">
              Video coming soon
            </p>
            <p className="max-w-[420px] font-body text-sm text-yealth-offwhite/60 md:text-base">
              Muktish is recording the full explainer this week. Secure your
              spot below to get notified when it&apos;s live.
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        {...fadeUp(0.2)}
        className="mt-12 grid grid-cols-3 gap-4 border-t border-yealth-offwhite/10 pt-10 md:gap-8"
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