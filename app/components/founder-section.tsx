"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { Glow } from "@/app/components/ui/glow";

export function FounderSection() {
  return (
    <section className="section-pad relative overflow-hidden bg-yealth-black">
      <div
        className="pointer-events-none absolute inset-0 bg-cover"
        style={{
          backgroundImage: "url('/images/founder-aqua.jpg')",
          backgroundPosition: "70% center",
          opacity: 0.38,
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
      <Glow
        variant="teal"
        className="left-1/2 top-1/2 h-[140%] w-[120%] -translate-x-1/2 -translate-y-1/2"
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