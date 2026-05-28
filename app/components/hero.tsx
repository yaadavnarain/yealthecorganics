"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { fadeUp } from "@/lib/motion";
import HeroVideo from "./hero-video";
import { AnimatedCounter } from "@/app/components/ui/animated-counter";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0.3]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.5]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-yealth-black"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(34,197,94,0.08) 0%, rgba(10,10,10,0) 50%), radial-gradient(ellipse at bottom left, rgba(234,179,8,0.06) 0%, rgba(10,10,10,0) 50%)",
        }}
        aria-hidden
      />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 pt-32 pb-20 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-8 md:pt-40"
      >
        <div className="flex flex-col justify-center">
          <motion.h1
            {...fadeUp(0)}
            className="font-heading text-[40px] font-bold leading-[1.05] text-yealth-offwhite md:text-[64px]"
          >
            Become a farm owner for <span className="whitespace-nowrap text-yealth-gold">Rs 1,288/mo.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.1)}
            className="mt-6 max-w-[480px] font-body text-lg text-yealth-offwhite/85 md:text-xl"
          >
            Monthly Passive Income. Own Assets. Retire Early. Generational Wealth.
          </motion.p>

          <motion.div
            {...fadeUp(0.2)}
            className="mt-10 grid grid-cols-3 gap-6 border-y border-yealth-offwhite/10 py-6"
          >
            <div>
              <div className="font-heading text-2xl font-bold text-yealth-gold md:text-3xl">
                <AnimatedCounter end={16} prefix="Rs " suffix="M+" />
              </div>
              <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
                raised so far
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-yealth-gold md:text-3xl">
                <AnimatedCounter end={4000} suffix="+" />
              </div>
              <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
                people already in
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-yealth-gold md:text-3xl">
                <AnimatedCounter end={150} suffix="+" />
              </div>
              <div className="mt-1 text-xs text-yealth-offwhite/60 md:text-sm">
                {"Gen Z & Millennials"}
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.3)}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="gold-cta inline-flex items-center justify-center gap-2 rounded-yealth px-7 py-4 font-heading text-base"
            >
              Secure my spot
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-yealth border border-yealth-offwhite/20 px-7 py-4 font-heading text-base text-yealth-offwhite/90 transition hover:border-yealth-offwhite/40 hover:bg-yealth-offwhite/5"
            >
              See how it works
            </a>
          </motion.div>

          <motion.p
            {...fadeUp(0.4)}
            className="mt-4 text-sm text-yealth-offwhite/50"
          >
            Free. No commitment. Takes 2 minutes.
          </motion.p>
        </div>

        <motion.div
          {...fadeUp(0.2)}
          style={{ y: videoY }}
          className="relative mx-auto w-full max-w-[420px] md:mx-0 md:max-w-none"
        >
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-yealth bg-black shadow-2xl shadow-yealth-gold/10">
            <HeroVideo />
          </div>
          <motion.div
            style={{ y: glowY, opacity: glowOpacity }}
            animate={{
              scale: [1.05, 1.12, 1.05],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-0 -z-10 rounded-yealth bg-yealth-gold/10 blur-3xl"
            aria-hidden
          />
        </motion.div>
      </motion.div>
    </section>
  );
}