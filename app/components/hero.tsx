"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { fadeUp } from "@/lib/motion";
import YealthFlywheel from "./YealthFlywheel";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.5]);

  return (
    <section
      ref={heroRef}
      data-hero
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-yealth-black md:min-h-[90vh]"
    >
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[960px] flex-col items-center px-6 pt-24 pb-8 text-center md:px-8 md:pt-36 md:pb-20"
      >
        <motion.h1
          {...fadeUp(0)}
          className="font-heading text-[28px] font-bold leading-[1.1] text-yealth-offwhite md:text-[52px] xl:text-[60px]"
        >
          Financial Freedom for the Youth,{" "}
          <span className="text-yealth-gold">Zero Efforts</span>.
        </motion.h1>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-3 max-w-[620px] font-body text-base font-semibold text-yealth-offwhite/90 md:mt-5 md:text-lg"
        >
          Become Financially Stable. Retire Early. Retire Your Parents. Build
          Generational Wealth. Build Your Legacy.
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="w-full max-w-[280px] md:max-w-[800px]">
          <YealthFlywheel />
        </motion.div>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-2 font-body text-lg text-yealth-offwhite md:mt-4 md:text-xl"
        >
          Become an agribusiness owner from just{" "}
          <span className="font-bold text-yealth-gold">Rs 1,288/month</span>.
        </motion.p>

        <motion.div {...fadeUp(0.35)} className="mt-4 md:mt-7">
          <a
            href="#contact"
            className="gold-cta inline-flex items-center justify-center gap-2 rounded-yealth px-8 py-4 font-heading text-base"
          >
            Secure my spot
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </motion.div>

        <motion.p
          {...fadeUp(0.4)}
          className="mt-3 text-sm text-yealth-offwhite/50 md:mt-4"
        >
          Free. No commitment. Takes 2 minutes.
        </motion.p>
      </motion.div>
    </section>
  );
}
