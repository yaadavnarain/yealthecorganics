# yealth — Financial Freedom for the Youth

Dark, cinematic marketing site for **yealth** (yealth.mu), a Mauritian membership
and agribusiness company. The site's primary goal is converting visitors into
membership applications. There is no on-site form: every CTA is an outbound link
to `https://join.yealth.mu/securemyspot`, labelled `Apply Now`.

- **Production:** https://yealthecorganics.vercel.app
- **Repo:** https://github.com/yaadavnarain/yealthecorganics

Any push to `main` triggers a Vercel auto-deploy (~90s).

## Stack

- Next.js 16.2 (App Router) + React 19 + TypeScript
- Tailwind CSS 3.4 with custom brand tokens
- `motion/react` (Framer Motion — never import from `framer-motion`)
- Radix UI primitives (`@radix-ui/react-accordion`)
- `lucide-react` icons
- Fonts: Quicksand 700 (headings, `font-heading`) + Nunito 400 (body, `font-body`)

## Brand tokens

| Token            | Value     |
| ---------------- | --------- |
| `yealth-gold`    | `#F5C842` |
| `yealth-mint`    | `#34D399` |
| `yealth-black`   | `#1D1C1F` |
| `yealth-offwhite`| `#FFFFF4` |
| `yealth-grey`    | `#A0A0A0` |

## Brand casing guard

"yealth" is always lowercase, everywhere — headings, titles, meta tags, alt text,
og tags, file names, identifiers and comments. `scripts/check-brand.mjs` runs as a
`prebuild` step and **fails `npm run build`** on any other casing. A PascalCase
identifier built from the brand word will break the build, which is why the brand
equation component exports `BrandEquation` from `yealth-equation.tsx`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (runs check-brand.mjs first)
npm run check-brand   # run the casing guard on its own
```

## Structure

```
app/
├── layout.tsx              root layout: fonts, metadata, AmbientParticles + FloatingCta
├── page.tsx                composes the homepage sections
├── globals.css             design tokens + utility layers
├── sitemap.ts              generated /sitemap.xml
├── robots.ts               generated /robots.txt
├── opengraph-image.tsx     1200x630 social card, generated at build with next/og
├── twitter-image.tsx       re-exports the card above so the two cannot drift
├── terms/page.tsx          Terms of Service
├── privacy/page.tsx        Privacy Policy
└── components/
    ├── hero.tsx                      hero headline, CTA, farm animation
    ├── HeroFlywheel.tsx              looping farm animation, pure SVG + CSS
    ├── yealth-equation.tsx           exports BrandEquation, the animated
                                      "health + wealth + youth = yealth" strip
    ├── pain-section.tsx              the problem framing
    ├── solution-section.tsx          build outside the system
    ├── outcomes-section.tsx          where this takes you, 3 numbered outcomes
    ├── product-cards-section.tsx     renders the Benefits grid, 7 cards
    ├── agribusiness-owner-section.tsx  farm co-ownership, separate from
                                      membership, no CTA
    ├── how-it-works-section.tsx      4 steps: apply, watch, attend, decide
    ├── founder-section.tsx           Muktish, Founder and CEO
    ├── faq-section.tsx               17 questions, homepage section not a route
    ├── final-cta-section.tsx
    ├── navbar.tsx / footer.tsx
    ├── floating-cta.tsx              sticky scroll CTA
    ├── ambient-particles.tsx         canvas particle field
    └── ui/                           accordion, glow, social-icons
lib/
├── motion.ts               fadeUp helper used across every section
└── utils.ts                cn() class helper
scripts/
└── check-brand.mjs         brand-casing guard, wired as prebuild
proxy.ts                    basic-auth gate for the off-grid solar calculator
public/
├── images/                 backgrounds, founder photo, logo mark
└── tools/                  static calculator pages served via rewrites
```

## Homepage section order (`app/page.tsx`)

Navbar → Hero → BrandEquation → PainSection → SolutionSection → OutcomesSection →
ProductCardsSection → AgribusinessOwnerSection → HowItWorksSection →
FounderSection → FaqSection → FinalCtaSection → Footer

`ProductCardsSection` keeps its original filename and export name but renders the
Benefits grid ("What your membership gives you", seven cards).

## Assets

Photographic assets live under `public/images/` (real imagery, not placeholders).
Sections with image backgrounds (Pain, HowItWorks, Founder) use a 5-stop
linear-gradient overlay for seamless edges rather than `maskImage` — see
`CLAUDE.md` for the exact blending convention.

The hero renders `HeroFlywheel`, a pure SVG + CSS-keyframe animation with no JS at
runtime and a static reduced-motion fallback. There is no hero video.

The social preview card is generated at build time by `app/opengraph-image.tsx`
using `next/og`, at 1200x630, with Quicksand fetched from Google Fonts during the
build and the font bundled with `@vercel/og` as the fallback if that fetch fails.
`app/twitter-image.tsx` re-exports it. Nothing points at a static
`public/og-image.png`, and `og:image` / `twitter:image` are not listed in
`metadata` — the file conventions emit both, absolute against `metadataBase`.

## Private routes

`proxy.ts` puts HTTP Basic Auth in front of `/pvcalculatoroffgrid` and the static
file it rewrites to, `/tools/pvcalculator.html`. Credentials come from the
`PV_CALC_USER` and `PV_CALC_PASSWORD` environment variables and it fails closed,
returning 503 if they are unset. `/calculator` is public and deliberately outside
the matcher.

This is the Next 16 `proxy` file convention, which replaced `middleware`. The
function must be exported as `proxy` (or as the default), `config.matcher` works
exactly as before, and proxy always runs on the Node.js runtime, so the file must
not export `runtime`.

Social icons are inline React components in
`app/components/ui/social-icons.tsx` (e.g. `InstagramIcon`), not static SVG files.

## More context

See [`CLAUDE.md`](./CLAUDE.md) for brand voice, the section-blending visual
system, and the current pre-share checklist.
