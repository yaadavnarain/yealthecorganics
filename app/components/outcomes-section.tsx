"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

const OUTCOMES = [
  "You become a co-owner of a real agribusiness. Open to all youth 18 to 35.",
  "You start earning outside your 9 to 5 job, through freelance work and creating content.",
  "You build a business of your own, with funding, training, mentorship and market access behind you.",
];

export function OutcomesSection() {
  return (
    <section className="section-pad mx-auto max-w-[1200px] px-6 md:px-8">
      <motion.h2
        {...fadeUp(0)}
        className="mb-10 font-heading text-[26px] font-bold text-yealth-offwhite md:mb-14 md:text-[36px]"
      >
        Where this <span className="text-yealth-mint">takes you</span>
      </motion.h2>

      <ol className="flex flex-col gap-6 md:gap-8">
        {OUTCOMES.map((text, i) => (
          <motion.li
            key={text}
            {...fadeUp(0.1 + i * 0.1)}
            className="flex items-start gap-5"
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-yealth-gold/30 bg-yealth-black font-heading text-lg font-bold text-yealth-gold"
              aria-hidden
            >
              {i + 1}
            </span>
            <p className="pt-2 font-body text-base text-yealth-offwhite/90 md:text-lg">
              {text}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
