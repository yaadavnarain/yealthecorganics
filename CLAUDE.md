# yealth Website — Project Context for Claude Code

## What this is

Marketing website for **yealth** (yealth.mu) — a Mauritian membership and agribusiness company. Founder and CEO: Muktish. The site's primary goal is converting visitors into membership applications, so every change should serve that funnel. There is no on-site form: every CTA is an outbound link to `https://join.yealth.mu/securemyspot` and every CTA label reads exactly `Apply Now`.

## Live URLs

- Production: https://yealthecorganics.vercel.app
- GitHub repo: https://github.com/yaadavnarain/yealthecorganics
- Vercel: project `yealthecorganics` in workspace `yaadavnarain-6510` (Hobby tier)

Any push to `main` triggers Vercel auto-deploy in ~90 seconds.

## Tech stack

- Next.js 16.2 (App Router, not Pages Router)
- React 19
- Tailwind CSS with custom brand tokens
- `motion/react` (Framer Motion via the new package name — never import from `framer-motion`)
- Radix UI primitives
- lucide-react for icons

## Brand — respect exactly

- **Colors**: yealth-gold `#F5C842`, yealth-mint `#34D399`, yealth-black (Dark Charcoal) `#1D1C1F`, yealth-offwhite (White Gold) `#FFFFF4`
- **Fonts**: Quicksand 700 (headings, class `font-heading`), Nunito 400 (body, class `font-body`)
- **Tone**: confident, anti-corporate, Mauritian-rooted. Never marketing-speak. No "synergy" / "leverage" / "ecosystem".
- **Positioning line**: "Financial Freedom for the Youth." No price appears anywhere on the homepage.
- **Casing**: "yealth" is always lowercase, in every position — headings, titles, meta tags, alt text, og tags, file names, identifiers and comments. `scripts/check-brand.mjs` runs as a `prebuild` guard and **fails `npm run build`** on any other casing, so a PascalCase identifier built from the brand word will break the build. This is why the brand-equation component exports `BrandEquation` from `app/components/yealth-equation.tsx`.

## Homepage section order (`app/page.tsx`)

Navbar → Hero → BrandEquation → PainSection → SolutionSection → OutcomesSection → ProductCardsSection → AgribusinessOwnerSection → HowItWorksSection → FounderSection → FaqSection → FinalCtaSection → Footer

`ProductCardsSection` keeps its original filename and export name but now renders the **Benefits** grid ("What your membership gives you", seven cards). Do not rename it — a rename is unnecessary churn, and the brand guard rejects any identifier carrying a cased brand token.

## Key files

- `app/layout.tsx` — root layout, includes AmbientParticles + FloatingCta
- `app/page.tsx` — homepage section composition
- `app/components/` — every homepage section as its own .tsx file
- `app/components/HeroFlywheel.tsx` — the looping farm animation inside the hero. Pure SVG + CSS keyframes, no JS at runtime
- `app/components/yealth-equation.tsx` — exports `BrandEquation`, the animated "health + wealth + youth = yealth" strip directly under the hero
- `app/components/faq-section.tsx` — the FAQ is a **homepage section**, not its own route. 17 questions in a `FAQ_ITEMS` array rendered through the Radix accordion, anchored at `#faq`
- `app/components/ui/` — reusable primitives (accordion, glow, social-icons)
- `app/opengraph-image.tsx` — the 1200×630 social card, generated at build time with `next/og`. `app/twitter-image.tsx` re-exports it so the two cards can never drift. Neither `og:image` nor `twitter:image` is listed in `metadata`; the file conventions emit both
- `proxy.ts` — HTTP Basic Auth gate for the off-grid solar calculator, matched to `/pvcalculatoroffgrid` and `/tools/pvcalculator.html` only. This is the Next 16 replacement for the deprecated `middleware.ts` convention: same signature, same `config.matcher`, but the function is exported as `proxy` and it always runs on the Node.js runtime, so it must not export `runtime`
- `lib/motion.ts` — `fadeUp` helper used across every section
- `public/images/` — all image assets
- `scripts/check-brand.mjs` — the brand-casing guard, wired as `prebuild`

## Visual system convention — section blending

For sections with image backgrounds (Pain, HowItWorks, Founder), the seamless-edge pattern is:

- No `maskImage` on the image div — causes flat black bands at section boundaries
- Instead, a 5-stop linear gradient overlay: solid `yealth-black` at 0% → ~0.5 opacity at 14% → ~0.3 opacity at 50% → ~0.5 opacity at 86% → solid `yealth-black` at 100%
- Image opacity 0.42–0.50 with `mixBlendMode: "lighten"` for warm integration

This pattern is already implemented across all three sections. Do not reintroduce mask-based fading.

## Already done

- All animation layers (fade-ins, hero parallax, floating CTA, magnetic cards, smooth scroll, ambient particles, reduced-motion gating)
- AmbientParticles canvas (45 desktop / 20 mobile)
- HeroFlywheel farm animation and the BrandEquation strip
- All image-backed sections wired with the seamless gradient blending described above
- `/terms` and `/privacy` pages exist and are linked from the footer
- Footer contact details are real: WhatsApp +230 5452 3432, hotline 86662, info@yealth.mu
- favicon, app icons, `sitemap.ts` and `robots.ts` in place
- Social preview card generated at build time from `app/opengraph-image.tsx`
- Membership-first content rewrite and the 17-question FAQ shipped
- Deployed to Vercel via GitHub on `main` branch

## Pending pre-share blockers (priority order)

1. **Social URLs are still placeholders**. All five entries in `SOCIALS` in `footer.tsx` have `href: "#"`. Phone, hotline and email are real.
2. **Mobile rendering**. Historically on iPhone Safari most content stayed at opacity 0, likely Framer Motion's `whileInView` not firing. The hero was reworked to fire entrances on mount (`animate`, not `whileInView`) for exactly this reason — see the comment at the top of `hero.tsx`. The rest of the page still uses `whileInView` via `fadeUp` and has not been re-verified on a real device.
3. **`PV_CALC_USER` and `PV_CALC_PASSWORD` in Vercel are unverified.** They exist in `.env.local`, so the auth gate works locally. If they are absent in the Vercel project, `/pvcalculatoroffgrid` returns 503 rather than opening up, so it fails closed, but the page is then unreachable.

## Communication preferences

- Plain language over dense technical jargon
- Concise summaries — say what and why, not what every line does
- Walk through branching paths when troubleshooting ("if X then Y, otherwise Z")
- Don't ask permission for every micro-decision — make the obvious calls, flag genuinely ambiguous ones
- When something blocks shipping, name it as a blocker

## Standard workflow

1. Make code changes (you do them, or ask me to do them)
2. Test locally: `npm run dev` then visit http://localhost:3000
3. Commit + push:

```bash
# Stage files individually by name. Never use `git add -A`.
git add path/to/first-file.tsx path/to/second-file.tsx
git commit -m "your message"
git push origin main
```
