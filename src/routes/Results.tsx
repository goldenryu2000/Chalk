import { Shell } from '../components/Shell'
import {
  Chip,
  CurriculumTag,
  DemoNote,
  LinkButton,
  ProgressBar,
  SectionLabel,
} from '../components/ui'
import {
  blockAccuracy,
  classInfo,
  misconceptions,
  needsHelp,
  scoreDistribution,
  topStudents,
} from '../content/library'
import { useLessonStore } from '../store/useLessonStore'
import { BLOCK_LABELS } from '../types/lesson'

/**
 * The loop closing: because every block carries its outcome ids, a wrong answer
 * points at a specific thing the class did not learn, not just a low score.
 */
export function Results() {
  const lesson = useLessonStore((s) => s.lesson)

  const scored = lesson.blocks
    .filter((block) => block.id in blockAccuracy)
    .map((block) => ({ block, accuracy: blockAccuracy[block.id] }))
    .sort((a, b) => a.accuracy - b.accuracy)

  const average = scored.length
    ? Math.round(
        scored.reduce((sum, item) => sum + item.accuracy, 0) / scored.length,
      )
    : 0

  const peak = Math.max(...scoreDistribution.map((b) => b.students))

  return (
    <Shell wide>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel>After the lesson · {classInfo.name}</SectionLabel>
          <h1 className="mt-1 text-3xl font-semibold">{lesson.title}</h1>
          <div className="mt-2">
            <CurriculumTag
              board={lesson.meta.board}
              grade={lesson.meta.grade}
              subject={lesson.meta.subject}
              chapterNumber={lesson.meta.chapterNumber}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="card px-5 py-3 text-center">
            <p className="font-display text-3xl font-semibold">{average}%</p>
            <p className="text-xs text-ink-3">class average</p>
          </div>
          <div className="card px-5 py-3 text-center">
            <p className="font-display text-3xl font-semibold">
              {classInfo.present}
            </p>
            <p className="text-xs text-ink-3">of {classInfo.strength} attended</p>
          </div>
        </div>
      </header>

      {/* The thing a teacher actually acts on. */}
      <section className="mt-8">
        <SectionLabel>What to reteach on Monday</SectionLabel>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {misconceptions.map((item) => (
            <article
              key={item.outcome}
              className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-5"
            >
              <div className="flex items-center gap-2">
                <Chip tone="accent">Outcome {item.outcome}</Chip>
                <span className="text-xs font-semibold text-accent-deep">
                  {item.students} students
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{item.headline}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="card p-5">
          <SectionLabel>Accuracy per block</SectionLabel>
          <ul className="mt-4 space-y-3.5">
            {scored.map(({ block, accuracy }) => (
              <li key={block.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 text-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                      {BLOCK_LABELS[block.type]}
                    </span>
                    <span className="mt-0.5 line-clamp-1">
                      {'title' in block ? block.title : block.question}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-sm font-semibold ${
                      accuracy < 60 ? 'text-bad' : 'text-ink'
                    }`}
                  >
                    {accuracy}%
                  </span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar
                    value={accuracy}
                    tone={accuracy < 60 ? 'accent' : 'good'}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-3">
            Sorted worst first, because that is the order a teacher reads it in.
          </p>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <SectionLabel>Score distribution</SectionLabel>
            <ul className="mt-4 space-y-2.5">
              {scoreDistribution.map((band) => (
                <li key={band.band} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs text-ink-3">
                    {band.band}
                  </span>
                  <span className="flex-1">
                    <span
                      className="block h-6 rounded-md bg-accent/80"
                      style={{ width: `${(band.students / peak) * 100}%` }}
                    />
                  </span>
                  <span className="w-6 shrink-0 text-right text-xs font-semibold">
                    {band.students}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-5">
            <SectionLabel>Students</SectionLabel>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <StudentList title="Top of the class" people={topStudents} good />
              <StudentList title="Needs a hand" people={needsHelp} />
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <LinkButton to="/generate">Build a reteach lesson for 9.3 →</LinkButton>
        <LinkButton to="/dashboard" variant="secondary">
          Back to the dashboard
        </LinkButton>
      </div>

      <div className="mt-8">
        <DemoNote>
          These numbers are fixtures, not your run. They show the shape of the
          report a teacher would get back, with scores tied to the same outcome ids
          the lesson was built from.
        </DemoNote>
      </div>
    </Shell>
  )
}

function StudentList({
  title,
  people,
  good,
}: {
  title: string
  people: { name: string; score: number }[]
  good?: boolean
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink-3">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {people.map((person) => (
          <li
            key={person.name}
            className="flex items-center justify-between text-sm"
          >
            <span>{person.name}</span>
            <span
              className={`font-semibold ${good ? 'text-good' : 'text-bad'}`}
            >
              {person.score}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
