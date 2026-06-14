"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

export function PainSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-yealth-black"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/nature-pain-v2.png')",
          opacity: 0.5,
          mixBlendMode: "lighten",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0A0A0A 0%, rgba(10,10,10,0.96) 8%, rgba(10,10,10,0.78) 16%, rgba(10,10,10,0.30) 50%, rgba(10,10,10,0.78) 84%, rgba(10,10,10,0.96) 92%, #0A0A0A 100%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-r from-transparent via-yealth-gold/30 to-transparent"
        aria-hidden
      />

      <div className="section-pad relative z-10 mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <motion.h2
            {...fadeUp(0)}
            className="font-heading text-[28px] font-bold leading-[1.15] text-yealth-offwhite md:text-[44px]"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}
          >
            They sold you a lie called{" "}
            <span className="text-yealth-gold">
              &apos;work hard and you&apos;ll be fine.&apos;
            </span>
          </motion.h2>

          <motion.div
            {...fadeUp(0.1)}
            className="flex flex-col gap-6 font-body text-base text-yealth-offwhite/85 md:text-lg"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}
          >
            <p>
              You wake up. You work. You pay bills. And somehow there&apos;s still nothing left.
            </p>
            <p>
              You did what they told you. Study hard. Get a job. Be responsible. But the salary doesn&apos;t stretch, the prices keep climbing, and the future still feels like someone else&apos;s privilege.
            </p>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp(0.2)}
          className="mt-12 rounded-r-yealth border-l-[3px] border-yealth-mint p-6 backdrop-blur-md md:mt-16 md:p-8"
          style={{ backgroundColor: "rgba(52, 211, 153, 0.06)" }}
        >
          <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-yealth-mint">
            Reality check
          </p>
          <p className="mt-3 font-heading text-xl font-bold text-yealth-offwhite md:text-2xl">
            You&apos;re not lazy. The system just wasn&apos;t built for you to win.
          </p>
        </motion.div>
      </div>
    </section>
  );
}