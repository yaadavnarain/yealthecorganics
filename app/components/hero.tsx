"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import YealthFlywheel from "./YealthFlywheel";

// The hero is on screen at load, so entrances fire on mount (animate) rather
// than whileInView — fadeUp's -80px viewport margin never triggers for
// elements sitting within 80px of the fold on short phone screens.
const heroFade = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 24, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }) as const;

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
      className="relative flex min-h-[100svh] overflow-hidden bg-yealth-black"
    >
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1100px] flex-col items-center justify-between px-6 pt-[76px] pb-4 text-center md:px-8 md:pt-[96px] md:pb-7"
      >
        <div className="flex flex-col items-center">
          <motion.h1
            {...heroFade(0)}
            className="font-heading text-[28px] font-bold leading-[1.1] text-yealth-offwhite md:text-[52px] xl:text-[60px]"
          >
            Financial Freedom for the Youth,{" "}
            <span className="text-yealth-gold">Zero Efforts</span>.
          </motion.h1>

          <motion.p
            {...heroFade(0.1)}
            className="mt-3 max-w-[620px] font-body text-base font-semibold text-yealth-offwhite/90 md:mt-4 md:text-lg"
          >
            Become Financially Stable. Retire Early. Retire Your Parents. Build
            Generational Wealth. Build Your Legacy.
          </motion.p>
        </div>

        <motion.div
          {...heroFade(0.2)}
          className="w-[94vw] max-w-none md:w-full md:max-w-[min(900px,calc(174vh-788px))] 2xl:max-w-[min(1000px,calc(174vh-788px))]"
        >
          <YealthFlywheel />
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.p
            {...heroFade(0.3)}
            className="font-body text-lg text-yealth-offwhite md:text-xl"
          >
            Become an agribusiness owner from just{" "}
            <span className="font-bold text-yealth-gold">Rs 1,288/month</span>.
          </motion.p>

          <motion.div {...heroFade(0.35)} className="mt-3 md:mt-4">
            <a
              href="#contact"
              className="gold-cta inline-flex items-center justify-center gap-2 rounded-yealth px-8 py-4 font-heading text-base"
            >
              Secure my spot
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </motion.div>

          <motion.p
            {...heroFade(0.4)}
            className="mt-2 text-sm text-yealth-offwhite/50 md:mt-3"
          >
            Free. No commitment. Takes 2 minutes.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
