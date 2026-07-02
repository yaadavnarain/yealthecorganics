# Yealth Website — Project Context for Claude Code

## What this is

Marketing website for **Yealth** (yealth.mu) — a Mauritian farm-investment business. Founder and CEO: Muktish. The site's primary goal is converting visitors into webinar signups via the contact form, so every change should serve that funnel.

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
- Formspree for contact form submissions (free tier, 50/mo)

## Brand — respect exactly

- **Colors**: yealth-gold `#F5C842`, yealth-mint `#34D399`, yealth-black (Dark Charcoal) `#1D1C1F`, yealth-offwhite (White Gold) `#FFFFF4`
- **Fonts**: Quicksand 700 (headings, class `font-heading`), Nunito 400 (body, class `font-body`)
- **Tone**: confident, anti-corporate, Mauritian-rooted. Never marketing-speak. No "synergy" / "leverage" / "ecosystem".
- **Tagline**: "Become a farm owner for Rs 1,288/mo. Monthly Passive Income. Own Assets. Retire Early. Generational Wealth."

## Homepage section order (`app/page.tsx`)

Hero → Pain → OWN → VideoStats → Vision → ProductCards → HowItWorks → ThreePaths → Founder → FAQ → Contact → FinalCTA

## Key files

- `app/layout.tsx` — root layout, includes AmbientParticles + FloatingCta
- `app/page.tsx` — homepage section composition
- `app/components/` — every homepage section as its own .tsx file
- `app/components/ui/` — reusable primitives (form-field, accordion, animated-counter, social-icons)
- `lib/motion.ts` — `fadeUp` helper used across every section
- `public/images/` — all image assets (including the GPT-generated `nature-*-v2.png` set)
- `public/videos/coin-trees-hero.mp4` — hero video (15s)

## Visual system convention — section blending

For sections with image backgrounds (Pain, OWN, HowItWorks, Founder), the seamless-edge pattern is:

- No `maskImage` on the image div — causes flat black bands at section boundaries
- Instead, a 5-stop linear gradient overlay: solid `yealth-black` at 0% → ~0.5 opacity at 14% → ~0.3 opacity at 50% → ~0.5 opacity at 86% → solid `yealth-black` at 100%
- Image opacity 0.42–0.50 with `mixBlendMode: "lighten"` for warm integration

This pattern is already implemented across all four sections. Do not reintroduce mask-based fading.

## Already done

- All 8 animation layers (fade-ins, counters, hero parallax, floating CTA, magnetic cards, smooth scroll, ambient particles, reduced-motion gating)
- AmbientParticles canvas (45 desktop / 20 mobile)
- OWN section with cursor-tracked 3D tilt
- All sections wired with the seamless gradient blending described above
- Deployed to Vercel via GitHub on `main` branch

## Pending pre-share blockers (priority order)

1. **Contact form → Formspree wiring**. `app/components/contact-section.tsx` currently only sets local state — submissions vanish. Need to POST to `https://formspree.io/f/<FORM_ID>` as JSON with name/phone/comment plus a `_subject` field. Form ID goes in a `FORMSPREE_ID` constant near the top of the file.
2. **`/terms` and `/privacy` pages**. Footer and contact form link to these but they 404. Either draft both at `app/terms/page.tsx` and `app/privacy/page.tsx`, or strip the links.
3. **Replace placeholders**: phone (`+230 5XXX XXXX`), email (`support@muktish.com`), social URLs (currently `#`) in `contact-section.tsx`, `footer.tsx`, and `social-icons.tsx`.
4. **Mobile rendering broken**. On iPhone Safari most content stays at opacity 0 — likely Framer Motion's `whileInView` not firing or reduced-motion preference being triggered. Needs investigation before sharing with phone-first audiences (which in Mauritius is most of them).
5. **SEO basics**: favicon at `public/favicon.ico`, OG image at `public/og-image.png` (1200×630), expanded openGraph + twitter metadata in `app/layout.tsx`, sitemap.xml, robots.txt.
6. **Cleanup pass**: delete `lib/images.ts` (no longer imported), v1 versions of nature images now replaced by v2, and `hero-ferns.jpg` / `hero-produce.jpg` / `video-farm.jpg` / `founder-placeholder.svg` if confirmed unused.
7. **Muktish explainer video**: when recorded, drop MP4 at `public/videos/muktish-explainer.mp4` and change `VIDEO_URL` from `null` to that path in `video-stats-section.tsx`.

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
git add -A
git commit -m "your message"
git push origin main
```
