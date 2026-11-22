"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import styles from "./founder-section.module.css";

// The founder's statement, set as a manifesto. No photo backdrop: the page
// background runs straight through. The two things the company is not are
// struck out in gold (see the CSS module), so "My life's work." is the line
// left standing. The portrait sits in an offset gold frame with his name on a
// gold tag.
const STRUCK = ["Not a business move.", "Not a side project."];

export function FounderSection() {
  return (
    <section className="section-pad relative" aria-labelledby="founder-title">
      <div className="mx-auto grid max-w-[1060px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.25fr_1fr] md:gap-16 md:px-8">
        <motion.div {...fadeUp(0)} className="order-2 md:order-1">
          <h2 id="founder-title" className="font-heading font-bold">
            <span className="mb-3 block text-[17px] leading-[1.3] text-yealth-offwhite md:text-xl">
              Building yealth is my life purpose.
            </span>
            <span className="flex flex-col gap-1.5 text-[28px] leading-[1.12] md:text-[46px]">
              {STRUCK.map((line, index) => (
                <span key={line} className="relative w-fit text-yealth-offwhite/45">
                  {line}{" "}
                  <span aria-hidden className={`${styles.strike} ${index === 1 ? styles.second : ""}`} />
                </span>
              ))}
              <span className="mt-1 text-[1.22em] text-yealth-gold">
                My life&apos;s work.
              </span>
            </span>
          </h2>

          <div className="mt-7 flex max-w-[30rem] flex-col gap-3 font-body text-[17px] leading-[1.7] text-yealth-offwhite md:text-lg">
            <p>
              I built this because I got tired of watching young people in
              Mauritius be told to wait for a future that was never coming.
            </p>
            <p>
              <strong className="font-semibold">
                This is not a promise. This is a system.
              </strong>{" "}
              And I put my name, my face, and my reputation behind every part of
              it.
            </p>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="relative order-1 mx-auto w-[min(78%,280px)] md:order-2 md:w-full md:max-w-[330px]"
        >
          <div
            aria-hidden
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-[18px] border-2 border-yealth-gold"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-black shadow-2xl shadow-black/60">
            <Image
              src="/images/founder-muktish.jpeg"
              alt="Muktish, Founder and CEO of yealth"
              width={500}
              height={500}
              sizes="(min-width: 768px) 330px, 280px"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="absolute -left-3.5 bottom-6 rounded-lg bg-yealth-gold px-3.5 py-2 font-heading text-base font-bold leading-tight text-[#0a0a0a]">
            Muktish
            <span className="block font-body text-[13px] font-semibold">
              Founder and CEO
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
