import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Shell } from '../components/Shell'
import { Button, Chip, DemoNote, SectionLabel, TickIcon } from '../components/ui'
import {
  DEMO_CHAPTER,
  boards,
  chapters,
  grades,
  subjects,
} from '../content/library'
import { generationSteps, lightLesson } from '../content/light-class10'
import { BLOCK_LABELS } from '../types/lesson'
import { useLessonStore } from '../store/useLessonStore'

const STEP_MS = 850

export function Generate() {
  const [phase, setPhase] = useState<'form' | 'building'>('form')

  return (
    <Shell wide>
      {phase === 'form' ? (
        <WizardForm onStart={() => setPhase('building')} />
      ) : (
        <BuildTheatre onBack={() => setPhase('form')} />
      )}
    </Shell>
  )
}

/* ---------------- Step 1: pick the chapter ---------------- */

function WizardForm({ onStart }: { onStart: () => void }) {
  const wizard = useLessonStore((s) => s.wizard)
  const setWizard = useLessonStore((s) => s.setWizard)
  const reset = useLessonStore((s) => s.reset)

  const chapterList = chapters[wizard.subject] ?? []
  const chapterIsWired = wizard.chapter === DEMO_CHAPTER

  return (
    <div className="mx-auto max-w-3xl">
      <SectionLabel>New lesson</SectionLabel>
      <h1 className="mt-1 text-3xl font-semibold">
        Which chapter are you teaching?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">
        Not a prompt box. Chalk works from the syllabus, so it already knows the
        chapter's learning outcomes and how it gets examined.
      </p>

      <div className="mt-8 space-y-7">
        <Field label="Board">
          <Pills
            options={boards}
            value={wizard.board}
            onChange={(board) => setWizard({ board })}
          />
        </Field>

        <Field label="Class">
          <Pills
            options={grades.map(String)}
            value={String(wizard.grade)}
            onChange={(grade) => setWizard({ grade: Number(grade) })}
          />
        </Field>

        <Field label="Subject">
          <Pills
            options={subjects}
            value={wizard.subject}
            onChange={(subject) =>
              setWizard({ subject, chapter: chapters[subject]?.[0] ?? '' })
            }
          />
        </Field>

        <Field label="Chapter">
          <select
            value={wizard.chapter}
            onChange={(e) => setWizard({ chapter: e.target.value })}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium"
          >
            {chapterList.map((chapter, i) => (
              <option key={chapter} value={chapter}>
                Chapter {i + 1} — {chapter}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-7 sm:grid-cols-2">
          <Field label="Lesson length">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={20}
                max={60}
                step={5}
                value={wizard.durationMinutes}
                onChange={(e) =>
                  setWizard({ durationMinutes: Number(e.target.value) })
                }
                className="flex-1 accent-[#d9541e]"
              />
              <span className="w-16 text-sm font-semibold">
                {wizard.durationMinutes} min
              </span>
            </div>
          </Field>

          <Field label="Difficulty">
            <Pills
              options={['Foundation', 'Standard', 'Advanced']}
              value={wizard.difficulty}
              onChange={(difficulty) =>
                setWizard({
                  difficulty: difficulty as typeof wizard.difficulty,
                })
              }
            />
          </Field>

          <Field label="Language">
            <Pills
              options={['English', 'Hindi', 'Bilingual']}
              value={wizard.language}
              onChange={(language) =>
                setWizard({ language: language as typeof wizard.language })
              }
            />
          </Field>

          <Field label="Interactive games">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={wizard.includeGames}
                onChange={(e) => setWizard({ includeGames: e.target.checked })}
                className="size-4 accent-[#d9541e]"
              />
              <span className="text-sm font-medium">
                Add matching, ordering and a Rapid Fire round
              </span>
            </label>
          </Field>
        </div>
      </div>

      {!chapterIsWired && (
        <div className="mt-7 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-deep">
          <p className="font-semibold">
            This demo only carries content for one chapter.
          </p>
          <p className="mt-1 leading-relaxed">
            The real product would generate any of these. Here, switch to
            Science · Class 10 · Chapter 9 to see a full lesson.
          </p>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() =>
              setWizard({
                subject: 'Science',
                grade: 10,
                chapter: DEMO_CHAPTER,
              })
            }
          >
            Switch to Light: Reflection and Refraction
          </Button>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button
          disabled={!chapterIsWired}
          className="px-5 py-3 text-base"
          onClick={() => {
            reset()
            onStart()
          }}
        >
          Build the lesson →
        </Button>
        <p className="text-xs text-ink-3">Roughly a minute, in the real thing.</p>
      </div>

      <div className="mt-8">
        <DemoNote>
          Nothing here calls a model. Pressing build plays a scripted sequence
          over a hand-written lesson, so the flow is honest even though the
          generation is not.
        </DemoNote>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      {children}
    </div>
  )
}

function Pills({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
              active
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-white text-ink-2 hover:border-ink-3 hover:text-ink'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------- Step 2: the scripted build ---------------- */

function BuildTheatre({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate()
  const wizard = useLessonStore((s) => s.wizard)
  const [stepIndex, setStepIndex] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    for (let i = 1; i <= generationSteps.length; i++) {
      timers.current.push(
        window.setTimeout(() => setStepIndex(i), i * STEP_MS),
      )
    }
    const captured = timers.current
    return () => captured.forEach(clearTimeout)
  }, [])

  const done = stepIndex >= generationSteps.length
  // Blocks surface as the "writing" and "building" steps land.
  const revealedBlocks = Math.min(
    lightLesson.blocks.length,
    Math.max(0, (stepIndex - 2) * 4),
  )

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div>
        <Chip tone="accent">
          {wizard.board} · Class {wizard.grade} · {wizard.subject}
        </Chip>
        <h1 className="mt-4 text-3xl font-semibold leading-snug">
          {done ? 'Your draft is ready.' : 'Building your lesson…'}
        </h1>
        <p className="mt-2 text-sm text-ink-2">{wizard.chapter}</p>

        <ol className="mt-8 space-y-4">
          {generationSteps.map((step, i) => {
            const state =
              i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'waiting'
            return (
              <li key={step.label} className="flex gap-3">
                <span
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    state === 'done'
                      ? 'border-good bg-good text-white'
                      : state === 'active'
                        ? 'border-accent text-accent'
                        : 'border-line text-ink-3'
                  }`}
                >
                  {state === 'done' ? (
                    <TickIcon className="size-3.5" />
                  ) : state === 'active' ? (
                    <span className="size-2 animate-pulse rounded-full bg-accent" />
                  ) : null}
                </span>
                <span>
                  <span
                    className={`block text-sm font-semibold ${
                      state === 'waiting' ? 'text-ink-3' : 'text-ink'
                    }`}
                  >
                    {step.label}
                  </span>
                  {state !== 'waiting' && (
                    <span className="mt-0.5 block text-xs text-ink-3">
                      {step.detail}
                    </span>
                  )}
                </span>
              </li>
            )
          })}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            disabled={!done}
            className="px-5 py-3 text-base"
            onClick={() => navigate('/review')}
          >
            Review the draft →
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Change the chapter
          </Button>
        </div>
      </div>

      {/* The outline filling in as the steps land. */}
      <div className="rounded-3xl border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <SectionLabel>Draft outline</SectionLabel>
          <span className="text-xs text-ink-3">
            {revealedBlocks} / {lightLesson.blocks.length} blocks
          </span>
        </div>

        <ul className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {lightLesson.blocks.slice(0, revealedBlocks).map((block) => (
              <motion.li
                key={block.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2.5"
              >
                <Chip tone="neutral">{BLOCK_LABELS[block.type]}</Chip>
                <span className="flex-1 truncate text-sm">
                  {'title' in block ? block.title : block.question}
                </span>
                <span className="font-mono text-[10px] text-ink-3">
                  {block.outcomes.join(' ')}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>

          {!done && (
            <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink-3">
              <span className="size-1.5 animate-bounce rounded-full bg-accent" />
              writing…
            </li>
          )}
        </ul>

        {done && (
          <p className="mt-4 rounded-xl bg-accent-soft px-3 py-2.5 text-xs leading-relaxed text-accent-deep">
            Outcome 9.6 (lens formula and power) was not covered by this draft.
            Chalk flags it for you in review rather than quietly leaving it out.
          </p>
        )}
      </div>
    </div>
  )
}
