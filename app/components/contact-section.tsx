"use client";

import { CheckCircle2, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { Glow } from "@/app/components/ui/glow";

const WHATSAPP_URL = "https://wa.me/23054523432";

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-yealth-black">
      <Glow
        variant="gold"
        className="-left-[35%] top-1/2 h-[140%] w-[110%] -translate-y-1/2"
      />

      <div className="section-pad relative z-10 mx-auto flex max-w-[680px] flex-col items-center px-6 text-center md:px-8">
        <motion.h2
          {...fadeUp(0)}
          className="font-heading text-[28px] font-bold text-yealth-gold md:text-[40px]"
        >
          Ready to own a farm?
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-4 font-body text-base text-yealth-offwhite/85 md:text-lg"
        >
          Message Muktish on WhatsApp and he will send you the next webinar
          link. He hosts it personally.
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="mt-9">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-cta inline-flex items-center justify-center gap-2.5 rounded-yealth px-8 py-4 font-heading text-base md:px-10 md:py-5 md:text-lg"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            Message Muktish on WhatsApp
          </a>
        </motion.div>

        <motion.ul
          {...fadeUp(0.3)}
          className="mt-10 flex flex-col items-start gap-4"
        >
          <li className="flex items-start gap-3 font-body text-sm text-yealth-offwhite/75 md:text-base">
            <Clock
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-yealth-mint"
              aria-hidden
            />
            <span>Takes 2 minutes. Free, no commitment.</span>
          </li>
          <li className="flex items-start gap-3 font-body text-sm text-yealth-offwhite/75 md:text-base">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-yealth-mint"
              aria-hidden
            />
            <span>Your details stay private. We never share, sell, or spam.</span>
          </li>
          <li className="flex items-start gap-3 font-body text-sm text-yealth-offwhite/75 md:text-base">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-yealth-mint"
              aria-hidden
            />
            <span>No follow-up calls unless you ask for one.</span>
          </li>
        </motion.ul>
      </div>
    </section>
  );
}
