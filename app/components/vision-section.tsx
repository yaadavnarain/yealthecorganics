"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { Glow } from "@/app/components/ui/glow";

export function VisionSection() {
  return (
    <section className="relative overflow-hidden">
      <Glow
        variant="teal"
        className="left-1/2 top-1/2 h-[140%] w-[100%] -translate-x-1/2 -translate-y-1/2"
      />
      <div className="section-pad relative z-10 mx-auto max-w-[1200px] px-6 md:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
        <motion.h2
          {...fadeUp(0)}
          className="font-heading text-[26px] font-bold text-yealth-offwhite md:text-[36px]"
        >
          What if you could{" "}
          <span className="text-yealth-gold">own a real business</span> for less
          than your monthly phone bill?
        </motion.h2>
        <motion.div
          {...fadeUp(0.1)}
          className="flex flex-col gap-6 font-body text-base text-yealth-offwhite/90"
        >
          <p>
            Not a side hustle. Not a scheme. A real farming business that earns
            for you every single month.
          </p>
          <p>
            And if you need money now, not later, there are ways to start earning
            immediately while your farm grows.
          </p>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
