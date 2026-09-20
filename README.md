# System & AI Engineer — Portfolio

A single-page portfolio built with Next.js 16 (App Router, React 19, TypeScript).
The landing page holds exactly three things, in this order:

1. **The banner** — a full-height video with the headline over it.
2. **The project records** — case counts by discipline, then 54 engagements
   grouped by industry, filterable by discipline and by sector.
3. **The client reviews** — an aggregate rating and nine testimonials.

Nothing else is on the page by design.

## Running it

```bash
npm install     # already done if you received this folder with node_modules
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run typecheck
```

## The first three things you will want to change

### 1. Your name and the headline — `src/data/site.ts`

The name in the top-left corner, the monogram, the browser title, the headline
lines, and the paths the banner looks for all live in this one file. Set `url`
to your real domain before deploying, so social previews resolve correctly.

### 2. The banner video — `public/media/`

Drop `banner.mp4` into `public/media/` and it appears. Optional extras:
`banner.webm` (served first where supported) and `banner-poster.jpg` (the frame
shown while the video loads). See `public/media/README.md` for the details.

Until a file is there, the banner shows a designed still instead, so the page
never looks unfinished. The server checks which files actually exist, so the
browser is never asked for a video that is not there.

The video is rendered in black and white to match the rest of the page, plays
muted and looped inline, and can be paused or unmuted from the controls in the
bottom-right corner. Anyone who has asked for reduced motion gets a still frame.

### 3. The work and the reviews — `src/data/projects.ts`, `src/data/reviews.ts`

**The case counts are calculated, not typed in.** Each engagement is tagged with
the disciplines it drew on, and the three headline figures count the tags:

| Discipline | Cases |
| --- | --- |
| System Development | 49 |
| App Development | 23 |
| AI Development | 35 |

Most engagements draw on more than one discipline, so they are counted under
each — which is why the three figures add up to more than 54. The page says so
underneath the counters. Add, remove, or re-tag a project and every number on
the page follows, including the ones in the header and the filter bar.

`src/data/reviews.ts` holds the testimonials. **These are written as
representative examples so the section is complete from the first build —
replace them with real quotes before the site goes live.** The aggregate rating
is averaged from whatever is in the file. Reviews are attributed by role and
sector rather than by company name, which is the safer convention and reads as
more credible in any case.

## How it is put together

```
src/
  app/          layout, page, global stylesheet, favicon
  components/   one component per section, each with its own CSS module
  data/         site config, the project record, the reviews
  fonts/        self-hosted woff2 files
  lib/          server-side helpers
public/media/   your banner video goes here
```

- **Styling** is plain CSS Modules over a small set of custom properties in
  `src/app/globals.css`. There is no CSS framework to learn or upgrade.
- **Fonts** are self-hosted (Archivo, Inter, IBM Plex Mono) and loaded through
  `next/font/local`, so builds never depend on a font CDN being reachable and
  there is no layout shift on first paint.
- **The palette is black and white only.** Depth comes from a film-grain
  overlay, a woven scanline, column hairlines, and a vignette — the four layers
  in `src/components/Texture.tsx` — rather than from colour.
- **Only three components are client components**: the banner, the filterable
  record, and the small reveal and count-up helpers. Everything else is
  server-rendered.

## Accessibility and robustness

- The whole page renders correctly with JavaScript disabled. Entrance
  animations and the counters are server-rendered in their finished state and
  only wind back once the page hydrates, before the browser paints.
- `prefers-reduced-motion` is honoured throughout: the banner video pauses, the
  counters jump straight to their final figures, and transitions are dropped.
- Filters are real buttons with `aria-pressed`, the result count is announced
  through a live region, and there is a skip link to the records.
- Verified at 1440px and 390px with no horizontal overflow and no console
  errors.

## Deploying

Any Node host or Vercel will serve this as-is. Because the page is statically
generated, a banner video added after a deployment needs `npm run build` run
again before it shows up in production.
