"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

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
// The "=" enters at 1615ms and OVERLAPS its own entrance rather than waiting it
// out: its mint crossing runs 1855 -> 2195ms, finishing before both the last
// letter (2230ms) and its own fade (2315ms). So the colour is fully resolved
// while the entrance is still completing, and the last thing to move is the
// "=" opacity — the same property every letter animates, which reads as the
// tail of the entrance rather than a separate delayed beat.
//
// Rest point is therefore 2315ms. A 200ms breath follows, then the reveal runs
// from 2515ms, every offset below HIGHLIGHT preserved and shifted whole.
//
// The last animation (the final restored letter's glow) ends at 6065ms.
const TIMELINE: Array<[Stage, number]> = [
  [S.LEFT, 0],
  [S.HIGHLIGHT, 2515],
  [S.TRAVEL, 3115],
  [S.LANDED, 3915],
  [S.SETTLE, 4115],
  [S.RESTORE, 4265],
  [S.DONE, 6265],
];

/** How long a single letter takes to fade and rise into place, in seconds. */
const LETTER_FADE = 0.7;
/** Gap between letters within a word, in seconds. */
const LETTER_STAGGER = 0.085;
/** Gap between borrowed letters returning home, in seconds. */
const RESTORE_STAGGER = 0.06;
/**
 * The "=" teal flourish, in seconds. Unlike the "+", it deliberately OVERLAPS
 * its own entrance: the crossing starts while the "=" is still fading in and
 * finishes before the fade does, so nothing colour-related is still changing
 * once the equation comes to rest.
 *
 * A "+"-identical sequential flourish (arrive, hold, then cross) takes 950ms
 * from entry, which cannot fit inside the entrance and therefore always left a
 * delayed beat at the end. Overlapping is what removes it. The "+" signs keep
 * the sequential shape — renderOperator is untouched.
 */
const EQUALS_MINT_HOLD = 0.24;
const EQUALS_MINT_CROSS = 0.34;
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

/**
 * The band the section must reach before the sequence may begin, as an
 * IntersectionObserver rootMargin: 25% down from the top of the viewport to 60%
 * down. Percentages rather than pixels deliberately — "is this in front of the
 * visitor" is a question about fractions of the screen, and a fixed pixel margin
 * does not transfer (-220px is a third of a small phone but a seventh of a tall
 * desktop, which would fire at 85% of the screen there and reintroduce the bug
 * this replaced).
 */
const START_BAND = "-25% 0px -40% 0px";

const EASE_OUT: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const EASE_TRAVEL: [number, number, number, number] = [0.22, 1, 0.36, 1];
/**
 * Even and symmetric, for the "=" colour crossing only. EASE_OUT reaches 90% at
 * 54% of its duration and then creeps to completion, which is what read as
 * lingering; this resolves cleanly instead. Both "+" keep EASE_OUT.
 */
const EASE_CROSS: [number, number, number, number] = [0.45, 0, 0.55, 1];

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
  const prefersReduced = useReducedMotion();
  const reduce = prefersReduced === true;
  const [stage, setStage] = useState<Stage>(S.IDLE);
  // The single piece of trigger state: 0 means blank and idle, any positive
  // value identifies the current run. It also keys the visual tree and scopes
  // every layoutId, so dropping to 0 remounts the subtree blank in one frame.
  const [run, setRun] = useState(0);
  const stageRef = useRef<Stage>(S.IDLE);

  // Write through a ref so an unchanged stage costs no render at all. The loop
  // below ticks every frame; without this it would re-render ~60x/second.
  const commit = useCallback((next: Stage) => {
    if (next === stageRef.current) return;
    stageRef.current = next;
    setStage(next);
  }, []);

  // Two observation bands, because the boundary that should START the run is not
  // the boundary that should BLANK it. Using one for both is what forced the
  // choice between firing too early and blanking a strip that is still visible:
  // the old single band fired when the section's top edge was 80% down the
  // screen — 205px into a 7069px page, with the hero still filling four fifths
  // of the viewport — so the 2.3s entrance was over before the reader arrived.
  //
  // START_BAND spans 25%-60% of the viewport, so the run begins only once the
  // strip is genuinely framed: its top edge 60% down when scrolling in from
  // below, or its bottom edge 25% down when scrolling back up. The band is
  // deliberately a wide 35% of the viewport — the section stays inside it for
  // 320-640px of scroll travel, which no real flick (peaking ~6000px/s, about
  // 100px per frame) can skip between frames.
  //
  // `alive` is the true viewport, and it is the ONLY thing that blanks the
  // section. So a visible strip can never sit blank, and `armed` — set only by
  // going fully off-screen — means a moved band edge cannot restart a run. That
  // is what makes this immune to a mobile URL bar resizing the viewport
  // mid-scroll: percentage margins shift the band by a few tens of pixels, but
  // with the latch closed a re-entry does nothing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let armed = true;
    let n = 0;

    const start = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !armed) return;
        armed = false;
        n += 1;
        setRun(n);
      },
      { rootMargin: START_BAND, threshold: 0 },
    );

    const alive = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return;
        armed = true;
        setRun(0);
      },
      { rootMargin: "0px", threshold: 0 },
    );

    start.observe(el);
    alive.observe(el);
    return () => {
      start.disconnect();
      alive.disconnect();
    };
  }, []);

  useEffect(() => {
    // Reduced motion: land on the finished state once, and never replay.
    // DONE rather than RESTORE, so nothing is ever promoted to its own layer —
    // `at()` is a >= check, so every RESTORE-gated visual still applies.
    if (reduce) {
      commit(S.DONE);
      return;
    }

    // run === 0 is blank and idle: either never entered the start band, or the
    // section has gone fully off-screen. Nothing pending, no partial state.
    if (run === 0) {
      commit(S.IDLE);
      return;
    }

    commit(S.IDLE);

    // The stage is a PURE FUNCTION OF ELAPSED TIME, recomputed every frame,
    // rather than a chain of one-shot timers.
    //
    // That is what makes a frozen half-finished equation structurally
    // impossible. With a timer chain, clearing it left `stage` orphaned at
    // whatever value it had reached with nothing scheduled to advance it — the
    // exact reported bug (stuck at LEFT: letters opaque, no gold, no travel).
    // Here every exit from this effect leaves an actively defined state: out of
    // view is IDLE with nothing pending, in view is a running loop that derives
    // the stage from `elapsed`, and a re-run for ANY reason cancels the loop and
    // immediately starts a fresh one from IDLE. There is no representable state
    // in which the sequence is part-way through and nothing is driving it.
    let base = performance.now();
    let firstFrame = true;
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      if (firstFrame) {
        firstFrame = false;
        // requestAnimationFrame does not run while the page is not rendering
        // (backgrounded tab), and can be delayed by a long main-thread block.
        // Either way the first frame can arrive long after the run began, which
        // would snap the sequence straight to a late stage — or to DONE, so it
        // would appear already finished with no animation at all. Rebase so it
        // always plays from its first letter.
        if (now - base > 250) base = now;
      }
      const elapsed = now - base;
      let next: Stage = S.IDLE;
      for (const [s, ms] of TIMELINE) if (elapsed >= ms) next = s;
      commit(next);
      if (next !== S.DONE) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, commit]);

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
    // The 0.55 delay is this 0.3s entrance plus a 0.25s fully-opaque mint hold,
    // so the "+" phases are strictly sequential. The "=" deliberately does NOT
    // reproduce that — see renderEquals for why overlapping is what removes its
    // trailing beat — so these values are local to the "+" and stay frozen.
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
  // Its teal flourish OVERLAPS that entrance rather than following it. A
  // "+"-identical sequential flourish (arrive, hold fully-opaque mint, then
  // cross) takes 950ms from entry, which cannot fit inside the entrance — it
  // always left the "=" finishing well after the letters, reading as a delayed
  // beat at the end. Overlapping is what removes it: the crossing resolves at
  // 2195ms, before the last letter (2230ms) and before this glyph's own fade
  // (2315ms), so the only thing still moving at the end is opacity — the same
  // property every letter animates.
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
          // Overlaps the fade on purpose. Crossing runs 1855 -> 2195ms, so it
          // is fully resolved before the last letter lands at 2230 and before
          // this glyph's own fade ends at 2315 — nothing colour-related trails
          // past the point the equation comes to rest. EASE_CROSS resolves
          // evenly instead of creeping the way EASE_OUT does.
          color: {
            duration: dur(EQUALS_MINT_CROSS),
            delay: dur(entryDelay + EQUALS_MINT_HOLD),
            ease: EASE_CROSS,
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
