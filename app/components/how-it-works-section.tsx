"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

const STEPS = [
  {
    number: "01",
    title: "Secure your spot",
    description:
      "Fill in a short form. Free. No commitment. Takes 2 minutes.",
  },
  {
    number: "02",
    title: "Attend a live session",
    description:
      "Join a private webinar hosted by the founder. Get every detail. Ask every question.",
  },
  {
    number: "03",
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
          backgroundImage: "url('/images/nature-how-v2.png')",
          opacity: 0.42,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0.6) 14%, rgba(10,10,10,0.32) 50%, rgba(10,10,10,0.6) 86%, rgba(10,10,10,1) 100%)",
        }}
        aria-hidden
      />

      <div className="section-pad relative z-10 mx-auto max-w-[1200px] px-6 md:px-8">
        <motion.h2
          {...fadeUp(0)}
          className="mb-12 font-heading text-[26px] font-bold text-yealth-offwhite md:mb-20 md:text-[36px]"
          style={{
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          How It Works
        </motion.h2>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[44px] hidden h-px bg-gradient-to-r from-transparent via-yealth-gold/30 to-transparent md:block"
            aria-hidden
          />

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
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