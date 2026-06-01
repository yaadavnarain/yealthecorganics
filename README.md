# GreenSpace — Озеленение офисных помещений

Dark, cinematic, botanical single-page landing for an office-greening studio,
built from `greenspace-spec.md`.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 3.4 (`tailwind.config.ts`, tokens in `app/globals.css`)
- `motion/react` (Framer Motion) for entrance + float animations
- `lucide-react` icons
- Fonts: Manrope (headings) + Inter (body), Cyrillic + Latin subsets

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
app/
├── layout.tsx              <html lang="ru" class="dark">, fonts, metadata
├── page.tsx                composes the sections
├── globals.css             design tokens + @layer components utilities
└── components/
    ├── navbar.tsx           city selector, cart, mobile drawer
    ├── hero.tsx             layered fern bg, headline, product/CTA card
    ├── benefits-section.tsx intro + video module + stat cards
    ├── reasons-section.tsx  4-reason grid
    ├── contact-section.tsx  form over the flower-stalk photo
    ├── footer.tsx           static server component
    └── ui/                  stat-card, reason-card, form-field
lib/motion.ts                fadeUp helper
public/{images,videos}  assets
```

## Assets — placeholders

The photographic assets under `public/images/` are **hand-built SVG placeholders**
in the right dark-botanical mood so nothing renders broken. Replace them with the
real screenshot photography when available, then update the `src`/`poster` paths:

| Component                | Current placeholder            | Replace with                         |
| ------------------------ | ------------------------------ | ------------------------------------ |
| `hero.tsx` background    | `/images/hero-ferns.svg`       | `/images/hero-ferns.jpg` (≥2000px)   |
| `hero.tsx` product       | `/images/potted-plant.svg`     | `/images/potted-plant.png` (transparent) |
| `benefits` video poster  | `/images/office-poster.svg`    | `/images/office-poster.jpg` + `/video/office.mp4` |
| `contact` background     | `/images/contact-stalk.svg`    | `/images/contact-stalk.jpg` (tall)   |

The video module already renders a real `<video>` element that plays
`/video/office.mp4` on click and falls back to the poster when no footage exists.

Social icons are inline React components in `app/components/ui/social-icons.tsx` (e.g. `InstagramIcon`), not static SVG files.

All Russian copy is verbatim from the spec.
