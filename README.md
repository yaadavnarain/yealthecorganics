# Yealth — Become a Farm Owner in Mauritius

Dark, cinematic marketing site for **Yealth** (yealth.mu), a Mauritian
farm-investment business. The site's primary goal is converting visitors into
webinar signups via the contact form.

- **Production:** https://yealthecorganics.vercel.app
- **Repo:** https://github.com/yaadavnarain/yealthecorganics

Any push to `main` triggers a Vercel auto-deploy (~90s).

## Stack

- Next.js 16.2 (App Router) + React 19 + TypeScript
- Tailwind CSS 3.4 with custom brand tokens
- `motion/react` (Framer Motion — never import from `framer-motion`)
- Radix UI primitives (`@radix-ui/react-accordion`)
- `lucide-react` icons
- Formspree for contact-form submissions
- Fonts: Quicksand 700 (headings, `font-heading`) + Nunito 400 (body, `font-body`)

## Brand tokens

| Token            | Value     |
| ---------------- | --------- |
| `yealth-gold`    | `#F5C842` |
| `yealth-mint`    | `#34D399` |
| `yealth-black`   | `#0A0A0A` |
| `yealth-offwhite`| `#F7F7F7` |

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
app/
├── layout.tsx              root layout: fonts, metadata, AmbientParticles + FloatingCta
├── page.tsx                composes the homepage sections
├── globals.css             design tokens + utility layers
├── sitemap.ts              generated /sitemap.xml
├── robots.ts               generated /robots.txt
├── terms/page.tsx          Terms of Service
├── privacy/page.tsx        Privacy Policy
└── components/
    ├── hero.tsx / hero-video.tsx     hero headline + background video
    ├── pain-section.tsx              the problem framing
    ├── own-section.tsx               cursor-tracked 3D tilt card
    ├── video-stats-section.tsx       explainer video + stat counters
    ├── vision-section.tsx
    ├── product-cards-section.tsx
    ├── how-it-works-section.tsx
    ├── three-paths-section.tsx
    ├── founder-section.tsx           Muktish, founder & CEO
    ├── faq-section.tsx
    ├── contact-section.tsx           webinar signup form → Formspree
    ├── final-cta-section.tsx
    ├── navbar.tsx / footer.tsx
    ├── floating-cta.tsx              sticky scroll CTA
    ├── ambient-particles.tsx        canvas particle field
    └── ui/                           accordion, animated-counter, form-field,
                                      product-card, social-icons, stat-card
lib/
├── motion.ts               fadeUp helper used across every section
├── use-count-up.ts         counter animation hook
└── utils.ts                cn() class helper
public/
├── images/                 backgrounds, founder photo, video poster
└── videos/                 coin-trees-hero.mp4
```

## Homepage section order (`app/page.tsx`)

Hero → Pain → OWN → VideoStats → Vision → ProductCards → HowItWorks →
ThreePaths → Founder → FAQ → Contact → FinalCTA

## Assets

Photographic assets live under `public/images/` (real imagery, not placeholders).
Sections with image backgrounds (Pain, OWN, HowItWorks, Founder) use a 5-stop
linear-gradient overlay for seamless edges rather than `maskImage` — see
`CLAUDE.md` for the exact blending convention.

The hero renders a real `<video>` (`/videos/coin-trees-hero.mp4`) that falls
back to `/images/coin-trees-poster.jpg` as its poster.

Social icons are inline React components in
`app/components/ui/social-icons.tsx` (e.g. `InstagramIcon`), not static SVG files.

## More context

See [`CLAUDE.md`](./CLAUDE.md) for brand voice, the section-blending visual
system, and the current pre-share checklist.
