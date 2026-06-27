"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { Glow } from "@/app/components/ui/glow";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0.3, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="pointer-events-none absolute -inset-x-[30%] -inset-y-[20%]"
        aria-hidden
      >
        <Glow variant="gold" className="inset-0" />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yealth-gold/40 to-transparent"
        aria-hidden
      />

      <div className="section-pad relative z-10 mx-auto max-w-[800px] px-6 text-center md:px-8">
        <motion.p
          {...fadeUp(0)}
          className="font-heading text-sm font-medium uppercase tracking-[0.2em] text-yealth-mint md:text-base"
        >
          The next step is yours
        </motion.p>

        <motion.h2
          {...fadeUp(0.1)}
          className="mt-6 font-heading text-[36px] font-bold leading-[1.05] text-yealth-offwhite md:text-[64px]"
        >
          Your agribusiness is{" "}
          <span className="text-yealth-gold">waiting.</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 font-body text-base text-yealth-offwhite/70 md:text-lg"
        >
          Every month you wait is another month someone else takes the spot. Lock in yours now.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="mt-10">
          <a
            href="https://tally.so/r/2EDOEV"
            target="_blank"
            rel="noopener noreferrer"
            className="gold-cta inline-flex items-center gap-2 rounded-yealth px-10 py-5 font-heading text-base md:text-lg"
          >
            Secure my spot
            <ArrowRight className="h-5 w-5" aria-hidden />
          </a>
          <p className="mt-5 font-body text-sm text-yealth-offwhite/50">
            Free. No commitment. Takes 30 seconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}