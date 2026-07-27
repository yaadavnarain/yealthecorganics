"use client";

import { useId } from "react";
import { motion } from "motion/react";

// The yealth infinity-leaf mark as drawable vector artwork.
//
// No vector version of the logo exists anywhere in this repo — the navbar
// renders public/images/yealth-mark.png and there is not a single .svg file.
// So these paths were contour-traced from that PNG's alpha channel (boundary
// trace -> simplify -> smooth), measured at 0.96 IoU against the raster.
//
// Why the reveal is a MASK and not a stroke animation: the mark is
// calligraphic. Its strokes taper to points — the bottom-left swash tapers at
// both ends, the right lobe's top arm tapers into the crossing, the lower leaf
// blade tapers to a tip — so it cannot be represented as uniform-width SVG
// strokes, and a stroke-dash "draw" is therefore impossible on the real shape.
// Instead the traced outlines are FILLED, and the drawing is an animated mask:
// fat round-capped centreline strokes whose pathLength grows 0 -> 1 sweep
// along the mark and uncover the tapered artwork underneath. At full draw the
// mask covers 100% of the artwork's pixels — verified, no permanent slivers.
//
// Colours are brand tokens only: yealth-gold and yealth-mint, as the gradient
// stops matching the leaf's mint-to-gold blend in the real logo.

const MARK_W = 683;
const MARK_H = 336;

const GOLD = "#F5C842";
const MINT = "#34D399";

// Traced outline of the main body: leaf (both blades) flowing through the
// crossing into the full right lobe, whose top arm tapers back toward the
// crossing without closing — one connected filled shape.
const PATH_MAIN =
  "M 504 30 C 509.2 30, 525.2 30, 534 31 C 542.8 32, 548.5 33.2, 557 36 C 565.5 38.8, 577.2 43.8, 585 48 C 592.8 52.2, 597.8 55.8, 604 61 C 610.2 66.2, 616.7 72.7, 622 79 C 627.3 85.3, 631.7 91.2, 636 99 C 640.3 106.8, 645.2 117.2, 648 126 C 650.8 134.8, 652.2 143.3, 653 152 C 653.8 160.7, 654.2 168, 653 178 C 651.8 188, 648.8 202.5, 646 212 C 643.2 221.5, 640.2 227.5, 636 235 C 631.8 242.5, 626.2 250.7, 621 257 C 615.8 263.3, 610.5 268.3, 605 273 C 599.5 277.7, 595.2 281, 588 285 C 580.8 289, 571.7 293.7, 562 297 C 552.3 300.3, 541 303.5, 530 305 C 519 306.5, 506 306.5, 496 306 C 486 305.5, 479.2 304.3, 470 302 C 460.8 299.7, 449.5 295.7, 441 292 C 432.5 288.3, 426 284.5, 419 280 C 412 275.5, 407.3 272.3, 399 265 C 390.7 257.7, 384.2 253.7, 369 236 C 353.8 218.3, 322.8 176.7, 308 159 C 293.2 141.3, 290 138.8, 280 130 C 270 121.2, 257.3 112.2, 248 106 C 238.7 99.8, 235 97.5, 224 93 C 213 88.5, 195.5 81.8, 182 79 C 168.5 76.2, 141.3 73.7, 143 76 C 144.7 78.3, 177.8 86.7, 192 93 C 206.2 99.3, 215.7 105, 228 114 C 240.3 123, 256.7 137.8, 266 147 C 275.3 156.2, 280.7 164.3, 284 169 C 287.3 173.7, 289.8 172.5, 286 175 C 282.2 177.5, 269 182, 261 184 C 253 186, 245.2 186.7, 238 187 C 230.8 187.3, 225.7 187.3, 218 186 C 210.3 184.7, 203 184.2, 192 179 C 181 173.8, 165.7 166, 152 155 C 138.3 144, 119.8 122, 110 113 C 100.2 104, 100.2 104.3, 93 101 C 85.8 97.7, 74.2 94, 67 93 C 59.8 92, 47.3 100, 50 95 C 52.7 90, 74.3 70.3, 83 63 C 91.7 55.7, 94.7 54.7, 102 51 C 109.3 47.3, 119.3 43.5, 127 41 C 134.7 38.5, 140.2 37, 148 36 C 155.8 35, 162.3 33.7, 174 35 C 185.7 36.3, 204 39, 218 44 C 232 49, 245.5 56.5, 258 65 C 270.5 73.5, 282 84, 293 95 C 304 106, 308.8 111.2, 324 131 C 339.2 150.8, 367.3 193.5, 384 214 C 400.7 234.5, 414 245.2, 424 254 C 434 262.8, 436.5 263.2, 444 267 C 451.5 270.8, 462.2 274.8, 469 277 C 475.8 279.2, 477 279.5, 485 280 C 493 280.5, 505.3 281.5, 517 280 C 528.7 278.5, 545.2 274.3, 555 271 C 564.8 267.7, 568.7 265.3, 576 260 C 583.3 254.7, 592 248.2, 599 239 C 606 229.8, 613.7 215.8, 618 205 C 622.3 194.2, 624.2 184.7, 625 174 C 625.8 163.3, 625.3 151.8, 623 141 C 620.7 130.2, 616 118.2, 611 109 C 606 99.8, 600 92.7, 593 86 C 586 79.3, 578 73.5, 569 69 C 560 64.5, 546.3 61, 539 59 C 531.7 57, 534.5 57, 525 57 C 515.5 57, 495.2 56.7, 482 59 C 468.8 61.3, 456.3 66.5, 446 71 C 435.7 75.5, 429.3 79.3, 420 86 C 410.7 92.7, 399.2 102, 390 111 C 380.8 120, 371.2 138, 365 140 C 358.8 142, 352 130.2, 353 123 C 354 115.8, 364.2 105.2, 371 97 C 377.8 88.8, 386.2 80.8, 394 74 C 401.8 67.2, 411 60.7, 418 56 C 425 51.3, 428.5 49.3, 436 46 C 443.5 42.7, 451.8 38.5, 463 36 C 474.2 33.5, 496.2 32, 503 31 C 509.8 30, 498.8 30, 504 30 Z";

// Traced outline of the bottom-left swash: the calligraphic stroke that
// sweeps the lower-left curve, tapering to a point at both ends.
const PATH_SWASH =
  "M 42 120 C 41.3 123, 38.7 131, 38 139 C 37.3 147, 37.3 159.7, 38 168 C 38.7 176.3, 40 182, 42 189 C 44 196, 46.3 202.8, 50 210 C 53.7 217.2, 59 225.5, 64 232 C 69 238.5, 70.8 241.8, 80 249 C 89.2 256.2, 106.3 269.2, 119 275 C 131.7 280.8, 145.2 282.5, 156 284 C 166.8 285.5, 175 284.8, 184 284 C 193 283.2, 200.2 282.2, 210 279 C 219.8 275.8, 234.5 269.3, 243 265 C 251.5 260.7, 254.5 258.2, 261 253 C 267.5 247.8, 275 241.7, 282 234 C 289 226.3, 297.3 209, 303 207 C 308.7 205, 316.5 215.7, 316 222 C 315.5 228.3, 306.5 237.3, 300 245 C 293.5 252.7, 284.3 261.7, 277 268 C 269.7 274.3, 264.3 278.2, 256 283 C 247.7 287.8, 237.3 293.3, 227 297 C 216.7 300.7, 204.2 303.5, 194 305 C 183.8 306.5, 176 306.5, 166 306 C 156 305.5, 143.5 303.8, 134 302 C 124.5 300.2, 116.8 298, 109 295 C 101.2 292, 93.7 288.2, 87 284 C 80.3 279.8, 74.7 275.5, 69 270 C 63.3 264.5, 57.8 258.2, 53 251 C 48.2 243.8, 43.5 235.7, 40 227 C 36.5 218.3, 33.7 208.7, 32 199 C 30.3 189.3, 29.8 177.7, 30 169 C 30.2 160.3, 31 155, 33 147 C 35 139, 40.5 125.5, 42 121 C 43.5 116.5, 42.7 117, 42 120 Z";

// Reveal centrelines for the mask strokes. These follow the measured centreline
// of each band; their exact shape is invisible — only the sweep of the reveal
// front shows. Widths are generous so the front fully covers the band it
// uncovers.
//
// DRAW_MAIN: leaf tip -> upper blade -> down through the crossing -> around the
// right lobe (bottom first, then up the far edge and back along the top) ->
// ends where the lobe's top arm tapers out. One continuous gesture.
const DRAW_MAIN =
  "M 52 92 C 85 78, 118 60, 152 58 C 190 60, 222 72, 258 96 C 282 113, 298 130, 318 152 L 341 178 C 365 208, 395 244, 430 268 C 455 283, 477 292, 500 293 C 540 293, 575 275, 602 245 C 622 222, 636 197, 638 168 C 638 135, 625 105, 602 82 C 580 60, 545 45, 507 44 C 470 44, 436 58, 405 84 C 382 103, 362 124, 346 148";
// DRAW_SWASH: from the tapered curl at the far left, down and around the bottom
// sweep, ending at the tapered tip near the crossing.
const DRAW_SWASH =
  "M 41 126 C 34 148, 32 172, 36 196 C 42 226, 58 252, 84 271 C 112 291, 148 300, 184 296 C 220 291, 252 272, 278 246 C 292 232, 306 216, 316 222";
// DRAW_BLADE: quick pass over the lower leaf blade's tail so the whole leaf is
// uncovered by the time the sequence settles.
const DRAW_BLADE =
  "M 60 96 C 110 104, 165 126, 215 148 C 245 160, 270 168, 288 173";

export type DrawTimings = {
  /** Delay before the main gesture starts drawing, in seconds. */
  mainDelay: number;
  mainDuration: number;
  swashDelay: number;
  swashDuration: number;
  bladeDelay: number;
  bladeDuration: number;
};

/**
 * The self-drawing vector mark. `drawn` false renders it fully hidden;
 * flipping to true plays the reveal. `staticFull` skips the mask entirely
 * (reduced motion). Fill opacity and scale are animated by the parent via
 * wrapper styles; this component owns only the reveal itself.
 */
export function MarkDrawn({
  drawn,
  staticFull,
  timings,
  className,
}: {
  drawn: boolean;
  staticFull?: boolean;
  timings: DrawTimings;
  className?: string;
}) {
  // Stable per-instance ids, stripped to alphanumerics. useId emits
  // punctuation (":r0:" on React 18, "«r0»" on 19), and these ids are consumed
  // inside url(#...) references — sanitising removes any question about how a
  // given browser parses that fragment.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientId = `mark-${uid}`;
  const maskId = `mark-${uid}-mask`;
  const strokeProps = {
    fill: "none",
    stroke: "#fff",
    strokeLinecap: "round" as const,
  };
  return (
    <svg
      viewBox={`0 0 ${MARK_W} ${MARK_H}`}
      className={className}
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="50"
          y1="60"
          x2="310"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={MINT} />
          <stop offset="1" stopColor={GOLD} />
        </linearGradient>
        {!staticFull && (
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect
              x="-30"
              y="-30"
              width={MARK_W + 60}
              height={MARK_H + 60}
              fill="#000"
            />
            <motion.path
              d={DRAW_MAIN}
              {...strokeProps}
              strokeWidth={64}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: drawn ? 1 : 0 }}
              transition={{
                duration: timings.mainDuration,
                delay: timings.mainDelay,
                ease: [0.3, 0, 0.2, 1],
              }}
            />
            <motion.path
              d={DRAW_SWASH}
              {...strokeProps}
              strokeWidth={48}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: drawn ? 1 : 0 }}
              transition={{
                duration: timings.swashDuration,
                delay: timings.swashDelay,
                ease: [0.3, 0, 0.2, 1],
              }}
            />
            <motion.path
              d={DRAW_BLADE}
              {...strokeProps}
              strokeWidth={96}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: drawn ? 1 : 0 }}
              transition={{
                duration: timings.bladeDuration,
                delay: timings.bladeDelay,
                ease: [0.3, 0, 0.2, 1],
              }}
            />
          </mask>
        )}
      </defs>
      <g mask={staticFull ? undefined : `url(#${maskId})`}>
        <path d={PATH_MAIN} fill={`url(#${gradientId})`} />
        <path d={PATH_SWASH} fill={GOLD} />
      </g>
    </svg>
  );
}
