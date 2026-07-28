# Handover — Chalk

State as of 28 Jul 2026. Read `README.md` first for what the product *is* and
the click-through journey; this file is what a developer picking it up needs.

## Where things stand

Complete and working. Typecheck clean, 20 tests passing, production build green.
Driven end-to-end in a real browser: the generation sequence, the review editor,
projector mode with the poll reveal, the labelled-diagram interaction with its
grading, and the Rapid Fire timeout path were all verified by hand.

Repo: `git@github.com:goldenryu2000/Chalk.git`, branch `main`, two commits plus
whatever this handover lands as.

**Not yet done by us:** the push, and switching **Settings → Pages → Build and
deployment → Source** to **GitHub Actions**. The workflow cannot publish until
that setting is changed. Nothing else is outstanding.

## The one thing to understand before changing anything

Everything is `src/types/lesson.ts`. A `Lesson` is metadata plus an ordered array
of blocks, where `Block` is a discriminated union of five types. Four renderers
consume that document and know about nothing else:

| Renderer | File | Variant passed to blocks |
|---|---|---|
| Review editor | `routes/Review.tsx` | `preview` |
| Projector | `routes/Present.tsx` | `present` |
| Student | `routes/Play.tsx` | `play` |
| Class report | `routes/Results.tsx` | — reads ids only |

Each block component (`components/blocks/*View.tsx`) switches its own appearance
on that variant. `components/blocks/BlockView.tsx` is the only place that maps a
block type to a component.

**Adding a sixth block type touches exactly two files:** the union in
`types/lesson.ts` (plus `BLOCK_LABELS` and `INTERACTIVE_TYPES` there), and the
switch in `BlockView.tsx`. If a change needs more than that, the abstraction is
being worked against.

## Conventions worth keeping

- **Figures share one 400×260 viewBox.** That is why `LabelBlock.targets` can
  position hotspots as plain percentages and have them scale from a phone to a
  projector with no recalculation. Do not change the viewBox without redoing
  every `targets` coordinate.
- **Hotspot coordinates were tuned against collisions,** not just against the
  physics. The two angle hotspots on the plane-mirror figure are staggered
  vertically because the placed labels are wide enough to overlap if they share
  a line. Moving them back onto the same `y` will look broken once labelled.
- **Interactions are tap-then-tap, never drag.** Matching, labelling and
  ordering all work by selecting a thing and then selecting its destination.
  This is deliberate: it has to work on a shared phone and on a projector driven
  by a wireless mouse. Do not "upgrade" these to HTML5 drag-and-drop.
- **Shuffling is seeded** (`seededShuffle` in `lib/scoring.ts`) so a student who
  reloads sees the same arrangement and the tests can assert on it.
- **Fake class data is derived from block ids by hash** (`lib/fakeClass.ts`), so
  the same question always shows the same poll split. A demo whose numbers
  reshuffle on every render looks like what it is.

## Where the logic actually lives

`src/lib/scoring.ts` holds everything with a right answer: grading for each
block type, the Rapid Fire points formula, the seeded shuffle, and
`computeCoverage`. It is React-free and is the only unit-tested part
(`scoring.test.ts`, 20 tests). Put new rules there, not in components.

## Known rough edges

None of these break the demo. Listed so nobody rediscovers them.

- **Deleting a block jumps the selection to the top of the list.**
  `Review.tsx` picks the replacement selection with
  `lesson.blocks.find(b => b.id !== block.id)`, which is the first surviving
  block rather than the neighbour. Fix by selecting by index instead.
- **Approval is one-way.** Once `approved` is true, `/review` always shows the
  published confirmation. There is no un-approve; a reload resets it. Fine for a
  demo, wrong for a product.
- **State is in memory only.** Reloading resets the lesson to its authored
  draft. Deliberate — persistence would imply a backend that does not exist.
- **Only Chapter 9 is wired.** Other chapters populate the picker to show its
  shape and are deliberately not buildable; the wizard says so and offers a
  one-click switch.
- **`npm audit` flags react-router 7.18.1** for an RSC-mode CSRF issue. It does
  not apply to a static SPA with no server actions, and the only available "fix"
  is a downgrade to 7.11.0. Left alone on purpose.

## Deployment gotchas

- **`REPO_NAME` in `vite.config.ts` must match the repository name exactly,
  including case.** It is currently `Chalk`. GitHub Pages project sites serve
  from `/<repo-name>/`; a mismatch produces a blank white page with 404s on
  every asset and no obvious cause.
- **Deep links work because the build copies `index.html` to `404.html`.** Pages
  serves `404.html` for unrecognised paths, so `/review` and `/present` survive
  a refresh or a shared link. If you switch to a hash router or a different
  host, that copy step in `package.json`'s `build` script becomes dead weight.
- **The router reads its base from `import.meta.env.BASE_URL`**, so `basename`
  follows `REPO_NAME` automatically. Do not hardcode it.

## If this becomes a real product

The demo answers "what is it". These are the questions it does not answer, in
the order they would need answering:

1. **Generation.** Nothing here calls a model. The contract is already defined —
   a generator's only job is to emit a valid `Lesson`. Constrain it with the
   chapter's declared outcomes and validate the output against a schema before
   a teacher ever sees it. `zod` is a natural fit and matches the shapes in
   `types/lesson.ts`.
2. **Figures are the hard part.** Assessment blocks are pure JSON and a model
   handles them well. Diagrams are not. The realistic path is a hand-built
   template library the generator only fills parameters into — never free-form
   SVG generation.
3. **Persistence, accounts, classes.** Everything a school needs and none of
   which is modelled here.
4. **Whether teacher-led or self-paced wins.** Both are built precisely so the
   answer can be observed rather than guessed.
