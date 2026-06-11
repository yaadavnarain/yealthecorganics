"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { fadeUp } from "@/lib/motion";
import YealthFlywheel from "./YealthFlywheel";
import { AnimatedCounter } from "@/app/components/ui/animated-counter";

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
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-yealth-black"
    >
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[960px] flex-col items-center px-6 pt-32 pb-16 text-center md:px-8 md:pt-36 md:pb-20"
      >
        <motion.h1
          {...fadeUp(0)}
          className="font-heading text-[34px] font-bold leading-[1.1] text-yealth-offwhite md:text-[52px] xl:text-[60px]"
        >
          Financial Freedom for the Youth,{" "}
          <span className="text-yealth-gold">Zero Efforts</span>.
        </motion.h1>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-5 max-w-[620px] font-body text-base font-semibold text-yealth-offwhite/90 md:text-lg"
        >
          Become Financially Stable. Retire Early. Retire Your Parents. Build
          Generational Wealth. Build Your Legacy.
        </motion.p>

        <motion.div
          {...fadeUp(0.2)}
          className="mt-8 grid w-full max-w-[640px] grid-cols-3 gap-6 border-y border-yealth-offwhite/10 py-5"
        >
          <div>
            <div className="font-heading text-xl font-bold text-yealth-gold md:text-3xl">
              <AnimatedCounter end={16} prefix="Rs " suffix="M+" />
            </div>
            <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
              raised so far
            </div>
          </div>
          <div>
            <div className="font-heading text-xl font-bold text-yealth-gold md:text-3xl">
              <AnimatedCounter end={4000} suffix="+" />
            </div>
            <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
              people already in
            </div>
          </div>
          <div>
            <div className="font-heading text-xl font-bold text-yealth-gold md:text-3xl">
              <AnimatedCounter end={150} suffix="+" />
            </div>
            <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
              {"Gen Z & Millennials"}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="w-full max-w-[800px]">
          <YealthFlywheel />
        </motion.div>

        <motion.p
          {...fadeUp(0.35)}
          className="mt-4 font-body text-lg text-yealth-offwhite md:text-xl"
        >
          Become an agribusiness owner from just{" "}
          <span className="font-bold text-yealth-gold">Rs 1,288/month</span>.
        </motion.p>

        <motion.div {...fadeUp(0.4)} className="mt-7">
          <a
            href="#contact"
            className="gold-cta inline-flex items-center justify-center gap-2 rounded-yealth px-8 py-4 font-heading text-base"
          >
            Secure my spot
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </motion.div>

        <motion.p
          {...fadeUp(0.45)}
          className="mt-4 text-sm text-yealth-offwhite/50"
        >
          Free. No commitment. Takes 2 minutes.
        </motion.p>
      </motion.div>
    </section>
  );
}
