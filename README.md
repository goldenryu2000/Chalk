# Chalk

**A curriculum-locked AI lesson studio for Indian classrooms.**

A teacher picks *board → class → subject → chapter* and gets a ready-to-teach
interactive lesson — explainers, labelled diagrams, matching, ordering and quiz
games. They edit and approve every block before a single student sees it. The
same lesson then runs two ways: on the projector for the whole class, or on a
student's phone as scored homework.

This repository is a **concept demo**. It is frontend only. No AI model is
called, no account exists and nothing is stored — the lesson is hand-written
NCERT content and the generation is a scripted animation. The point is to make
the idea concrete enough to argue about.

---

## The two-minute journey

Follow this in order. It is the whole product argument.

| # | Screen | What to look at |
|---|--------|-----------------|
| 1 | **`/`** — Landing | The pitch. Skip if you already know it. |
| 2 | **`/dashboard`** — Teacher home | Meera teaches Class 10-B at 11:15. Hit **+ New lesson**. |
| 3 | **`/generate`** — Pick the chapter | Not a prompt box: board, class, subject, chapter, with the syllabus already known. Leave it on CBSE · Class 10 · Science · Chapter 9 and press **Build the lesson**. Watch the outline fill in — and watch it admit that outcome **9.6 was not covered**. |
| 4 | **`/review`** — The editor | The heart of it. Every block is tagged to an NCERT learning outcome, and the coverage panel says **5 of 6**. Try: select a quiz block and hit **↻ Regenerate** (swaps in a different question), hit **Edit text** and change the wording, then **Cover it** to fill the 9.6 gap. Nothing is published until you press **Approve & publish**. |
| 5 | **`/present`** — Classroom mode | Full-bleed blackboard for the projector. Drive it with **← →**, **Esc** to exit. On a quiz block, press **Reveal answer** to show the class response split. |
| 6 | **`/play`** — Solo mode | The identical lesson on a student's phone, one block at a time and scored. The labelled ray diagram and the matching set both really work — tap a label, then tap where it goes. |
| 7 | **`/play?game`** — Rapid Fire | The game shell: the lesson's own quiz blocks on a 15-second clock, with streaks and points. No extra content was authored for it, which is the whole idea. |
| 8 | **`/results`** — Class results | Because every block carries an outcome id, a wrong answer points at a *specific thing the class did not learn* — "18 students dropped the sign convention" — not just a low score. |

Steps 5–7 all read the lesson you edited in step 4, so changes made in review
show up on the board and on the phone.

## What the idea rests on

Four claims, and each screen exists to demonstrate one:

1. **Curriculum lock.** Chapters, not prompts. Every block is tied to a declared
   NCERT learning outcome, so coverage is checkable and gaps are visible.
2. **Teacher in the loop.** Nothing auto-publishes. Edit, regenerate, delete,
   reorder — then approve. The teacher stays the author of record.
3. **One document, two rooms.** A single lesson renders as a teacher-paced
   projector deck and as a self-paced scored run.
4. **Games for free.** Any question set drops into the game shell, with no
   separate authoring step.

## Architecture

The whole product is one data structure:

```
Lesson = { meta: { board, class, subject, chapter, outcomes[] }, blocks: Block[] }
Block  = explainer | mcq | match | sequence | label   (discriminated union)
```

Everything else is a function of it. Four renderers consume the same document
and know about nothing else:

- **Review** — every block, editable
- **Present** — every block, projector-sized, teacher-paced
- **Play** — one block at a time, scored
- **Results** — the scores that came back out

That is why the demo is not throwaway: a real backend would only ever be asked
to produce this JSON. Adding a sixth block type is a change in two files — the
union in `src/types/lesson.ts` and the switch in
`src/components/blocks/BlockView.tsx`.

```
src/
  types/lesson.ts          the data model — read this first
  content/                 the hand-written NCERT lesson and fixtures
  lib/scoring.ts           grading, shuffling, coverage (unit tested)
  components/blocks/       one component per block type, plus the dispatcher
  components/Figures.tsx   hand-drawn optics diagrams on one shared viewBox
  routes/                  the seven screens
  store/useLessonStore.ts  the single working copy of the lesson
```

Vite · React 19 · TypeScript · Tailwind v4 · zustand · Motion.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # data-layer tests
npm run typecheck
npm run build      # → dist/
```

Node 22+.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` typechecks, tests, builds and publishes to Pages
on every push to `main`.

Two things to set up once:

1. **Repository → Settings → Pages → Build and deployment → Source: GitHub
   Actions.**
2. If the repo is **not** named `chalk`, change `REPO_NAME` at the top of
   `vite.config.ts` to match. Project sites are served from `/<repo-name>/`, and
   the router reads that path from `import.meta.env.BASE_URL`.

Deep links such as `/review` survive a refresh because the build copies
`index.html` to `404.html`, which GitHub Pages serves for any unrecognised path.

## Honest limitations

- Only **Class 10 · Science · Chapter 9** has content. Other chapters are listed
  to show the shape of the picker and are deliberately not buildable.
- State lives in memory. Reloading resets the lesson to its authored draft.
- Class results are fixtures, not your run — they show the shape of the report,
  not your answers.
- "Regenerate" cycles through hand-written alternates, not model output. Three
  of the quiz blocks have them.

## Content source

NCERT Science, Class 10, Chapter 9 — *Light: Reflection and Refraction*
(2023 rationalised edition). The physics, the worked numericals and the learning
outcomes are real; the teacher, the school and the class data are not.
