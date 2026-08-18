"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import HeroFlywheel from "./HeroFlywheel";

// The hero is on screen at load, so entrances fire on mount (animate) rather
// than whileInView: fadeUp's -80px viewport margin never triggers for
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
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1100px] flex-col items-center gap-5 px-6 pt-[108px] pb-12 text-center md:gap-6 md:px-8 md:pb-10 md:pt-[132px] lg:pt-[108px] xl:pt-[120px]"
      >
        {/* Constrained to just over the natural width of "Financial Freedom"
            at each breakpoint (461.3 at md, 532.3 at xl) so the subheadline
            wraps on the headline's measure instead of overhanging it. The few
            px of headroom keep the headline on two lines if font metrics
            differ slightly elsewhere. Base is left alone: at 248px the
            subheadline would wrap to three lines on a phone. */}
        <div className="flex w-full max-w-[620px] flex-col gap-5 text-left md:max-w-[468px] md:gap-6 xl:max-w-[540px]">
          {/* The break is explicit, not natural: at 375, 390, 768 and 1024 the
              line would otherwise wrap after "for". Keeping the space before
              the <br /> leaves textContent as the unbroken sentence, so the
              accessible name is unchanged. */}
          <motion.h1
            {...heroFade(0)}
            className="font-heading text-[28px] font-bold leading-[1.1] text-yealth-gold md:text-[52px] xl:text-[60px]"
          >
            Financial Freedom{" "}
            <br />
            for the Youth
          </motion.h1>

          <motion.p
            {...heroFade(0.1)}
            className="font-body text-base font-semibold text-yealth-offwhite/90 md:text-lg"
          >
            Join the membership that gives you access to business ownership and
            new ways to earn.
          </motion.p>
        </div>

        {/* grow shrink-0, not flex-1: flex-1 sets flex-basis 0 and would let this
            wrapper compress below the animation on short viewports. grow starts
            at content size and absorbs the surplus, so the leftover height lands
            as air either side of the animation rather than as a band above the
            fold. The xl width is bounded by whatever height is left over, so a
            short wide laptop (1366x768) shrinks the animation instead of pushing
            the CTA off screen. 2.2567 is the 677/300 frame ratio; 532px is the
            fixed vertical furniture at xl (padding, headline, gaps, CTA).
            The two spacers split the surplus 3:1 above and below the graphic
            rather than the 50:50 that items-center gave, which pulls the button
            up towards the animation without pooling space beneath it. They live
            inside this wrapper because the outer column has a gap, so sibling
            spacers would each add another 24px of fixed furniture. */}
        <motion.div
          {...heroFade(0.2)}
          className="flex w-[100vw] max-w-none grow shrink-0 flex-col md:w-full md:max-w-[780px] lg:max-w-[600px] xl:max-w-[min(1100px,calc((100svh_-_532px)*2.2567))]"
        >
          <div className="grow-[3]" aria-hidden />
          <div className="shrink-0">
            <HeroFlywheel />
          </div>
          <div className="grow-[1]" aria-hidden />
        </motion.div>

        {/* The button and the under-line stay centred on the page at every
            width. The headline block above keeps its own left alignment. */}
        <div className="flex w-full max-w-[620px] flex-col items-center gap-5 md:gap-6">
          <motion.div {...heroFade(0.35)}>
            <a
              href="https://join.yealth.mu/securemyspot"
              target="_blank"
              rel="noopener noreferrer"
              className="gold-cta inline-flex items-center justify-center gap-2 rounded-yealth px-8 py-4 font-heading text-base md:px-10 md:py-5 md:text-lg"
            >
              Apply Now
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" aria-hidden />
            </a>
          </motion.div>

          <motion.p
            {...heroFade(0.4)}
            className="text-sm text-yealth-offwhite/50"
          >
            Free to apply. Takes 30 seconds.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
