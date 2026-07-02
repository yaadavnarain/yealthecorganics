"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { Glow } from "@/app/components/ui/glow";

const STEPS = [
  {
    number: "01",
    title: "Secure your spot",
    description:
      "Fill in a short form. Free. No commitment. Takes 30 seconds.",
  },
  {
    number: "02",
    title: "Watch the explanation",
    description:
      "You receive recorded video explanations. Watch them in your own time.",
  },
  {
    number: "03",
    title: "Attend a live session",
    description:
      "Once you're done, join a private webinar hosted by the founder. Get every detail. Ask every question.",
  },
  {
    number: "04",
    title: "Decide",
    description:
      "If it is for you, you are in. If not, no pressure. No follow-ups. No hard feelings.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-yealth-black"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/how-it-works-towers.jpeg')",
          opacity: 0.28,
        }}
        aria-hidden
      />
      {/* Mobile overlay — standard 7-stop. The mobile section is tall (steps
          stack), so the 0.78 mid-stops blend seamlessly. */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, #1D1C1F 0%, rgba(10,10,10,0.96) 8%, rgba(10,10,10,0.78) 16%, rgba(10,10,10,0.30) 50%, rgba(10,10,10,0.78) 84%, rgba(10,10,10,0.96) 92%, #1D1C1F 100%)",
        }}
        aria-hidden
      />
      {/* Desktop overlay — same 7-stop convention (solid #1D1C1F edges that
          dissolve into neighbours), lighter mid-stops so the cover image reads
          across the full, shorter desktop section instead of a band. */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, #1D1C1F 0%, rgba(10,10,10,0.94) 7%, rgba(10,10,10,0.45) 16%, rgba(10,10,10,0.32) 50%, rgba(10,10,10,0.45) 84%, rgba(10,10,10,0.94) 93%, #1D1C1F 100%)",
        }}
        aria-hidden
      />
      <Glow
        variant="teal"
        className="left-1/2 top-1/2 h-[140%] w-[110%] -translate-x-1/2 -translate-y-1/2"
      />

      <div className="section-pad relative z-10 mx-auto max-w-[1200px] px-6 md:px-8">
        <motion.h2
          {...fadeUp(0)}
          className="mb-12 font-heading text-[26px] font-bold text-yealth-offwhite md:mb-20 md:text-[36px]"
          style={{
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          How It <span className="text-yealth-mint">Works</span>
        </motion.h2>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[44px] hidden h-px bg-gradient-to-r from-transparent via-yealth-gold/30 to-transparent md:block"
            aria-hidden
          />

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
            {STEPS.map((step, i) => (
              <motion.article
                key={step.number}
                {...fadeUp(i * 0.12)}
                className="relative flex flex-col items-start"
              >
                <div className="relative mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-yealth-gold/30 bg-yealth-black">
                  <span className="font-heading text-3xl font-bold text-yealth-gold md:text-4xl">
                    {step.number}
                  </span>
                  <div
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-yealth-gold/10 blur-xl"
                    aria-hidden
                  />
                </div>

                <h3
                  className="font-heading text-xl font-bold text-yealth-offwhite md:text-2xl"
                  style={{ textShadow: "0 2px 15px rgba(0,0,0,0.7)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-3 font-body text-sm leading-relaxed text-yealth-offwhite/75 md:text-base"
                  style={{ textShadow: "0 2px 15px rgba(0,0,0,0.7)" }}
                >
                  {step.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}