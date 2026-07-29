"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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

// The logo mark that completes the lockup, to the RIGHT of the assembled brand
// word — wordmark left, mark right, exactly as the real logo is composed. This
// is the actual brand asset (public/images/yealth-mark.png, 683x336 and
// genuinely transparent), never a redrawing of it.
//
// Sized in em so it tracks the type, but with a breakpoint step rather than one
// value, because the room available is not proportional to the font. From 768px
// the strip uses a FIXED word gap while the type is near its 48px cap, which
// leaves the least slack of any width — far less than mobile. So the mark is
// modest through that band and grows to near true lockup proportion from 1024px,
// where there is room to spare. Measured, not guessed.
// Sizes live as literal Tailwind classes on the slot below, because the JIT
// only emits classes it can see as text. For the record, height x width
// (width is always height x 683/336, the asset's own ratio) plus the gap that
// separates mark from word:
//   base / md   0.42em x 0.854em, gap 0.06em
//   lg and up   0.85em x 1.727em, gap 0.14em
//
// The base figure is deliberately restrained. Measured at the two tightest
// widths, a 0.5em mark left only 2px of slack at 320px and 4px at 768px — it
// fitted, but with no margin for a font metric landing differently. Shrinking
// the MARK is the correct lever here; the type is never touched.

// The mark is a raster, so its halo is a filter rather than a text-shadow. Both
// states carry the same number of layers so the filter interpolates instead of
// snapping, matching the convention the letter glows already use.
const MARK_GLOW_NONE =
  "drop-shadow(0 0 0px rgba(245, 200, 66, 0)) drop-shadow(0 0 0px rgba(255, 170, 60, 0))";
const MARK_GLOW_REST =
  "drop-shadow(0 0 5px rgba(245, 200, 66, 0.45)) drop-shadow(0 0 14px rgba(255, 170, 60, 0.2))";
/**
 * The flare the handover happens under.
 *
 * The footage ends on a ROUNDED loop and the asset is a FLAT lemniscate, so the
 * swap is a real shape change. The letters' own burst lights the six glyphs of
 * "yealth", which sit to the LEFT of this slot — adjacent, not on top of it — so
 * it covers nothing here. This gives the slot its own flash to change shape
 * under. Same three-token palette as the letter burst.
 */
const MARK_GLOW_BURST =
  "drop-shadow(0 0 10px rgba(255, 250, 230, 0.95)) drop-shadow(0 0 30px rgba(245, 200, 66, 0.75))";

// The sprout footage: 520x542, 2.583s at 24fps, no audio, on a PURE BLACK field
// (every border pixel measures 0 on every channel). It is composited with
// mix-blend-mode: screen, which makes that black vanish against the section and
// keeps only the glow. There is no alpha channel and no other way to key it.
//
// SIZE THE FRAME FROM THE TALLEST MOMENT, NEVER THE LAST ONE. Measured across
// all 62 frames: the sprout peaks at frame 22 at 372 of 542px — 68.6% of the
// frame height — while the FINAL loop is only 219px, 40.4%. Sizing from the
// final frame (as this first did) renders the peak 1.70x larger than intended
// and drives it straight into the section edges, where the neighbouring
// sections paint over it and it clips hard.
//
// The full envelope across the clip is 89.3% of the height and 89.0% of the
// width, and it is centred: envelope centre 50.1%, final-loop centre 50.2%. So
// a centred element is correct at every moment, and the handover shrink is a
// pure scale about that centre which lands the loop exactly on the slot.
const PEAK_OF_FRAME = 0.686;
const FINAL_OF_FRAME = 0.404;
/**
 * Frame height, in em. The peak is 0.686 x 6.41 = 4.40em against a 1.1em line
 * box, so the sprout tops out at 4.0x the line height — big enough to read as
 * the event, and bounded so the overflow stays inside the dark seam.
 *
 * Above a 906px viewport the type clamp caps at 48px, so this stops growing and
 * the clearance to the hero's Apply Now button cannot erode further.
 */
const VIDEO_FRAME_EM = 6.41;
/**
 * Shrink at the handover, landing the final loop on the mark's height.
 *
 * The final loop is 0.404 x 6.41em = 2.590em. The slot is 0.42em below `lg` and
 * 0.85em from `lg` up, so one factor cannot serve both: 0.42 / 2.590 = 0.162
 * and 0.85 / 2.590 = 0.328. The breakpoint is read once via matchMedia rather
 * than guessed.
 */
const VIDEO_SHRINK_BASE = 0.162;
const VIDEO_SHRINK_LG = 0.328;
/** Where `lg:` starts, matching the Tailwind breakpoint the slot uses. */
const LG_QUERY = "(min-width: 1024px)";
/**
 * Natural pace. The clip used to be driven at 1.85 so it could fit the window
 * between HIGHLIGHT and LANDED, but that made it the only thing on the strip
 * running fast — 1400ms of sprout against letters streaming for over twice
 * that. It now plays at its own speed and STARTS EARLIER instead.
 */
const VIDEO_RATE = 1;
/** Measured clip length. mp4 is 2583.3ms and webm 2584ms — a 1ms spread. */
const CLIP_MS = 2583;
/**
 * When the clip begins, so its last frame is the burst.
 *
 * Derived from the TIMELINE rather than written down, so the two can never
 * drift apart: whatever LANDED is, the clip is started exactly its own length
 * before it. Currently 3915 - 2583 = 1332ms.
 *
 * That is mid-entrance — the stream is on character 15 of 20, part way through
 * "youth", and the equals does not arrive until 1615ms. The sprout therefore
 * appears 283ms before the equals does, and it does not grow in from nothing:
 * frame one is already a formed sprout at 47.6% of the clip's height. The
 * longer fade below is what stops that reading as a pop.
 */
const VIDEO_START_MS =
  (TIMELINE.find(([s]) => s === S.LANDED)?.[1] ?? 3915) - CLIP_MS;
/**
 * How long the sprout takes to materialise. Longer than a normal entrance
 * because the clip's first 375ms are almost static (its tip moves 127 -> 114),
 * so the fade overlaps a near-still image: it arrives rather than appears, and
 * is at full presence just as real growth starts.
 */
const VIDEO_FADE_IN = 0.45;
/**
 * The handover: how long the mark takes to travel into the lockup slot.
 *
 * This was 160ms, chosen as a flash to hide the change from rounded loop to
 * flat mark. At natural pace that snap became the only fast thing left in the
 * sequence and read as a cut. 300ms reads as a transition. The cost is honest:
 * the shape change is on screen for roughly twice as long. What pays for it is
 * the size of the travel — 211px down to 41px at 1440 — which keeps the eye on
 * movement rather than outline.
 */
const HANDOVER = 0.3;
/**
 * The opacity swap, deliberately SHORTER than the travel. Finishing the
 * cross-fade first means the shape has fully resolved while the mark is still
 * moving, instead of both ending together and drawing attention to the change.
 */
const HANDOVER_CROSSFADE = 0.22;
/** How long the flare takes to relax into the mark's resting halo. */
const FLARE_DECAY = 0.8;

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

/**
 * Whether the `lg:` slot size is in force, so the handover can shrink onto the
 * right target. Starts false and is set in an effect, which keeps the server
 * and first client render identical; the value is only ever read at the
 * handover, seconds after mount, so the initial false is never seen.
 */
function useLargeSlot() {
  const [large, setLarge] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const sync = () => setLarge(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return large;
}

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
  const videoRef = useRef<HTMLVideoElement>(null);
  /**
   * Which run the footage has already been started for.
   *
   * The timer below already gives once-per-run by construction — one timer is
   * scheduled per run and cleanup clears it — so this is belt and braces, and
   * it also absorbs React's development double-invoke of effects.
   */
  const startedRunRef = useRef(0);
  /**
   * Whether the sprout is on screen. It cannot be derived from `stage`: the
   * clip starts at 1332ms and the stage machine has no boundary there, so
   * gating visibility on a stage would leave it playing invisibly and then
   * popping in already half-bent.
   */
  const [videoOn, setVideoOn] = useState(false);
  const largeSlot = useLargeSlot();

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

  // Start the footage the moment the letters go gold, and always from frame one.
  //
  // The strip is keyed by `run`, so every replay already remounts this subtree
  // and hands us a brand-new <video> sitting at 0. Rewinding here as well costs
  // nothing and makes the restart true even if that ever stops being the case.
  //
  // play() returns a promise that rejects when a browser refuses autoplay. That
  // is swallowed on purpose: the mark still arrives at the burst on its own, so
  // a refusal degrades to the PNG-only finale rather than throwing.
  // Start the clip VIDEO_START_MS into the run, so its final frame is the
  // burst. This is a timer rather than a stage gate because the moment it has
  // to fire at — 1332ms — is not a stage boundary, and the TIMELINE is not
  // ours to add one to.
  //
  // `stage` is deliberately NOT a dependency. When it was, the body re-ran at
  // every stage from HIGHLIGHT onward and rewound the clip six times a cycle.
  // Keyed on `run` alone, exactly one timer exists per run and the cleanup
  // cancels it, so that whole class of bug is gone by construction.
  //
  // A rejected play() is swallowed: the mark still arrives at the burst on its
  // own, so a browser refusing autoplay degrades to the PNG-only finale.
  useEffect(() => {
    setVideoOn(false);
    if (reduce || run === 0) return;
    const timer = window.setTimeout(() => {
      const el = videoRef.current;
      if (!el || startedRunRef.current === run) return;
      startedRunRef.current = run;
      el.playbackRate = VIDEO_RATE;
      el.currentTime = 0;
      setVideoOn(true);
      void el.play().catch(() => {});
    }, VIDEO_START_MS);
    return () => window.clearTimeout(timer);
  }, [reduce, run]);

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

  // The finale: the footage forms the mark, then hands over to the real asset.
  //
  // The OUTER span is the width reservation — the same trick every travelling
  // letter uses. It is in the layout from the very first frame at its final
  // size, so nothing on the line ever moves. BOTH the footage and the image are
  // absolutely positioned inside it and contribute no width of their own.
  //
  // `lg:` widens the slot and the image together, so the reservation can never
  // disagree with what is drawn into it.
  //
  // Sequencing, all derived from the TIMELINE rather than chosen:
  //   1332             footage starts at natural speed and fades up
  //   2207             its growth phase peaks, as the letters finish streaming
  //   HIGHLIGHT 2515   letters go gold; the stem is mid-bend
  //   TRAVEL    3115   gold letters fly; the curl sweeps down
  //   LANDED    3915   footage is on its FINAL frame — handover: footage out,
  //                    asset in, slot flares, and the wrapper travels right and
  //                    shrinks into the slot
  //   SETTLE    4115   flare relaxes to the resting halo
  function renderLockupMark() {
    // Reduced motion never mounts the video at all — static line, real asset.
    // Visibility follows the timer, not a stage, because the clip starts
    // between stages.
    const playing = !reduce && videoOn && !at(S.LANDED);
    const handed = reduce || at(S.LANDED);
    const flaring = stage === S.LANDED;
    return (
      <span
        aria-hidden
        className="relative ml-[0.06em] inline-block h-[0.42em] w-[0.854em] lg:ml-[0.14em] lg:h-[0.85em] lg:w-[1.727em]"
      >
        {!reduce && (
          // The footage, playing LARGE — this is the event, the lockup is the
          // resolution. Centred on the slot and deliberately overflowing the
          // section into the dark seam above and below it, which is why it
          // carries z-20: both neighbouring sections wrap their content in
          // z-10, and without this the overflow is painted over and clips.
          //
          // Bounded on purpose. At 1440 the peak reaches 39px past each edge
          // and stops 21px short of the hero's Apply Now button and 81px short
          // of the pain section's headline.
          //
          // The blend lives on THIS element, the same one Motion transforms,
          // deliberately. Put it on a child and the transform here would create
          // a stacking context, the child would blend against an empty backdrop
          // instead of the section, and the black would become a visible box.
          // For the same reason this wrapper must never carry `promote`.
          <motion.span
            // The two -mt values centre the sprout on the SECTION rather than on
            // the slot. The slot is baseline-aligned and its height doubles at
            // `lg`, so its centre sits below the line's centre at base and above
            // it at lg — left uncorrected the overflow comes out lopsided and
            // eats the clearance to the hero's button. Measured, then balanced.
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 -ml-[3.075em] -mt-[3.365em] block h-[6.41em] w-[6.15em] lg:-mt-[3.147em]"
            style={{ mixBlendMode: "screen" }}
            initial={false}
            animate={{
              opacity: playing ? 1 : 0,
              // Settles rightward into the lockup as it hands over.
              x: handed ? "0em" : "-0.9em",
              // Shrinks onto the slot. The slot doubles at `lg` while the frame
              // stays a constant em, so one factor cannot serve both widths —
              // the breakpoint is read, not assumed.
              scale: handed
                ? largeSlot
                  ? VIDEO_SHRINK_LG
                  : VIDEO_SHRINK_BASE
                : 1,
            }}
            transition={{
              opacity: {
                duration: dur(playing ? VIDEO_FADE_IN : HANDOVER_CROSSFADE),
                ease: EASE_OUT,
              },
              x: { duration: dur(HANDOVER), ease: EASE_OUT },
              scale: { duration: dur(HANDOVER), ease: EASE_OUT },
            }}
          >
            <video
              ref={videoRef}
              muted
              playsInline
              preload="metadata"
              aria-hidden
              disablePictureInPicture
              className="h-full w-full object-contain"
              onError={() => {}}
            >
              {/* mp4 FIRST, deliberately. iPhones have no VP9 hardware
                  decoder, so with the webm listed first Safari has to reject
                  it before reaching this — and if it accepts it instead, it
                  software-decodes VP9, which stutters. H.264 first means
                  Safari takes the hardware path immediately. Chrome and
                  Firefox still prefer the webm on their own. */}
              <source src="/video/sprout.mp4" type="video/mp4" />
              <source src="/video/sprout.webm" type="video/webm" />
            </video>
          </motion.span>
        )}

        <motion.span
          className="absolute inset-0 block"
          style={promote}
          initial={false}
          animate={{
            opacity: handed ? 1 : 0,
            y: "0em",
            // Arrives a touch large and settles, so the flare has something to
            // sit on rather than the asset simply switching on.
            scale: flaring ? 1.06 : 1,
            filter: flaring
              ? MARK_GLOW_BURST
              : handed
                ? MARK_GLOW_REST
                : MARK_GLOW_NONE,
          }}
          transition={{
            // Matches the footage's own swap, so the two cross exactly.
            opacity: { duration: dur(HANDOVER_CROSSFADE), ease: EASE_OUT },
            scale: {
              duration: dur(flaring ? HANDOVER_CROSSFADE : FLARE_DECAY),
              ease: EASE_OUT,
            },
            filter: {
              duration: dur(flaring ? HANDOVER_CROSSFADE : FLARE_DECAY),
              ease: EASE_OUT,
            },
          }}
        >
          <Image
            src="/images/yealth-mark.png"
            alt=""
            width={683}
            height={336}
            aria-hidden
            className="h-full w-full object-contain"
          />
        </motion.span>
      </span>
    );
  }

  return (
    <section className="bg-yealth-black">
      <div
        ref={ref}
        className="mx-auto max-w-[1200px] px-6 py-8 text-center md:px-8 md:py-10"
      >
        {/* One clean string for screen readers; the visual tree below is hidden. */}
        <span className="sr-only">health + wealth + youth = yealth</span>

        <div
          key={run}
          aria-hidden="true"
          className="flex items-baseline justify-center gap-x-[0.14em] whitespace-nowrap font-heading text-[clamp(0.95rem,5.3vw,3rem)] font-bold leading-[1.1] text-yealth-offwhite sm:gap-x-3"
        >
          {/* Left-hand side. Dims while the brand word lands, then brightens
              back up as the borrowed letters return in gold. */}
          <motion.span
            className="inline-flex items-baseline justify-center gap-x-[0.14em] sm:gap-x-3"
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

          <span className="inline-flex items-baseline gap-x-[0.14em] sm:gap-x-3">
            {renderEquals(EQUALS_INDEX * LETTER_STAGGER)}
            <span className="relative inline-flex items-baseline">
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
              {renderLockupMark()}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
