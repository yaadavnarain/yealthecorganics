"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

export function FounderSection() {
  return (
    <section className="section-pad relative overflow-hidden bg-yealth-black">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/nature-founder-v2.png')",
          opacity: 0.45,
          mixBlendMode: "lighten",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0.55) 14%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.55) 86%, rgba(10,10,10,1) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(245, 200, 66, 0.14) 0%, rgba(245, 200, 66, 0.07) 35%, rgba(245, 200, 66, 0.025) 60%, transparent 80%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center md:px-8">
        <motion.div
          {...fadeUp(0)}
          className="mx-auto mb-8 h-[200px] w-[200px] overflow-hidden rounded-full border-2 border-yealth-gold/40 shadow-2xl shadow-yealth-black"
        >
          <Image
            src="/images/founder-muktish.jpeg"
            alt="Muktish, Founder and CEO of Yealth"
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </motion.div>
        <motion.h2
          {...fadeUp(0.1)}
          className="font-heading text-[22px] font-bold text-yealth-gold md:text-[36px]"
          style={{ textShadow: "0 2px 25px rgba(0,0,0,0.9)" }}
        >
          Building yealth is my life purpose. Not a business move. Not a side
          project. My life&apos;s work.
        </motion.h2>
        <motion.div
          {...fadeUp(0.2)}
          className="mt-8 flex flex-col gap-6 font-body text-base italic text-yealth-offwhite"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}
        >
          <p>
            I built this because I got tired of watching young people in
            Mauritius be told to wait for a future that was never coming.
          </p>
          <p>
            This is not a promise. This is a system. And I put my name, my face,
            and my reputation behind every part of it.
          </p>
        </motion.div>
        <motion.p {...fadeUp(0.3)} className="mt-10">
          <span
            className="font-heading text-lg font-bold text-yealth-gold"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}
          >
            Muktish
          </span>
          <br />
          <span
            className="font-body text-base text-yealth-offwhite/70"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}
          >
            Founder &amp; CEO
          </span>
        </motion.p>
      </div>
    </section>
  );
}