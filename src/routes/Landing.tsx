import { Figure } from '../components/Figures'
import { Chip, LinkButton, Logo, SectionLabel } from '../components/ui'

export function Landing() {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <a
            href="#how"
            className="hidden text-sm font-medium text-ink-2 hover:text-ink sm:block"
          >
            How it works
          </a>
          <LinkButton to="/dashboard">Open the demo</LinkButton>
        </div>
      </header>

      <Hero />
      <Problem />
      <HowItWorks />
      <TwoModes />
      <CurriculumLock />
      <ClosingCta />

      <footer className="border-t border-line px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-ink-3">
          <p className="font-semibold text-ink-2">
            Chalk: concept demo, not a product.
          </p>
          <p className="max-w-2xl leading-relaxed">
            Everything here runs in your browser with hand-written content. No AI
            model is called, no account exists and nothing is stored. The lesson
            is real NCERT Class 10 Science material; the generation is theatre,
            shown to make the idea concrete.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Chip tone="accent">Built for CBSE, ICSE and state boards</Chip>

          <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.05] sm:text-6xl">
            A chapter goes in.
            <br />
            <span className="text-accent">A lesson comes out.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            Chalk turns an NCERT chapter into a ready-to-teach interactive
            lesson: explainers, labelled diagrams, matching, and quiz games.
            The teacher edits and approves every block before a single student
            sees it.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <LinkButton to="/generate" className="px-5 py-3 text-base">
              Make a lesson →
            </LinkButton>
            <LinkButton to="/present" variant="secondary" className="px-5 py-3 text-base">
              See classroom mode
            </LinkButton>
          </div>

          <p className="mt-4 text-xs text-ink-3">
            Takes about two minutes. Nothing to install, nothing to sign up for.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_24px_60px_-32px_rgba(26,22,20,0.35)]">
            <div className="flex items-center justify-between">
              <SectionLabel>Class 10 · Science · Chapter 9</SectionLabel>
              <Chip tone="good">5 of 6 outcomes</Chip>
            </div>
            <h3 className="mt-3 text-2xl font-semibold">
              Light: Reflection and Refraction
            </h3>
            <div className="mt-4 rounded-2xl border border-line bg-paper p-3">
              <Figure id="plane-mirror" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['3 explainers', '5 quiz questions', '1 labelled diagram', '1 matching set'].map(
                (item) => (
                  <Chip key={item}>{item}</Chip>
                ),
              )}
            </div>
          </div>

          <div className="absolute -bottom-5 -left-4 hidden rotate-[-3deg] rounded-xl border border-line bg-board px-4 py-2.5 text-sm font-medium text-paper shadow-lg sm:block">
            Approved by Meera Iyer · 2 edits
          </div>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  const points = [
    {
      stat: '2–3 hrs',
      label: 'to build one genuinely interactive lesson by hand',
      note: 'So most teachers do not. They teach from the textbook and hope.',
    },
    {
      stat: 'Generic',
      label: 'is what a general AI tool gives you',
      note: 'It does not know your board, your chapter, or the marking pattern.',
    },
    {
      stat: 'Unchecked',
      label: 'AI content is what schools are actually afraid of',
      note: 'One hallucinated definition in front of 34 students is a real problem.',
    },
  ]

  return (
    <section className="border-y border-line bg-paper-2/50 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>The gap</SectionLabel>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
          Teachers do not need more content. They need content they can trust,
          fast.
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {points.map((p) => (
            <div key={p.stat} className="border-t-2 border-accent pt-4">
              <p className="font-display text-3xl font-semibold">{p.stat}</p>
              <p className="mt-1 font-medium">{p.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">{p.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Pick the chapter, not a prompt',
      body: 'Board, class, subject, chapter. Chalk already knows the declared learning outcomes, the difficulty bands and the question patterns that chapter is examined on.',
    },
    {
      n: '02',
      title: 'Review every block',
      body: 'The draft arrives tagged outcome by outcome. Edit the wording, regenerate a weak question, delete what you do not want, and see plainly which outcomes the draft missed.',
    },
    {
      n: '03',
      title: 'Approve, then teach',
      body: 'Nothing reaches a student until you press approve. Then the same lesson runs on the projector for the whole class, or on a student’s phone as homework.',
    },
  ]

  return (
    <section id="how" className="px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          The teacher stays the author.
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="card p-6">
              <p className="font-display text-4xl font-semibold text-accent/25">
                {step.n}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TwoModes() {
  return (
    <section className="px-5 pb-16">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <ModeCard
          tone="board"
          label="Classroom mode"
          title="One screen, thirty students"
          body="Full-bleed on the projector, driven with the arrow keys. Questions open to the whole class, answers stay hidden until you reveal them, and the response split appears as bars on the board."
          bullets={['Arrow-key paced', 'Reveal on your cue', 'Live response split']}
        />
        <ModeCard
          tone="paper"
          label="Solo mode"
          title="The same lesson, on their phone"
          body="Set it as homework and the identical blocks become a self-paced, scored run: one block at a time, instant feedback, and a Rapid Fire round at the end for the quiz questions."
          bullets={['Mobile first', 'Instant feedback', 'Rapid Fire scoring']}
        />
      </div>
    </section>
  )
}

function ModeCard({
  tone,
  label,
  title,
  body,
  bullets,
}: {
  tone: 'board' | 'paper'
  label: string
  title: string
  body: string
  bullets: string[]
}) {
  const isBoard = tone === 'board'
  return (
    <div
      className={`rounded-3xl border p-7 ${
        isBoard ? 'board-surface border-board-line' : 'border-line bg-white'
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.14em] ${
          isBoard ? 'text-paper/50' : 'text-ink-3'
        }`}
      >
        {label}
      </p>
      <h3
        className={`mt-2 text-2xl font-semibold ${isBoard ? 'text-paper' : 'text-ink'}`}
      >
        {title}
      </h3>
      <p
        className={`mt-3 text-sm leading-relaxed ${isBoard ? 'text-paper/70' : 'text-ink-2'}`}
      >
        {body}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {bullets.map((b) => (
          <li key={b}>
            <Chip tone={isBoard ? 'chalk' : 'neutral'}>{b}</Chip>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <LinkButton
          to={isBoard ? '/present' : '/play'}
          variant={isBoard ? 'board' : 'secondary'}
        >
          Try {isBoard ? 'classroom' : 'solo'} mode
        </LinkButton>
      </div>
    </div>
  )
}

function CurriculumLock() {
  return (
    <section className="border-y border-line bg-paper-2/50 px-5 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionLabel>Why this is not a prompt box</SectionLabel>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Every block is tied to a learning outcome.
          </h2>
          <p className="mt-4 leading-relaxed text-ink-2">
            Because the chapter's outcomes are known up front, coverage is
            checkable. Chalk shows the teacher exactly which outcomes the draft
            addressed and which it skipped, and after the class, which outcome
            the marks actually fell down on.
          </p>
          <p className="mt-3 leading-relaxed text-ink-2">
            That is the difference between a content generator and something a
            head of department will sign off on.
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <SectionLabel>Chapter 9 coverage</SectionLabel>
            <Chip tone="good">5 of 6</Chip>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ['9.1', 'Laws of reflection', true],
              ['9.2', 'Spherical mirrors and their uses', true],
              ['9.3', 'Mirror formula and magnification', true],
              ['9.4', 'Refraction of light', true],
              ['9.5', 'Refractive index', true],
              ['9.6', 'Lens formula and power of a lens', false],
            ].map(([id, text, covered]) => (
              <li key={id as string} className="flex items-center gap-3">
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    covered ? 'bg-good text-white' : 'bg-accent-soft text-accent-deep'
                  }`}
                >
                  {covered ? '✓' : '!'}
                </span>
                <span className="font-mono text-xs text-ink-3">{id}</span>
                <span className={covered ? 'text-ink-2' : 'font-semibold text-ink'}>
                  {text}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent-deep">
            The draft skipped lenses. Chalk says so instead of hoping nobody
            notices.
          </p>
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-4xl font-semibold sm:text-5xl">
          Walk the whole thing in two minutes.
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-2">
          Generate a Class 10 Science lesson, edit it, approve it, teach it on
          the board, then play it as a student and read the class results.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <LinkButton to="/generate" className="px-5 py-3 text-base">
            Start the demo →
          </LinkButton>
          <LinkButton to="/dashboard" variant="secondary" className="px-5 py-3 text-base">
            Go to the dashboard
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
