# CLAUDE.md

Personal portfolio site. Minimal, mostly black-and-white with a clay accent, light/dark,
static Next.js on Vercel. Project rules below apply to every session in this repo.

## Remaining work

Everything else is built. Only two content areas are still unwritten:

1. **Books** — `sections/books.tsx` + `book-cover.tsx`, rendered on `/` (teaser, links to
   `/books`) and on `/books`.

`src/app/projects/page.tsx` and `src/app/books/page.tsx` are still stubs — bare `<ul>`
markup, no styling. `src/app/page.tsx` has empty `<section>` shells for both (the Projects
and Books headings with nothing under them). Those four spots are the targets.

`src/content/projects.ts` and `src/content/books.ts` hold **placeholder data**, and the
images they reference (`public/projects/*.webp`, `public/books/*.webp`) **do not exist
yet**. Build against the types, not the placeholder strings. Do not invent real project or
book content — ask.

## Hard rules

- **No git actions.** No commit, no branch, no push, no PR. The user does all of it.
- **Say what you cut.** After each change, list anything simplified, stubbed, or
  hardcoded, even if it works.
- **No silent decisions.** Where this file is underspecified, state the options and your
  pick with a one-line reason before implementing.
- **Keep diffs readable.** Past roughly 400 lines of meaningful code, stop and propose a
  split.

## Stack facts that differ from defaults

Read these before writing code; several are not what training data assumes.

- **Next.js 16, App Router.** See `AGENTS.md` — read the relevant guide in
  `node_modules/next/dist/docs/` before using framework APIs.
- **Motion is the `motion` package**, not `framer-motion`. Import from `"motion/react"`.
- **Tailwind v4, no `tailwind.config.ts`.** All tokens live in `src/app/globals.css`
  under `@theme` / `@theme inline`, with `:root` and `.dark` blocks.
- **Icons come from `react-icons`** (`Si*` set), not `simple-icons`. Slugs are typed as
  `SkillSlug` in `src/content/types.ts` and mapped in `src/components/common/icons.tsx`.
- **shadcn/ui components are copied in** under `src/components/ui/`. Only Button and
  DropdownMenu exist; add more only on demand.
- Fully static: no route handlers, no SSR, no DB, no external content source.

## Style

- TypeScript, no `any`.
- Server components by default. `"use client"` only where interactivity or `motion`
  requires it, and say why when adding it.
- Colour comes from the semantic tokens (`bg-background`, `text-muted-foreground`,
  `border-border`, `accent-clay`, …). No raw hex in components.
- Type scale tokens too: `text-caption`, `text-body-sm`, `text-body`, `text-subheading`,
  `text-heading`, `text-display`, each with its matching `leading-*` / `tracking-*`.
- Headings use `font-heading` (the serif).
- Images always through `next/image`, with the `Image` type from `content/types.ts`
  supplying `src`/`alt`/`width`/`height` — dimensions are known at build, so no layout
  shift.

## Conventions to match

**Home page sections.** Current live order in `src/app/page.tsx`: Hero, Experience,
Projects, Skills & Technologies, Education, Books. Each section is:

```tsx
<section id="projects" className="mx-auto max-w-3xl pb-16">
  <Reveal>
    <h2 className="mb-8 border-b border-border pb-3 font-heading text-subheading leading-subheading">
      Projects
    </h2>
  </Reveal>
  {/* content */}
</section>
```

The Projects and Books shells currently have **no `id`**. `nav-bar.tsx` routes those two
to `/projects` and `/books` rather than anchors, so an `id` is optional — but add one if
anything links to them in-page, and keep `nav-bar.tsx` and `mobile-nav.tsx` in sync.

**Motion.** Reuse the primitives; do not hand-roll animation.

- `Reveal` — one element rises/fades. `trigger="view"` (default) or `"mount"` for
  above-the-fold content, plus optional `delay`.
- `StaggerList` / `StaggerItem` — parent orchestrates children. The `as` prop picks the
  tag (`ul`, `ol`, `li`, …) so markup stays semantic.
- Shared numbers live in `components/motion/timing.ts`. Hero-adjacent content chains off
  `HERO_ENTRANCE_END`; don't hardcode competing delays.

**Data mapping.** Pages map content into presentational props at the top of the file (see
`experienceEntries` / `educationEntries` in `page.tsx`) rather than passing raw content
types into components. `featuredProjects` is already exported from `content/projects.ts`.

## Design intent for the two remaining sections

Settled earlier; treat as the starting point, not up for redesign.

- **Project rows**: text on one side (name, blurb, tech tags as plain monochrome text,
  live / source links), full-colour screenshot on the other via `next/image`, stacking on
  mobile.
- **Book covers**: hover animation — cover lifts, tilts slightly, shadow deepens.

## Non-goals

Do not build these, and do not propose them mid-task:

- Blog / writing section
- Standalone contact section, or a contact form with any backend
- CV PDF download button
- `/projects/[slug]` detail pages, or book detail views
- Filtering, sorting, search, tag pages, pagination
- Reading progress or star ratings on books
- Desaturating project screenshots — they are full colour on purpose
- MDX, a CMS, or any external content source
- i18n
- Any design system beyond the token block in `globals.css`

Good ideas outside this list go in `docs/NOTES.md`, not into the code.