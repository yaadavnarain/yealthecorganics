"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Rebuilt from the static source at _content/pricing-2026-08-09.html.
 *
 * Content is authoritative and carried across unchanged: no heading, program
 * description, price, month value, note or disclaimer is reworded, and the
 * quarterly tier data is reproduced exactly as written even where it diverges
 * from the monthly progression.
 *
 * Two defects in the source are corrected here, because they are defects and
 * not content. The programs section had been left outside the .wrap container
 * (a stray </div> closed it early), so it rendered full-viewport-width with no
 * gutter; it now sits in the same container as every other section. And the
 * CTA pointed at a dangling href="#apply" with no such id in the document; it
 * now goes to the site's standard apply destination.
 */

const APPLY_HREF = "https://join.yealth.mu/securemyspot";

/** Short program labels, as used inside the tier cards. */
const P = {
  fl: "Freelancer",
  cc: "Content Creator",
  ref: "Referral",
  aff: "Affiliate",
  gro: "Discounted Groceries (coming soon)",
  vb: "Vehicle Branding",
  bp: "Business Partner",
  cg: "Career Guidance",
  inc: "Incubator & Accelerator",
} as const;

interface Tier {
  name: string;
  price: string;
  /** Monthly equivalent, shown on the quarterly plan only. */
  equiv: string;
  salads: string;
  /** Empty string renders a reserved-height blank, keeping the cards aligned. */
  badge: string;
  /** Gold border: the source's .card.start, applied to `start` and `everything`. */
  highlight: boolean;
  now: string[];
  later: [program: string, when: string][];
}

interface Plan {
  note: string;
  per: string;
  tiers: Tier[];
}

const PLANS: Record<Mode, Plan> = {
  monthly: {
    note: "Pay as you go. Cancel any time.",
    per: "per month",
    tiers: [
      {
        name: "Standard",
        price: "Rs 2,240",
        equiv: "",
        salads: "8 salads a month",
        badge: "Start here",
        highlight: true,
        now: [P.fl, P.cc, P.ref, P.aff, P.gro],
        later: [
          [P.vb, "month 3"],
          [P.bp, "month 6"],
          [P.cg, "month 9"],
          [P.inc, "month 12"],
        ],
      },
      {
        name: "Plus",
        price: "Rs 4,480",
        equiv: "",
        salads: "16 salads a month",
        badge: "",
        highlight: false,
        now: [P.fl, P.cc, P.ref, P.aff, P.gro, P.vb],
        later: [
          [P.bp, "month 3"],
          [P.cg, "month 6"],
          [P.inc, "month 9"],
        ],
      },
      {
        name: "Premium",
        price: "Rs 6,720",
        equiv: "",
        salads: "24 salads a month",
        badge: "",
        highlight: false,
        now: [P.fl, P.cc, P.ref, P.aff, P.gro, P.vb, P.bp],
        later: [
          [P.cg, "month 3"],
          [P.inc, "month 6"],
        ],
      },
    ],
  },
  quarterly: {
    note: "One payment covers 3 months.",
    per: "for 3 months",
    tiers: [
      {
        name: "Standard",
        price: "Rs 6,720",
        equiv: "Rs 2,240 a month",
        salads: "8 salads a month",
        badge: "Start here",
        highlight: true,
        now: [P.fl, P.cc, P.ref, P.aff, P.gro, P.vb],
        later: [
          [P.bp, "month 3"],
          [P.cg, "month 6"],
          [P.inc, "month 9"],
        ],
      },
      {
        name: "Plus",
        price: "Rs 13,440",
        equiv: "Rs 4,480 a month",
        salads: "16 salads a month",
        badge: "",
        highlight: false,
        now: [P.fl, P.cc, P.ref, P.aff, P.gro, P.vb, P.bp],
        later: [
          [P.cg, "month 3"],
          [P.inc, "month 6"],
        ],
      },
      {
        name: "Premium",
        price: "Rs 20,160",
        equiv: "Rs 6,720 a month",
        salads: "24 salads a month",
        badge: "Everything, straight away",
        highlight: true,
        now: [P.fl, P.cc, P.ref, P.aff, P.gro, P.vb, P.bp, P.cg, P.inc],
        later: [],
      },
    ],
  },
};

type Mode = "monthly" | "quarterly";

interface Program {
  title: string;
  description: string;
}

const PROGRAMS: Program[] = [
  {
    title: "Freelancer Program",
    description:
      "After-hours paid work shifts, designed so you can earn outside the normal nine to five. No commitment, flexible shifts, no experience needed.",
  },
  {
    title: "Content Creator Program",
    description:
      "Make content for yealth and get paid per view. Faceless videos are allowed.",
  },
  {
    title: "Referral Program",
    description:
      "Introduce someone who joins, and you are paid for the introduction.",
  },
  {
    title: "Affiliate Program",
    description:
      "Promote yealth membership to your audience and earn commission on every sale.",
  },
  {
    title: "Discounted Groceries (coming soon)",
    description:
      "An online store built by yealth where everything is heavily discounted, thanks to our partner suppliers.",
  },
  {
    title: "Vehicle Branding Program",
    description:
      "Carry a yealth sticker on your own car and get paid every month for it.",
  },
  {
    title: "Business Partner Program",
    description:
      "We promote your products and services to our members. Extra leads, and high quality ones.",
  },
  {
    title: "Career Guidance Program",
    description:
      "A full map of your strengths, your weaknesses and what you are actually built for.",
  },
  {
    title: "Business Incubator & Accelerator",
    description:
      "We support you in turning your idea into a real business, with business education and coaching, a high quality market to promote to, and seed funding at the accelerator stage.",
  },
];

/** Shared container, matching the homepage sections. */
const WRAP = "mx-auto w-full max-w-[1200px] px-6 md:px-8";

const LABEL =
  "font-heading text-xs font-medium uppercase tracking-[1px] text-yealth-grey";

export function PricingSections() {
  const [mode, setMode] = useState<Mode>("monthly");
  const prefersReduced = useReducedMotion();

  // The page header sits directly under the fixed navbar at first paint, which
  // is exactly where fadeUp fails: its viewport margin of -80px never triggers
  // for elements within 80px of the fold, and the content stays at opacity 0.
  // That is the documented iPhone Safari failure in CLAUDE.md, and the reason
  // hero.tsx fires its own entrances on mount. Everything above the fold uses
  // this; everything below it uses fadeUp, which is proven on the homepage.
  const pageFade = (delay = 0) =>
    ({
      initial: prefersReduced
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y: 24, filter: "blur(6px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: prefersReduced
        ? ({ duration: 0 } as const)
        : ({ duration: 0.7, delay, ease: "easeOut" } as const),
    }) as const;

  // fadeUp is whileInView. Under reduced motion that leaves a JS-driven
  // animation running, which the blanket CSS rule in globals.css cannot stop,
  // so fall back to the mount-fire helper at zero duration instead.
  const scrollFade = (delay = 0) =>
    prefersReduced ? pageFade(0) : fadeUp(delay);

  const plan = PLANS[mode];

  return (
    <>
      {/* Header */}
      <section className={cn(WRAP, "pb-2 pt-[104px] md:pt-[136px]")}>
        <motion.h1
          {...pageFade(0)}
          className="mb-3 font-heading text-[32px] font-bold leading-[1.2] text-yealth-gold md:text-[44px]"
        >
          yealth Membership
        </motion.h1>
        <motion.p
          {...pageFade(0.1)}
          className="max-w-[46ch] font-body text-lg text-yealth-offwhite"
        >
          Farm-to-table ready-to-eat salads delivered to your home every week,
          and access to paid work and business opportunities.
        </motion.p>
      </section>

      {/* Pricing */}
      <section className={cn(WRAP, "pt-2")}>
        <motion.p
          {...pageFade(0.2)}
          className="mb-6 max-w-[34ch] font-heading text-xl font-bold leading-[1.35] text-yealth-offwhite"
        >
          Every plan opens all nine. Your plan decides how fast, never how much.
        </motion.p>

        <motion.div {...pageFade(0.3)}>
          <div
            role="group"
            aria-label="Payment frequency"
            className="mb-2 inline-flex rounded-yealth border border-yealth-offwhite/10 bg-yealth-black/40 p-1 backdrop-blur-sm"
          >
            <ToggleButton
              pressed={mode === "monthly"}
              onClick={() => setMode("monthly")}
            >
              Monthly
            </ToggleButton>
            <ToggleButton
              pressed={mode === "quarterly"}
              onClick={() => setMode("quarterly")}
            >
              Quarterly (3 months)
            </ToggleButton>
          </div>
          <p
            aria-live="polite"
            className="min-h-[21px] font-body text-sm text-yealth-grey"
          >
            {plan.note}
          </p>
        </motion.div>

        <div className="mx-auto mb-14 mt-7 grid max-w-[960px] grid-cols-1 gap-[14px] min-[900px]:grid-cols-3 min-[900px]:gap-6">
          {plan.tiers.map((tier, i) => (
            <motion.div key={tier.name} {...scrollFade(i * 0.08)} className="h-full">
              <TierCard
                tier={tier}
                per={plan.per}
                mode={mode}
                prefersReduced={Boolean(prefersReduced)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Programs. Inside the container, unlike the source. */}
      <section id="programs" className={cn(WRAP, "pb-2 pt-14")}>
        <motion.div {...scrollFade(0)} className={cn(LABEL, "mb-8")}>
          What you get access to
        </motion.div>
        <div className="grid grid-cols-1 gap-6 min-[720px]:grid-cols-2 min-[720px]:gap-x-12 min-[720px]:gap-y-8">
          {PROGRAMS.map((program, i) => (
            <motion.div key={program.title} {...scrollFade(0.1 + i * 0.06)}>
              <h3 className="mb-1 font-heading text-lg font-bold text-yealth-gold">
                {program.title}
              </h3>
              <p className="font-body text-yealth-offwhite">
                {program.description}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.p
          {...scrollFade(0.2)}
          className="mt-7 font-body text-[13px] text-yealth-grey"
        >
          Terms and conditions apply to each program.
        </motion.p>
      </section>

      {/* Strip */}
      <div className="mt-14 border-y border-yealth-offwhite/10 py-7">
        <div className={WRAP}>
          <motion.p
            {...scrollFade(0)}
            className="max-w-[60ch] font-body text-yealth-offwhite"
          >
            <strong className="font-heading font-bold text-yealth-offwhite">
              Every plan opens the same doors.
            </strong>{" "}
            Higher plans get there sooner.
          </motion.p>
        </div>
      </div>

      {/* Close. id="contact" suppresses the global floating Apply Now while this
          section is on screen, so it never overlaps the page's own CTA. */}
      <section id="contact" className={cn(WRAP, "pb-[88px] pt-16")}>
        <motion.p
          {...scrollFade(0)}
          className="mb-7 max-w-[26ch] font-heading text-[26px] font-bold leading-[1.35] text-yealth-offwhite md:text-[32px]"
        >
          First we ease survival, then we slowly move to financial stability,
          followed by long-term financial freedom.
        </motion.p>
        <motion.div {...scrollFade(0.1)}>
          <a
            href={APPLY_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-cta inline-block rounded-yealth px-11 py-4 font-heading text-lg hover:-translate-y-0.5"
          >
            Apply Now
          </a>
          <p className="mt-3 font-body text-[13px] text-yealth-grey">
            Free to apply. Takes 30 seconds.
          </p>
        </motion.div>
      </section>
    </>
  );
}

function ToggleButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-yealth px-[18px] py-2.5 font-heading text-base font-medium transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yealth-mint",
        pressed
          ? "bg-yealth-gold font-bold text-yealth-black"
          : "text-yealth-grey hover:text-yealth-offwhite"
      )}
    >
      {children}
    </button>
  );
}

function TierCard({
  tier,
  per,
  mode,
  prefersReduced,
}: {
  tier: Tier;
  per: string;
  mode: Mode;
  prefersReduced: boolean;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-yealth border bg-yealth-black/40 px-5 py-[22px] backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-1",
        tier.highlight
          ? "border-yealth-gold/60 hover:border-yealth-gold hover:shadow-[0_0_30px_-10px_rgba(245,200,66,0.45)]"
          : "border-yealth-offwhite/10 hover:border-yealth-mint/40 hover:shadow-[0_0_30px_-10px_rgba(52,211,153,0.4)]"
      )}
    >
      <div className="min-h-[18px] font-heading text-xs font-medium uppercase tracking-[1px] text-yealth-gold">
        {tier.badge}
      </div>
      <h2 className="mt-2 font-heading text-lg font-bold text-yealth-offwhite">
        {tier.name}
      </h2>

      {/* Keyed on `mode`, so switching plan remounts this block and replays its
          entrance: the price and the card body rise and fade in rather than
          swapping instantly. Deliberately not AnimatePresence: mode="wait"
          holds the outgoing child until its exit resolves, and when that never
          resolved the incoming plan was never mounted at all, leaving the card
          frozen on the plan it first rendered with. */}
      <motion.div
        key={mode}
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.28, ease: "easeOut" }}
        className="flex flex-1 flex-col"
      >
        <div className="mt-1 font-heading text-[28px] font-bold leading-[1.2] text-yealth-offwhite">
          {tier.price}
        </div>
        <div className="font-body text-sm text-yealth-grey">{per}</div>
        {tier.equiv ? (
          <div className="mt-1 font-heading text-sm font-medium text-yealth-mint">
            {tier.equiv}
          </div>
        ) : null}

        <p className="mb-[18px] mt-3 font-body text-[15px] font-semibold text-yealth-offwhite">
          {tier.salads}
        </p>

        <div className={tier.later.length ? "mb-4" : ""}>
          <div className={cn(LABEL, "mb-2")}>Earning from day one</div>
          <ul>
            {tier.now.map((program) => (
              <li
                key={program}
                className="relative py-1.5 pl-[22px] font-body text-base font-semibold leading-[1.45] text-yealth-offwhite before:absolute before:left-0 before:top-[14px] before:h-2 before:w-2 before:rounded-full before:bg-yealth-gold before:content-['']"
              >
                {program}
              </li>
            ))}
          </ul>
        </div>

        {tier.later.length > 0 ? (
          <div className="border-t border-yealth-offwhite/10 pt-3.5 opacity-[0.72]">
            <div className={cn(LABEL, "mb-2")}>Opens as you go</div>
            <ul>
              {tier.later.map(([program, when]) => (
                <li
                  key={program}
                  className="relative py-1 pl-5 font-body text-[13px] leading-[1.45] text-yealth-grey before:absolute before:left-0 before:top-[11px] before:h-1.5 before:w-1.5 before:rounded-full before:border before:border-yealth-grey before:bg-transparent before:content-['']"
                >
                  {program}{" "}
                  <span className="font-semibold text-yealth-grey">
                    {when}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </motion.div>
    </article>
  );
}
