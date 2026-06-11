"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Path {
  title: string;
  description: string;
  accent: "gold" | "mint";
  cta: string;
  href: string;
  primary: boolean;
  badge?: string;
}

const PATHS: Path[] = [
  {
    title: "Own a Farm",
    description:
      "Start your farming business from Rs 1,288/mo. Build passive income and own real assets.",
    accent: "gold",
    cta: "Secure my spot",
    href: "#contact",
    primary: true,
    badge: "Most popular",
  },
  {
    title: "Earn Now",
    description:
      "Refer friends and family to Yealth. Earn for every person who joins through you. No farming, no work — just share.",
    accent: "mint",
    cta: "Become a partner",
    href: "#contact",
    primary: false,
  },
  {
    title: "Create & Earn",
    description:
      "For creators with an audience. Make content about Yealth, drive signups, earn from every referral your content brings in.",
    accent: "mint",
    cta: "Become a creator partner",
    href: "#contact",
    primary: false,
  },
];

export function ThreePathsSection() {
  return (
    <section className="section-pad mx-auto max-w-[1200px] px-6 md:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PATHS.map((path, i) => (
          <motion.article
            key={path.title}
            {...fadeUp(i * 0.1)}
            className={cn(
              "group relative flex h-full flex-col overflow-hidden rounded-yealth border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 md:p-8",
              path.primary
                ? "border-yealth-gold/40 bg-gradient-to-br from-yealth-gold/[0.08] to-yealth-black/60 shadow-[0_0_40px_-15px_rgba(234,179,8,0.5)] hover:border-yealth-gold/60 hover:shadow-[0_0_50px_-10px_rgba(234,179,8,0.6)] md:scale-[1.02]"
                : "border-yealth-offwhite/10 bg-yealth-black/40 hover:border-yealth-mint/40 hover:shadow-[0_0_30px_-10px_rgba(45,212,191,0.4)]"
            )}
          >
            {path.badge && (
              <div className="absolute right-4 top-4 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-yealth-gold/40 bg-yealth-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yealth-gold">
                <Sparkles className="h-3 w-3" aria-hidden />
                {path.badge}
              </div>
            )}

            <h3
              className={cn(
                "font-heading text-2xl font-bold md:text-3xl",
                path.primary && "pr-32 md:pr-36",
                path.primary
                  ? "text-yealth-gold"
                  : path.accent === "mint"
                    ? "text-yealth-mint"
                    : "text-yealth-offwhite"
              )}
            >
              {path.title}
            </h3>

            <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-yealth-offwhite/75 md:text-base">
              {path.description}
            </p>

            <a
              href={path.href}
              className={cn(
                "mt-8 inline-flex w-fit items-center gap-2 rounded-yealth px-5 py-3 font-heading text-sm font-bold transition-transform group-hover:translate-x-1",
                path.primary ? "gold-cta" : "teal-cta"
              )}
            >
              {path.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
