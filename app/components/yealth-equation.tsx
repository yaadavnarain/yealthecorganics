"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

// The brand equation: health + wealth + youth = yealth. All lowercase, always.
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
  // The whole equation left of "yealth" — every letter, both "+" and the "=" —
  // enters from this one stage. Per-character delays do the staggering, so there
  // are no per-element stages left to introduce gaps.
  LEFT: 1,
  HIGHLIGHT: 2,
  TRAVEL: 3,
  LANDED: 4,
  SETTLE: 5,
  RESTORE: 6,
  // Terminal stage. Nothing animates here — its only job is to drop the
  // compositing-layer promotion once everything is at rest.
  DONE: 7,
} as const;

type Stage = (typeof S)[keyof typeof S];

// Beat map, in ms from scroll-into-view.
//
// One continuous stream of 20 characters at LETTER_STAGGER apart — the "="
// included, as index 19. The last letter of "youth" finishes its fade at
// 2230ms.
//
// The "=" enters at 1615ms, finishes its letter-matched fade at 2315ms, holds
// fully-opaque mint until 2565ms, then crosses to offwhite by 2965ms. That
// sequential shape is what makes its teal read identically to the "+" signs,
// and it is why the "=" settles 735ms after the letters rather than one beat
// after: a "+"-identical flourish takes 950ms from entry, which simply does not
// fit inside the 700ms a one-beat finish would allow. The flourish won.
//
// So the rest point is 2965ms. A 200ms breath follows with the complete
// equation static on screen, then the reveal runs from 3165ms, every offset
// below HIGHLIGHT preserved and simply shifted whole.
//
// The last animation (the final restored letter's glow) ends at 6715ms.
const TIMELINE: Array<[Stage, number]> = [
  [S.LEFT, 0],
  [S.HIGHLIGHT, 3165],
  [S.TRAVEL, 3765],
  [S.LANDED, 4565],
  [S.SETTLE, 4765],
  [S.RESTORE, 4915],
  [S.DONE, 6915],
];

/** How long a single letter takes to fade and rise into place, in seconds. */
const LETTER_FADE = 0.7;
/** Gap between letters within a word, in seconds. */
const LETTER_STAGGER = 0.085;
/** Gap between borrowed letters returning home, in seconds. */
const RESTORE_STAGGER = 0.06;
/**
 * The teal flourish, in seconds, shared by all three operators.
 *
 * The shape is strictly sequential: an operator finishes arriving, THEN sits
 * fully opaque and fully mint for MINT_HOLD, THEN crosses to offwhite over
 * MINT_CROSS. Keeping those three phases from overlapping is the whole point —
 * an overlapping version reads as "arrives already discolouring" rather than as
 * a held teal beat.
 *
 * renderOperator hardcodes these for the "+" signs (delay 0.3 + 0.25 = 0.55,
 * duration 0.4) and is deliberately frozen, so the values are mirrored here by
 * hand for the "=". If you ever change renderOperator, change these to match.
 */
const MINT_HOLD = 0.25;
const MINT_CROSS = 0.4;
/**
 * Per-glyph offsets that turn the landing burst into a left-to-right sweep
 * across "yealth" — sun catching one letterform after another.
 *
 * The ignite stagger is deliberately small: it has to fit inside the 200ms
 * LANDED -> SETTLE window, because a glyph whose delay outlasted that window
 * would find the burst already over and never light up at all. The decay has
 * the full 0.8s relax to play with, so it can spread wider.
 */
const BURST_SWEEP = 0.02;
const BURST_DECAY_STAGGER = 0.05;

const GOLD = "#F5C842";
const GREY = "#A0A0A0";
const OFFWHITE = "#FFFFF4";
const MINT = "#34D399";
/** Hotter, lighter gold at the peak of the burst; relaxes back to GOLD. */
const HOT_GOLD = "#FFEFC0";

// Per-letter gold glow. Both layers sit at zero offset so this reads as light
// coming off the letterform, not a drop shadow: a crisp inner glow hugging the
// strokes plus a modest falloff. Radii stay small deliberately — the glow must
// stay attached to the glyph rather than bleeding into the space around it, and
// blur cost scales with radius, so tight radii are also much cheaper to paint.
//
// Every value carries the SAME number of shadow layers — Motion can only
// interpolate matching layer counts, and a mismatch would make it snap. All
// three are therefore three layers, even where the third is invisible.
//
// GLOW_REST keeps its original two layers untouched and pads a zero-alpha,
// zero-radius third, so the resting appearance is identical to before — the
// third layer exists only to give GLOW_BURST something to interpolate against.
//
// GLOW_BURST is the sunlight: a near-white-gold hot core, a gold mid-bloom, and
// a wide warm amber falloff. It only ever lands on the six glyphs of the brand
// word, and it decays into GLOW_REST rather than holding.
const GLOW_NONE =
  "0 0 0px rgba(245, 200, 66, 0), 0 0 0px rgba(245, 200, 66, 0), 0 0 0px rgba(255, 170, 60, 0)";
const GLOW_REST =
  "0 0 3px rgba(245, 200, 66, 0.65), 0 0 9px rgba(245, 200, 66, 0.32), 0 0 0px rgba(255, 170, 60, 0)";
const GLOW_BURST =
  "0 0 2px rgba(255, 250, 230, 0.95), 0 0 14px rgba(245, 200, 66, 0.8), 0 0 34px rgba(255, 170, 60, 0.5)";

const EASE_OUT: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const EASE_TRAVEL: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Source = "health" | "wealth" | "youth";

type Traveller = {
  id: string;
  char: string;
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
    char: "y",
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

// Everything up to and including the "=" is ONE continuous stream of characters
// — letters, both "+" signs and the "=" alike — each entering exactly
// LETTER_STAGGER after the previous one, with no extra pause at word boundaries
// or before the "=". The indices below place each element in that global stream.
// They are derived rather than hardcoded so they cannot drift if a word changes.
const HEALTH = ["h", "e", "a", "l", "t", "h"];
const WEALTH = ["w", "e", "a", "l", "t", "h"];
const YOUTH = ["y", "o", "u", "t", "h"];

const PLUS_ONE_INDEX = HEALTH.length; // 6
const WEALTH_START = PLUS_ONE_INDEX + 1; // 7
const PLUS_TWO_INDEX = WEALTH_START + WEALTH.length; // 13
const YOUTH_START = PLUS_TWO_INDEX + 1; // 14
/** The "=" closes the stream, immediately after youth's final "h". */
const EQUALS_INDEX = YOUTH_START + YOUTH.length; // 19
// 20 characters, indices 0-19: the "=" enters last at 19 x 85 = 1615ms.

const WORDS: Array<{ key: Source; letters: string[]; startIndex: number }> = [
  { key: "health", letters: HEALTH, startIndex: 0 },
  { key: "wealth", letters: WEALTH, startIndex: WEALTH_START },
  { key: "youth", letters: YOUTH, startIndex: YOUTH_START },
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
    // The sunlight burst. This lands on exactly the six glyphs of the brand
    // word and nothing else, and that falls out of the existing structure
    // rather than needing a new flag: renderGlyph runs in a source slot only
    // while !travelled, and in a destination slot only once travelled. By
    // LANDED the source slots render null (RESTORE has not fired yet), so the
    // only live instances are the 11 at the destination — of which !t.ghost
    // selects the 6 that make up the word. The restored gold letters go
    // through renderRestored, which never sees GLOW_BURST.
    const bursting = stage === S.LANDED && !t.ghost;
    const igniteDelay = t.destIndex * BURST_SWEEP;
    const decayDelay = t.destIndex * BURST_DECAY_STAGGER;
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
          scale: bursting ? 1.06 : 1,
        }}
        transition={{
          layout: { duration: dur(0.8), ease: EASE_TRAVEL },
          opacity: { duration: dur(0.3), ease: EASE_OUT },
          scale: { duration: dur(bursting ? 0.2 : 0.5), ease: EASE_OUT },
        }}
      >
        {/* The letter-by-letter entrance, plus the paint properties. The
            entrance transform runs 0-3.84s while colour fires at 4.9s and the
            glow at 6.3s, so a transform and a repaint never animate together
            on this node either. */}
        <motion.span
          className="inline-block"
          initial={false}
          style={promote}
          animate={{
            opacity: entered ? 1 : 0,
            y: entered ? 0 : 10,
            // A hotter, lighter gold at the peak of the burst, settling back.
            color: bursting ? HOT_GOLD : highlighted ? GOLD : OFFWHITE,
            // The burst relaxes into a glow that HOLDS, rather than decaying
            // back to nothing. Ghost copies fade to opacity 0, so there is no
            // point paying to paint a shadow on them.
            textShadow: t.ghost
              ? GLOW_NONE
              : bursting
                ? GLOW_BURST
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
            // Fast attack, slow relax: light arrives, then fades. The ignite
            // sweeps left to right; the decay follows on a wider stagger.
            color: {
              duration: dur(bursting ? 0.12 : at(S.SETTLE) ? 0.8 : 0.6),
              delay: dur(bursting ? igniteDelay : at(S.SETTLE) ? decayDelay : 0),
              ease: EASE_OUT,
            },
            textShadow: {
              duration: dur(bursting ? 0.12 : 0.8),
              delay: dur(bursting ? igniteDelay : at(S.SETTLE) ? decayDelay : 0),
              ease: EASE_OUT,
            },
          }}
        >
          {t.char}
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
    const entered = at(S.LEFT);
    return (
      <span key={word.key} className="inline-flex items-baseline">
        {word.letters.map((char, i) => {
          // Position in the global left-hand stream, not within the word.
          const letterDelay = (word.startIndex + i) * LETTER_STAGGER;
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

  function renderOperator(symbol: string, enter: Stage, entryDelay: number) {
    const entered = at(enter);
    // Both "+" signs. Each arrives in mint with a small scale pop, holds the
    // mint for a beat, then crosses to offwhite. Operators never glow; that
    // contrast is what makes the gold read.
    //
    // The "=" used to come through here too but now has its own renderer —
    // see renderEquals below for why. Nothing in this function changed with
    // that extraction; the "+" behaviour is exactly as it was.
    //
    // The colour delay must include entryDelay. The "+" signs share one stage
    // with every letter and are placed in the stream purely by delay, so a bare
    // 0.55 would start the mint-to-offwhite crossing before the sign had even
    // finished arriving — a 40ms mint flash instead of the intended hold.
    //
    // The 0.55 delay is 0.3 (this entrance) + MINT_HOLD, and 0.4 is MINT_CROSS.
    // Those constants mirror these values so renderEquals can reproduce the
    // identical hold and crossing; change them together or the two diverge.
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
          opacity: { duration: dur(0.3), delay: dur(entryDelay), ease: EASE_OUT },
          scale: { duration: dur(0.35), delay: dur(entryDelay), ease: EASE_OUT },
          color: {
            duration: dur(0.4),
            delay: dur(entryDelay + 0.55),
            ease: EASE_OUT,
          },
        }}
      >
        {symbol}
      </motion.span>
    );
  }

  // The "=" gets its own renderer rather than a flag on renderOperator, because
  // it plays a different role: it is the FINAL beat of the entrance stream, and
  // nothing arrives after it to absorb a mismatch.
  //
  // With the operator signature it faded in over 0.3s and finished arriving at
  // 1915ms — 315ms BEFORE the "h" of "youth" that started 85ms ahead of it,
  // visually overtaking its own predecessor. So it takes the LETTERS' arrival
  // signature instead: the same LETTER_FADE, the same 10px rise, the same
  // easing, and no scale pop. Both "+" keep renderOperator untouched, since
  // they sit mid-stream with characters still arriving to mask the faster snap.
  //
  // Its teal flourish then runs strictly AFTER that entrance rather than
  // overlapping it. An earlier version compressed the flourish to land with the
  // fade, which kept the "=" finishing one beat behind the letters but meant it
  // was never once fully opaque and fully mint and static — the phases all ran
  // at the same time and it read as muddied and trailing rather than held.
  //
  // The two goals are arithmetically incompatible: a "+"-identical flourish is
  // 0.3 + MINT_HOLD + MINT_CROSS = 950ms from entry, and finishing within one
  // 85ms beat of the last letter allows only 700ms. Matching the "+" won, so
  // the "=" now settles 735ms after the letters instead of 85ms.
  function renderEquals(entryDelay: number) {
    const entered = at(S.LEFT);
    return (
      <motion.span
        className="inline-block"
        initial={false}
        style={promote}
        animate={{
          opacity: entered ? 1 : 0,
          y: entered ? 0 : 10,
          color: entered ? OFFWHITE : MINT,
        }}
        transition={{
          opacity: {
            duration: dur(LETTER_FADE),
            delay: dur(entryDelay),
            ease: EASE_OUT,
          },
          y: {
            duration: dur(LETTER_FADE),
            delay: dur(entryDelay),
            ease: EASE_OUT,
          },
          // Strictly after the fade, exactly like a "+": wait out the full
          // LETTER_FADE entrance, hold fully-opaque mint for MINT_HOLD, then
          // cross over MINT_CROSS with the same easing. Same hold, same
          // crossing, same feel — no phase overlaps another.
          color: {
            duration: dur(MINT_CROSS),
            delay: dur(entryDelay + LETTER_FADE + MINT_HOLD),
            ease: EASE_OUT,
          },
        }}
      >
        =
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
        <span className="sr-only">health + wealth + youth = yealth</span>

        <div
          key={run}
          aria-hidden="true"
          className="flex items-baseline justify-center gap-x-[0.14em] whitespace-nowrap font-heading text-[clamp(0.95rem,5.3vw,3rem)] font-bold leading-[1.1] text-yealth-offwhite sm:gap-x-3 md:gap-x-4"
        >
          {/* Left-hand side. Dims while the brand word lands, then brightens
              back up as the borrowed letters return in gold. */}
          <motion.span
            className="inline-flex items-baseline justify-center gap-x-[0.14em] sm:gap-x-3 md:gap-x-4"
            initial={false}
            style={promote}
            animate={{ opacity: at(S.LANDED) && !restored ? 0.45 : 1 }}
            transition={{ duration: dur(0.6), ease: EASE_OUT }}
          >
            {renderWord(WORDS[0])}
            {renderOperator("+", S.LEFT, PLUS_ONE_INDEX * LETTER_STAGGER)}
            {renderWord(WORDS[1])}
            {renderOperator("+", S.LEFT, PLUS_TWO_INDEX * LETTER_STAGGER)}
            {renderWord(WORDS[2])}
          </motion.span>

          <span className="inline-flex items-baseline gap-x-[0.14em] sm:gap-x-3 md:gap-x-4">
            {renderEquals(EQUALS_INDEX * LETTER_STAGGER)}
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
