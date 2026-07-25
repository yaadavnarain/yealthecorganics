"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

export function SolutionSection() {
  return (
    <section className="section-pad mx-auto max-w-[1200px] px-6 md:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
        <motion.h2
          {...fadeUp(0)}
          className="font-heading text-[26px] font-bold leading-[1.15] text-yealth-offwhite md:text-[36px]"
        >
          The system was not built for you to win on a salary alone.{" "}
          <span className="text-yealth-gold">So build outside it.</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="font-body text-base text-yealth-offwhite/90 md:text-lg"
        >
          yealth is a membership for young Mauritians who are done waiting. Real
          programs that pay, and a real path to owning productive assets as a
          business owner.
        </motion.p>
      </div>
    </section>
  );
}
