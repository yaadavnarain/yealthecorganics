"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Precomputed monthly income at year-end for each plan (Rs) — shares-per-farm
// + auto-upgrade + reinvestment, $2.25/share. These are computed business
// figures carried over verbatim from the approved sketch: do NOT regenerate,
// round, or "improve" them.
const data = {
  standard: [207,621,1035,1449,2277,3105,3933,4761,5589,6417,7556,9212,10971,13455,15939,18423,20907,23391,25875,28359,30843,33327,35811,38295,40779,43263,45747,48231,50715,53199,55683,58167,60651,63135,65619,68103,70587,73071,75555,78039],
  plus: [414,1242,2070,2898,4554,6210,7866,9522,11488,13972,16456,18940,21424,23908,26392,28876,31360,33844,36328,38812,41296,43780,46264,48748,51232,53716,56200,58684,61168,63652,66136,68620,71104,73588,76072,78556,81040,83524,86008,88492],
  premium: [621,1863,3105,4347,6831,9315,11799,14283,16767,19251,21735,24219,26703,29187,31671,34155,36639,39123,41607,44091,46575,49059,51543,54027,56511,58995,61479,63963,66447,68931,71415,73899,76383,78867,81351,83835,86319,88803,91287,93771],
} as const;

type PlanKey = keyof typeof data;

// Cumulative cash by year-end (sum of monthly incomes; ~12 * avg of monthly through year)
// Approximation: cumulative = sum of (monthly_income * 12) up to year, using year-end values
function cumulative(plan: PlanKey, year: number) {
  const arr = data[plan];
  let total = 0;
  for (let i = 0; i < year; i++) total += arr[i] * 12;
  return total;
}

const LOAN_MULTIPLIER = 66.72;

function fmt(n: number) {
  return "Rs " + Math.round(n).toLocaleString("en-US");
}

const PLANS: { key: PlanKey; name: string; amount: string }[] = [
  { key: "standard", name: "Standard", amount: "Rs 1,288" },
  { key: "plus", name: "Plus", amount: "Rs 2,576" },
  { key: "premium", name: "Premium", amount: "Rs 3,864" },
];

const WHATSAPP_NUMBER = "23054523432";

export function IncomeCalculator() {
  const [plan, setPlan] = useState<PlanKey>("standard");
  const [year, setYear] = useState(15);
  const [advOpen, setAdvOpen] = useState(false);
  const [salaryRaw, setSalaryRaw] = useState("");
  const [ageRaw, setAgeRaw] = useState("");
  const [flashing, setFlashing] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const sliderRef = useRef<HTMLInputElement>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived values — same math as the sketch's updateOutputs()
  const monthly = data[plan][year - 1];
  const cum = cumulative(plan, year);
  const loan = monthly * LOAN_MULTIPLIER;
  const fillPct = ((year - 1) / 39) * 100;

  const age = parseInt(ageRaw, 10);
  const hasValidAge = advOpen && !!age && age >= 18 && age <= 65;
  const yLabel2 =
    "Year " + year + (hasValidAge ? ". You'll be " + (age + year) : "");

  const sal = parseInt(salaryRaw.replace(/[^\d]/g, ""), 10) || 0;
  const without = sal * LOAN_MULTIPLIER;
  const withY = (sal + monthly) * LOAN_MULTIPLIER;
  const unlock = withY - without;

  const planName = PLANS.find((p) => p.key === plan)!.name;
  const waHref =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(
      `Hi Muktish, please send me the 40-year breakdown for the ${planName} plan`,
    );

  const pickPlan = (key: PlanKey) => {
    setPlan(key);
    setFlashing(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashing(false), 80);
  };

  const scrollToSlider = () => {
    sliderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setPulsing(true);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulsing(false), 1200);
  };

  const numberCls = cn(
    "font-heading text-[28px] font-bold leading-[1.1] tracking-[-0.5px] text-yealth-offwhite transition-opacity duration-150 md:text-[32px]",
    flashing ? "opacity-40" : "opacity-100",
  );

  return (
    <div className="mx-auto max-w-[480px] overflow-hidden rounded-2xl border border-yealth-offwhite/[0.08] bg-yealth-black">
      <div className="px-5 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="mb-3 font-heading text-2xl font-bold leading-[1.2] tracking-[-0.5px] text-yealth-gold md:text-[28px]">
            How much will you earn every month?
          </h1>
          <p className="text-[15px] leading-[1.55] text-yealth-offwhite">
            Pick a plan. Move the time slider. See your monthly income, and the
            home loan it unlocks.
          </p>
        </div>

        {/* Plan picker */}
        <div className="mb-8">
          <div className="mb-2 font-heading text-[13px] font-bold uppercase tracking-[1.5px] text-yealth-offwhite">
            Your starting plan
          </div>
          <div className="mb-4 text-sm leading-relaxed text-[#A0A0A0]">
            Pick your monthly amount.
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PLANS.map((p) => {
              const active = plan === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => pickPlan(p.key)}
                  className={cn(
                    "rounded-yealth border px-1.5 py-3.5 text-center transition-all duration-200",
                    active
                      ? "border-yealth-gold bg-yealth-gold/[0.12]"
                      : "border-yealth-offwhite/[0.08] bg-[#1A1A1A] hover:border-yealth-gold/[0.28] hover:bg-[#161616]",
                  )}
                >
                  <div
                    className={cn(
                      "font-heading text-[15px] font-bold",
                      active ? "text-yealth-gold" : "text-yealth-offwhite",
                    )}
                  >
                    {p.name}
                  </div>
                  <div
                    className={cn(
                      "text-[13px] font-semibold leading-[1.3]",
                      active ? "text-yealth-offwhite" : "text-[#A0A0A0]",
                    )}
                  >
                    {p.amount}
                    <br />
                    /month
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="font-heading text-[13px] font-bold uppercase tracking-[1.5px] text-yealth-offwhite">
              In how many years?
            </div>
            <div className="font-heading text-lg font-bold text-yealth-mint">
              Year {year}
            </div>
          </div>
          <input
            ref={sliderRef}
            type="range"
            min={1}
            max={40}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            aria-label="Number of years"
            className={cn("calc-range", pulsing && "pulse")}
            style={{ "--fill": fillPct + "%" } as React.CSSProperties}
          />
          <div className="mt-2.5 text-center text-[11px] italic tracking-[0.3px] text-[#6B6B6B]">
            Move the slider to see different years.
          </div>
        </div>

        {/* Results */}
        <div className="mb-3 rounded-yealth border border-yealth-offwhite/[0.08] bg-[#1A1A1A] p-5">
          <div className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.8px] text-[#A0A0A0]">
            Your monthly income at Year {year}
          </div>
          <div className={cn(numberCls, "mb-2")}>{fmt(monthly)}</div>
          <div className="text-[13px] leading-[1.45] text-[#A0A0A0]">
            Lands in your bank account every month.
          </div>
        </div>

        <div className="mb-3 rounded-yealth border border-yealth-offwhite/[0.08] bg-[#1A1A1A] p-5">
          <div className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.8px] text-[#A0A0A0]">
            Total cash earned by then
          </div>
          <div className={cn(numberCls, "mb-2")}>{fmt(cum)}</div>
          <div className="text-[13px] leading-[1.45] text-[#A0A0A0]">
            Yours to spend, save, or use as a loan deposit.
          </div>
        </div>

        <div
          className={cn(
            "mb-3 rounded-yealth border border-yealth-gold/[0.28] bg-yealth-gold/[0.12] p-5 transition-opacity duration-200",
            advOpen ? "opacity-40" : "opacity-100",
          )}
        >
          <div className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.8px] text-[#A0A0A0]">
            <span className="mr-1 font-extrabold tracking-[1.5px] text-yealth-gold">
              EXTRA
            </span>
            home loan you&apos;d qualify for
          </div>
          <div className={cn(numberCls, "mb-2 !text-yealth-gold")}>
            {fmt(loan)}
          </div>
          <div className="text-[13px] leading-[1.45] text-[#A0A0A0]">
            Based on MHC at 30 years, 6% p.a., 40% DSTI rule.
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setAdvOpen((o) => !o)}
          className={cn(
            "mb-6 mt-3 w-full rounded-yealth border p-3.5 font-body text-[15px] font-semibold transition-all duration-200",
            advOpen
              ? "border-yealth-mint bg-yealth-mint/10 text-yealth-mint hover:bg-yealth-mint/10"
              : "border-yealth-gold bg-transparent text-yealth-gold hover:bg-yealth-gold/[0.12]",
          )}
        >
          {advOpen ? "Hide salary view ↑" : "See it with your salary →"}
        </button>

        {/* Advanced view */}
        {advOpen && (
          <div className="calc-slide-in">
            <div className="mb-5">
              <label
                htmlFor="salaryInput"
                className="mb-2 block font-heading text-[13px] font-bold uppercase tracking-[1.2px] text-yealth-offwhite"
              >
                Your current monthly salary
              </label>
              <input
                type="text"
                id="salaryInput"
                inputMode="numeric"
                placeholder="e.g. Rs 30,000"
                value={salaryRaw}
                onChange={(e) => setSalaryRaw(e.target.value)}
                className="w-full rounded-yealth border border-yealth-offwhite/[0.08] bg-[#1A1A1A] px-4 py-3.5 font-body text-base text-yealth-offwhite transition-colors placeholder:text-[#6B6B6B] focus:border-yealth-gold focus:outline-none"
              />
              <div className="mt-1.5 text-xs leading-[1.4] text-[#A0A0A0]">
                Stays on your device. yealth never sees or stores it.
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="ageInput"
                className="mb-2 block font-heading text-[13px] font-bold uppercase tracking-[1.2px] text-yealth-offwhite"
              >
                Your age today
              </label>
              <input
                type="number"
                id="ageInput"
                min={18}
                max={65}
                placeholder="e.g. 25"
                value={ageRaw}
                onChange={(e) => setAgeRaw(e.target.value)}
                className="w-full rounded-yealth border border-yealth-offwhite/[0.08] bg-[#1A1A1A] px-4 py-3.5 font-body text-base text-yealth-offwhite transition-colors placeholder:text-[#6B6B6B] focus:border-yealth-gold focus:outline-none"
              />
              <div className="mt-1.5 text-xs leading-[1.4] text-[#A0A0A0]">
                So we can show you what age you&apos;ll be at each milestone.
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToSlider}
              className="mb-4 w-full rounded-yealth px-3 py-2 text-center text-[11px] italic tracking-[0.3px] text-[#A0A0A0] transition-colors hover:bg-yealth-gold/[0.06] hover:text-yealth-gold focus:bg-yealth-gold/[0.06] focus:text-yealth-gold focus:outline-none"
            >
              ↑ Move the slider above to see different years and ages.
              <span className="mt-1 block text-[10px] not-italic uppercase tracking-[0.5px] text-[#6B6B6B]">
                Click to go up to the slider
              </span>
            </button>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="rounded-yealth border border-yealth-offwhite/[0.08] bg-[#1A1A1A] p-4">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.8px] text-[#A0A0A0]">
                  Without yealth
                </div>
                <div className="mb-1.5 font-heading text-lg font-bold leading-[1.2] text-yealth-offwhite">
                  {sal > 0 ? fmt(without) : "Rs —"}
                </div>
                <div className="text-[11px] leading-[1.4] text-[#A0A0A0]">
                  Your salary alone qualifies you for this loan today.
                </div>
              </div>
              <div className="rounded-yealth border border-yealth-offwhite/[0.08] bg-[#1A1A1A] p-4">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.8px] text-[#A0A0A0]">
                  With yealth at {yLabel2}
                </div>
                <div className="mb-1.5 font-heading text-lg font-bold leading-[1.2] text-yealth-offwhite">
                  {sal > 0 ? fmt(withY) : "Rs —"}
                </div>
                <div className="text-[11px] leading-[1.4] text-[#A0A0A0]">
                  Salary plus farm income combined.
                </div>
              </div>
            </div>

            <div
              className="rounded-yealth border border-yealth-gold p-6 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,200,66,0.12) 0%, rgba(245,200,66,0.04) 100%)",
              }}
            >
              <div className="mb-2 font-heading text-[13px] font-medium uppercase tracking-[1.5px] text-yealth-gold">
                yealth unlocks
              </div>
              <div className="mb-2.5 font-heading text-[30px] font-bold leading-[1.1] tracking-[-0.5px] text-yealth-gold md:text-4xl">
                {sal > 0 ? fmt(unlock) : "Enter your salary"}
              </div>
              <div className="text-[13px] leading-[1.45] text-yealth-offwhite">
                Extra borrowing power on top of what your salary alone gives you
                today.
              </div>
            </div>
          </div>
        )}

        {/* Footnotes */}
        <div className="my-8 border-t border-yealth-offwhite/[0.08] pt-6">
          <p className="mb-1.5 text-[11px] leading-[1.6] text-[#6B6B6B]">
            Loan capacity uses MHC parameters: 30-year term, 6% p.a., 40% DSTI
            rule. Actual approval depends on age, existing debts, employment
            status, and other factors.
          </p>
          <p className="mb-1.5 text-[11px] leading-[1.6] text-[#6B6B6B]">
            Loan term may be shorter if you&apos;re closer to retirement.
          </p>
          <p className="mb-1.5 text-[11px] leading-[1.6] text-[#6B6B6B]">
            Numbers shown in today&apos;s prices.
          </p>
          <p className="mb-1.5 text-[11px] leading-[1.6] text-[#6B6B6B]">
            Figures are projections. Actual income depends on performance.
          </p>
          {advOpen && (
            <p className="mb-1.5 text-[11px] leading-[1.6] text-[#6B6B6B]">
              Salary and age stay on your device. We don&apos;t see or store
              them. The &quot;yealth unlocks&quot; figure is the additional loan
              capacity you wouldn&apos;t qualify for from your salary alone.
            </p>
          )}
        </div>

        {/* Primary CTA */}
        <div className="mt-8 text-center">
          <div className="mb-4 font-heading text-lg font-bold leading-[1.3] text-yealth-offwhite">
            The earlier you start, the closer you get to financial freedom.
          </div>
          <a
            href="/#contact"
            className="gold-cta block w-full rounded-yealth p-4 text-center font-heading text-base"
          >
            Secure my spot
          </a>
        </div>

        {/* Secondary CTA — WhatsApp */}
        <div className="mt-6 border-t border-yealth-offwhite/[0.08] pt-6 text-center">
          <div className="mb-1.5 font-heading text-[15px] font-bold text-yealth-offwhite">
            Want to see all three plans side by side?
          </div>
          <div className="mb-3.5 text-[13px] text-[#A0A0A0]">
            Get the full 40-year breakdown sent to you on WhatsApp.
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-yealth border border-yealth-offwhite/[0.08] bg-transparent p-3.5 font-body text-sm font-semibold text-yealth-offwhite transition-colors duration-200 hover:border-yealth-mint hover:text-yealth-mint"
          >
            WhatsApp me the breakdown
          </a>
          <div className="mt-2 text-[11px] italic text-[#6B6B6B]">
            Takes 30 seconds. The breakdown arrives in your WhatsApp.
          </div>
        </div>
      </div>
    </div>
  );
}
