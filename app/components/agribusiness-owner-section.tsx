"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { Glow } from "@/app/components/ui/glow";

export function AgribusinessOwnerSection() {
  return (
    <section className="relative overflow-hidden">
      <Glow
        variant="gold"
        className="left-1/2 top-1/2 h-[140%] w-[100%] -translate-x-1/2 -translate-y-1/2"
      />
      <div className="section-pad relative z-10 mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
          <motion.h2
            {...fadeUp(0)}
            className="font-heading text-[26px] font-bold leading-[1.15] text-yealth-gold md:text-[36px]"
          >
            Become an Agribusiness Owner
          </motion.h2>

          <motion.div
            {...fadeUp(0.1)}
            className="flex flex-col gap-6 font-body text-base text-yealth-offwhite/90 md:text-lg"
          >
            <p>
              Own a share of a real farm alongside other young Mauritians. The
              farm is owned and run by its owners. yealth is contracted to build
              and operate it.
            </p>
            <p>
              Open to all youth 18 to 35. Members hear first when a new farm
              opens.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
