import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { Chip, DemoNote, LinkButton, SectionLabel } from '../components/ui'
import { classInfo, previousLessons, teacher } from '../content/library'
import { lightLesson } from '../content/light-class10'
import { useLessonStore } from '../store/useLessonStore'

export function Dashboard() {
  const approved = useLessonStore((s) => s.approved)
  const lesson = useLessonStore((s) => s.lesson)

  return (
    <Shell wide>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Good morning</SectionLabel>
          <h1 className="mt-1 text-3xl font-semibold">
            {teacher.name.split(' ')[0]}, you teach {classInfo.name} at 11:15.
          </h1>
          <p className="mt-1 text-sm text-ink-3">{teacher.subjects}</p>
        </div>
        <LinkButton to="/generate" className="px-5 py-3 text-base">
          + New lesson
        </LinkButton>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat value="4" label="Classes this week" />
        <Stat value="12" label="Lessons published" />
        <Stat value="78%" label="Average class score" />
      </div>

      {/* The lesson the demo is actually wired for. */}
      <section className="mt-10">
        <SectionLabel>Next up</SectionLabel>
        <Link
          to={approved ? '/present' : '/generate'}
          className="mt-3 block rounded-3xl border border-line bg-white p-6 transition-colors hover:border-accent"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="accent">
                  {lightLesson.meta.board} · Class {lightLesson.meta.grade} ·
                  Chapter {lightLesson.meta.chapterNumber}
                </Chip>
                <Chip tone={approved ? 'good' : 'neutral'}>
                  {approved ? 'Approved' : 'Not created yet'}
                </Chip>
              </div>
              <h2 className="mt-3 text-2xl font-semibold">
                {lightLesson.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {lightLesson.summary}
              </p>
            </div>

            <div className="text-right">
              <p className="font-display text-4xl font-semibold">
                {approved ? lesson.blocks.length : '—'}
              </p>
              <p className="text-xs text-ink-3">blocks</p>
            </div>
          </div>

          <p className="mt-5 text-sm font-semibold text-accent">
            {approved
              ? 'Open classroom mode →'
              : 'Create this lesson with Chalk →'}
          </p>
        </Link>
      </section>

      <section className="mt-10">
        <SectionLabel>Earlier lessons</SectionLabel>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {previousLessons.map((card) => (
            <article
              key={card.id}
              className="card flex h-full flex-col p-5 opacity-70"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-ink-3">
                  Ch {card.chapterNumber}
                </span>
                <Chip
                  tone={
                    card.status === 'Published'
                      ? 'good'
                      : card.status === 'Needs review'
                        ? 'accent'
                        : 'neutral'
                  }
                >
                  {card.status}
                </Chip>
              </div>
              <h3 className="mt-2 flex-1 text-base font-semibold leading-snug">
                {card.title}
              </h3>
              <p className="mt-3 text-xs text-ink-3">
                Class {card.grade} · {card.blocks} blocks
                {card.avgScore ? ` · ${card.avgScore}% avg` : ''}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-3">
          These four are set dressing. Only the Light chapter opens.
        </p>
      </section>

      <div className="mt-10">
        <DemoNote>
          This is a concept demo. No AI model is called and nothing is saved —
          the lesson is hand-written NCERT content and resets when you reload.
        </DemoNote>
      </div>
    </Shell>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card px-5 py-4">
      <p className="font-display text-3xl font-semibold">{value}</p>
      <p className="mt-0.5 text-xs text-ink-3">{label}</p>
    </div>
  )
}
