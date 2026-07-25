"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

// The brand equation: Health + Wealth + Youth = yealth.
//
// Naming note — do NOT "fix" the export name. React requires PascalCase for
// JSX component identifiers, but scripts/check-brand.mjs (wired as a prebuild
// step) fails the build on any casing of the brand other than all-lowercase.
// A PascalCase identifier built from the brand word would therefore break
// `npm run build`, so this component is called BrandEquation and only the file
// name carries the brand, in lowercase.
//
// How the reveal works: every travelling glyph lives in a `relative` slot next
// to an invisible twin that holds its width. The visible glyph is an absolutely
// positioned motion.span carrying a `layoutId`. When the travel stage fires,
// that span is re-parented from its source slot into a destination slot inside
// the final word, and Motion FLIPs it across on its own. No measurement, no
// resize handling, and nothing reflows because the widths never change.
//
// Once the brand word has settled, the RESTORE stage fades *fresh* gold copies
// of the borrowed letters back into the source slots, so the equation reassembles
// instead of being left gutted. Those copies carry no layoutId — giving them one
// would make Motion treat them as the same shared element and fly the originals
// back out of the final word.
//
// The whole sequence replays on every scroll-back. `run` is bumped on each entry
// and exit; it keys the visual tree so a reset is an instant remount rather than
// the animation running backwards, and it is folded into every layoutId so that
// remount can never be mistaken for a shared-element transition.

const S = {
  IDLE: 0,
  HEALTH: 1,
  PLUS_ONE: 2,
  WEALTH: 3,
  PLUS_TWO: 4,
  YOUTH: 5,
  EQUALS: 6,
  HIGHLIGHT: 7,
  TRAVEL: 8,
  LANDED: 9,
  SETTLE: 10,
  RESTORE: 11,
  // Terminal stage. Nothing animates here — its only job is to drop the
  // compositing-layer promotion once everything is at rest.
  DONE: 12,
} as const;

type Stage = (typeof S)[keyof typeof S];

// Beat map, in ms from scroll-into-view. Each word settles before the next
// operator fires: Health lands at 1125, Wealth at 2525, Youth at 3840, then a
// ~510ms hold before the "=". Total sequence ends at ~8.1s.
const TIMELINE: Array<[Stage, number]> = [
  [S.HEALTH, 0],
  [S.PLUS_ONE, 1150],
  [S.WEALTH, 1400],
  [S.PLUS_TWO, 2600],
  [S.YOUTH, 2800],
  [S.EQUALS, 4350],
  [S.HIGHLIGHT, 4900],
  [S.TRAVEL, 5500],
  [S.LANDED, 6300],
  [S.SETTLE, 6500],
  [S.RESTORE, 6800],
  // The last animation (the final restored letter's glow) ends at ~8600.
  [S.DONE, 8800],
];

/** How long a single letter takes to fade and rise into place, in seconds. */
const LETTER_FADE = 0.7;
/** Gap between letters within a word, in seconds. */
const LETTER_STAGGER = 0.085;
/** Gap between borrowed letters returning home, in seconds. */
const RESTORE_STAGGER = 0.06;

const GOLD = "#F5C842";
const GREY = "#A0A0A0";
const OFFWHITE = "#FFFFF4";
const MINT = "#34D399";

// Per-letter gold glow. Both layers sit at zero offset so this reads as light
// coming off the letterform, not a drop shadow: a crisp inner glow hugging the
// strokes plus a modest falloff. Radii stay small deliberately — the glow must
// stay attached to the glyph rather than bleeding into the space around it, and
// blur cost scales with radius, so tight radii are also much cheaper to paint.
//
// Every value carries the SAME number of shadow layers — Motion can only
// interpolate matching layer counts, and a mismatch would make it snap.
const GLOW_NONE = "0 0 0px rgba(245, 200, 66, 0), 0 0 0px rgba(245, 200, 66, 0)";
const GLOW_REST =
  "0 0 3px rgba(245, 200, 66, 0.65), 0 0 9px rgba(245, 200, 66, 0.32)";
const GLOW_PULSE =
  "0 0 4px rgba(245, 200, 66, 0.85), 0 0 14px rgba(245, 200, 66, 0.45)";

const EASE_OUT: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const EASE_TRAVEL: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Source = "health" | "wealth" | "youth";

type Traveller = {
  id: string;
  char: string;
  /** Crossfaded in as the glyph travels — the capital Y becomes a lowercase y. */
  swapTo?: string;
  source: Source;
  srcIndex: number;
  destIndex: number;
  /** Left-to-right order for the gold letters returning to their source words. */
  restoreOrder: number;
  /** The second copy of "ealth"; fades out as it converges on the first. */
  ghost?: boolean;
};

const EALTH = ["e", "a", "l", "t", "h"];

const TRAVELLERS: Traveller[] = [
  {
    id: "glyph-y",
    char: "Y",
    swapTo: "y",
    source: "youth",
    srcIndex: 0,
    destIndex: 0,
    restoreOrder: 10,
  },
  ...EALTH.map((char, i) => ({
    id: `glyph-h-${char}`,
    char,
    source: "health" as Source,
    srcIndex: i + 1,
    destIndex: i + 1,
    restoreOrder: i,
  })),
  ...EALTH.map((char, i) => ({
    id: `glyph-w-${char}`,
    char,
    source: "wealth" as Source,
    srcIndex: i + 1,
    destIndex: i + 1,
    restoreOrder: 5 + i,
    ghost: true,
  })),
];

const WORDS: Array<{ key: Source; letters: string[]; enter: Stage }> = [
  { key: "health", letters: ["H", "e", "a", "l", "t", "h"], enter: S.HEALTH },
  { key: "wealth", letters: ["W", "e", "a", "l", "t", "h"], enter: S.WEALTH },
  { key: "youth", letters: ["Y", "o", "u", "t", "h"], enter: S.YOUTH },
];

// The result, always lowercase.
const RESULT = ["y", "e", "a", "l", "t", "h"];

export function BrandEquation() {
  const ref = useRef<HTMLDivElement>(null);
  const everEntered = useRef(false);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const prefersReduced = useReducedMotion();
  const reduce = prefersReduced === true;
  const [stage, setStage] = useState<Stage>(S.IDLE);
  const [run, setRun] = useState(0);

  useEffect(() => {
    // Reduced motion: land on the finished state once, and never replay.
    // DONE rather than RESTORE, so nothing is ever promoted to its own layer —
    // `at()` is a >= check, so every RESTORE-gated visual still applies.
    if (reduce) {
      setStage(S.DONE);
      return;
    }

    if (!inView) {
      if (!everEntered.current) return; // nothing to reset on first mount
      setStage(S.IDLE);
      setRun((r) => r + 1);
      return;
    }

    everEntered.current = true;
    setStage(S.IDLE);
    setRun((r) => r + 1);

    const timers = TIMELINE.map(([next, ms]) =>
      window.setTimeout(() => setStage(next), ms),
    );
    // React runs this before every re-run and on unmount, so chains can never
    // stack and no timeout can fire into an unmounted component.
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce]);

  const dur = (seconds: number) => (reduce ? 0 : seconds);
  const at = (target: Stage) => stage >= target;

  const highlighted = at(S.HIGHLIGHT);
  const travelled = at(S.TRAVEL);
  const restored = at(S.RESTORE);

  // Give every transform-animating node its own compositing layer, but only
  // while the sequence is running.
  //
  // Two problems this solves. First, a letter drifting 10px over 0.7s moves
  // ~0.24px per frame; without a layer the browser re-rasterises the glyphs at
  // a new sub-pixel offset every frame, which is what makes text look like it
  // is wobbling. On its own layer the text is rasterised once and the
  // compositor just moves the texture.
  //
  // Second, and more visible: Motion adds and removes will-change as each
  // individual animation starts and stops, and each flip switches that element
  // between sub-pixel and greyscale antialiasing (Chrome disables LCD text on
  // composited layers). Seventeen letters on an 85ms stagger means dozens of
  // little weight changes scattered through the sequence. Applying the
  // promotion uniformly and holding it means one transition at the start and
  // one at DONE, in unison, instead.
  const animating = stage > S.IDLE && !at(S.DONE);
  const promote = animating
    ? ({
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      } as const)
    : undefined;

  function renderGlyph(t: Traveller, entered: boolean, letterDelay: number) {
    const glowing = stage === S.LANDED && !t.ghost;
    return (
      <motion.span
        key={t.id}
        layoutId={`${t.id}-${run}`}
        layout="position"
        initial={false}
        className="absolute left-0 top-0 inline-block whitespace-nowrap"
        style={promote}
        // Transform-only node: the projection, the landing scale pulse, and the
        // ghost fade. Colour and the glow live one level down, so a repaint can
        // never force this element's transform back onto the main thread.
        animate={{
          opacity: t.ghost && at(S.LANDED) ? 0 : 1,
          scale: glowing ? 1.06 : 1,
        }}
        transition={{
          layout: { duration: dur(0.8), ease: EASE_TRAVEL },
          opacity: { duration: dur(0.3), ease: EASE_OUT },
          scale: { duration: dur(glowing ? 0.2 : 0.5), ease: EASE_OUT },
        }}
      >
        {/* The letter-by-letter entrance, plus the paint properties. The
            entrance transform runs 0-3.84s while colour fires at 4.9s and the
            glow at 6.3s, so a transform and a repaint never animate together
            on this node either. */}
        <motion.span
          className="inline-grid"
          initial={false}
          style={promote}
          animate={{
            opacity: entered ? 1 : 0,
            y: entered ? 0 : 10,
            color: highlighted ? GOLD : OFFWHITE,
            // The landing flash relaxes into a glow that HOLDS, rather than
            // decaying back to nothing. Ghost copies fade to opacity 0, so
            // there is no point paying to paint a shadow on them.
            textShadow: t.ghost
              ? GLOW_NONE
              : glowing
                ? GLOW_PULSE
                : at(S.LANDED)
                  ? GLOW_REST
                  : GLOW_NONE,
          }}
          transition={{
            opacity: {
              duration: dur(LETTER_FADE),
              delay: dur(letterDelay),
              ease: EASE_OUT,
            },
            y: {
              duration: dur(LETTER_FADE),
              delay: dur(letterDelay),
              ease: EASE_OUT,
            },
            color: { duration: dur(0.6), ease: EASE_OUT },
            textShadow: { duration: dur(glowing ? 0.25 : 1.2), ease: EASE_OUT },
          }}
        >
          <motion.span
            className="col-start-1 row-start-1"
            initial={false}
            animate={{ opacity: t.swapTo && travelled ? 0 : 1 }}
            transition={{ duration: dur(0.45), delay: dur(0.2), ease: EASE_OUT }}
          >
            {t.char}
          </motion.span>
          {t.swapTo ? (
            <motion.span
              className="col-start-1 row-start-1"
              initial={false}
              animate={{ opacity: travelled ? 1 : 0 }}
              transition={{ duration: dur(0.45), delay: dur(0.2), ease: EASE_OUT }}
            >
              {t.swapTo}
            </motion.span>
          ) : null}
        </motion.span>
      </motion.span>
    );
  }

  // A fresh gold copy of a borrowed letter, fading back into its source slot.
  // No layoutId: this must not be mistaken for the glyph now living in the
  // final word, or Motion would fly that one back out.
  function renderRestored(t: Traveller) {
    return (
      <motion.span
        key={`restored-${t.id}`}
        className="absolute left-0 top-0 inline-block whitespace-nowrap"
        style={promote}
        initial={{ opacity: 0, color: GOLD, textShadow: GLOW_NONE }}
        animate={{ opacity: 1, color: GOLD, textShadow: GLOW_REST }}
        transition={{
          opacity: {
            duration: dur(0.7),
            delay: dur(t.restoreOrder * RESTORE_STAGGER),
            ease: EASE_OUT,
          },
          // The halo ramps slower than the fade, so the letter arrives and
          // then lights up rather than blaring in.
          textShadow: {
            duration: dur(1.2),
            delay: dur(t.restoreOrder * RESTORE_STAGGER),
            ease: EASE_OUT,
          },
          color: { duration: 0 },
        }}
      >
        {t.char}
      </motion.span>
    );
  }

  function renderWord(word: (typeof WORDS)[number]) {
    const entered = at(word.enter);
    return (
      <span key={word.key} className="inline-flex items-baseline">
        {word.letters.map((char, i) => {
          const letterDelay = i * LETTER_STAGGER;
          const traveller = TRAVELLERS.find(
            (t) => t.source === word.key && t.srcIndex === i,
          );

          if (!traveller) {
            return (
              <motion.span
                key={`${word.key}-${i}`}
                className="inline-block"
                initial={false}
                style={promote}
                animate={{
                  opacity: entered ? 1 : 0,
                  y: entered ? 0 : 10,
                  // Dimmed only while the brand word is being assembled; back
                  // to full brightness as the gold letters return.
                  color: highlighted && !restored ? GREY : OFFWHITE,
                }}
                transition={{
                  opacity: {
                    duration: dur(LETTER_FADE),
                    delay: dur(letterDelay),
                    ease: EASE_OUT,
                  },
                  y: {
                    duration: dur(LETTER_FADE),
                    delay: dur(letterDelay),
                    ease: EASE_OUT,
                  },
                  color: { duration: dur(0.6), ease: EASE_OUT },
                }}
              >
                {char}
              </motion.span>
            );
          }

          return (
            <span key={`${word.key}-${i}`} className="relative inline-block">
              <span className="invisible">{char}</span>
              {travelled
                ? restored
                  ? renderRestored(traveller)
                  : null
                : renderGlyph(traveller, entered, letterDelay)}
            </span>
          );
        })}
      </span>
    );
  }

  function renderOperator(symbol: string, enter: Stage) {
    const entered = at(enter);
    // All three operators behave identically — no special case for the "=".
    // Each arrives in mint with a small scale pop, holds the mint for a beat,
    // then crosses to offwhite. Operators never glow; that contrast is what
    // makes the gold read.
    return (
      <motion.span
        className="inline-block"
        initial={false}
        style={promote}
        animate={{
          opacity: entered ? 1 : 0,
          scale: entered ? 1 : 0.8,
          color: entered ? OFFWHITE : MINT,
        }}
        transition={{
          opacity: { duration: dur(0.3), ease: EASE_OUT },
          scale: { duration: dur(0.35), ease: EASE_OUT },
          color: { duration: dur(0.4), delay: dur(0.55), ease: EASE_OUT },
        }}
      >
        {symbol}
      </motion.span>
    );
  }

  return (
    <section className="border-y border-yealth-offwhite/10 bg-yealth-black">
      <div
        ref={ref}
        className="mx-auto max-w-[1200px] px-6 py-8 text-center md:px-8 md:py-10"
      >
        {/* One clean string for screen readers; the visual tree below is hidden. */}
        <span className="sr-only">Health + Wealth + Youth = yealth</span>

        <div
          key={run}
          aria-hidden="true"
          className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-3 font-heading text-[clamp(1.25rem,6.4vw,3rem)] font-bold leading-[1.1] text-yealth-offwhite sm:gap-x-4"
        >
          {/* Left-hand side. Dims while the brand word lands, then brightens
              back up as the borrowed letters return in gold. */}
          <motion.span
            className="inline-flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-4"
            initial={false}
            style={promote}
            animate={{ opacity: at(S.LANDED) && !restored ? 0.45 : 1 }}
            transition={{ duration: dur(0.6), ease: EASE_OUT }}
          >
            {renderWord(WORDS[0])}
            {renderOperator("+", S.PLUS_ONE)}
            {renderWord(WORDS[1])}
            {renderOperator("+", S.PLUS_TWO)}
            {renderWord(WORDS[2])}
          </motion.span>

          {/* Forces "= yealth" onto its own line below the sm breakpoint. */}
          <span className="h-0 basis-full sm:hidden" />

          <span className="inline-flex items-baseline gap-x-2 sm:gap-x-4">
            {renderOperator("=", S.EQUALS)}
            <span className="inline-flex items-baseline">
              {RESULT.map((char, i) => (
                <span key={`result-${i}`} className="relative inline-block">
                  <span className="invisible">{char}</span>
                  {travelled
                    ? TRAVELLERS.filter((t) => t.destIndex === i).map((t) =>
                        renderGlyph(t, true, 0),
                      )
                    : null}
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
