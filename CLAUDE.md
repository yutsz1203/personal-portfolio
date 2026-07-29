# CLAUDE.md

Project rules. These apply to every session in this repo, without exception.

## Session start checklist

Before touching any code, in this order:

1. Read `NOTES.md` and identify the last completed milestone.
2. Re-read that milestone and the next one in `PLAN.md`.
3. State in chat: which milestone you are starting, its build mode, and — explicitly —
   what is listed as out of scope for it.

If `NOTES.md` has no checkpoint bullets for the last milestone, say so and ask whether to
proceed. Do not start a new milestone on top of an unreviewed one.

## Hard rules

- **One milestone per session.** Stop at `STOP HERE`, even when the next step is obvious,
  trivial, or already half-written in your head.
- **Answer the explain-it-back questions unprompted** as soon as the milestone's code is
  written. Answer them specifically: name the actual file and line, the actual tradeoff,
  and the actual corner cut. "It's a best practice" is not an answer.
- **Say what you cut.** Every milestone, list anything you simplified, stubbed, or
  hardcoded, even if it works fine. Silent shortcuts are the failure mode this file
  exists to prevent.
- **No silent decisions.** Where `PLAN.md` is underspecified, state both options and your
  pick with a one-line reason *before* implementing.
- **Keep diffs readable.** If a milestone's diff would exceed roughly 400 lines of
  meaningful code, stop and propose a split rather than producing it.
- **Don't commit yourself.** Let the user to do all the git actions.

## Settled decisions

The "Settled decisions" table in `PLAN.md` is closed. Do not relitigate mid-build —
propose changes as a `NOTES.md` entry instead, and only if something in it is actually
broken rather than merely not your preference.

## Style

- TypeScript, no `any`.
- Server components by default; `"use client"` only where interactivity or framer-motion
  requires it, and say why when you add it.
- Colour comes from the semantic tokens in `globals.css`. No raw hex values in
  components.
- No new dependency without naming it in chat first, with the reason and what it replaces.