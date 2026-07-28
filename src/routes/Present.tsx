import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { BlockView } from '../components/blocks/BlockView'
import { Chip, CurriculumTag, Logo, ProgressBar } from '../components/ui'
import { classInfo } from '../content/library'
import { BLOCK_LABELS } from '../types/lesson'
import { useLessonStore } from '../store/useLessonStore'

/**
 * The projector renderer. Same lesson document as everywhere else, but paced by
 * the teacher's arrow keys and sized to be read from the back of a classroom.
 */
export function Present() {
  const navigate = useNavigate()
  const lesson = useLessonStore((s) => s.lesson)
  const [index, setIndex] = useState(0)

  const last = lesson.blocks.length - 1
  const block = lesson.blocks[index]

  const go = useCallback(
    (delta: number) =>
      setIndex((i) => Math.max(0, Math.min(last, i + delta))),
    [last],
  )

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') go(1)
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') go(-1)
      if (event.key === 'Escape') navigate('/review')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, navigate])

  if (!block) return null

  return (
    <div className="board-surface flex min-h-dvh flex-col text-paper">
      <header className="flex flex-wrap items-center gap-4 border-b border-board-line px-6 py-3">
        <Logo tone="chalk" />
        <CurriculumTag
          board={lesson.meta.board}
          grade={lesson.meta.grade}
          subject={lesson.meta.subject}
          chapterNumber={lesson.meta.chapterNumber}
          tone="board"
        />
        <span className="ml-auto flex items-center gap-3 text-sm text-paper/60">
          <span className="hidden sm:inline">
            {classInfo.name} · {classInfo.present} present
          </span>
          <Chip tone="chalk">{BLOCK_LABELS[block.type]}</Chip>
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10">
        <motion.div
          key={block.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <BlockView block={block} variant="present" />
        </motion.div>
      </main>

      <footer className="border-t border-board-line px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="rounded-lg border border-board-line px-3 py-2 text-sm transition-colors hover:bg-board-line disabled:opacity-25"
          >
            ← Back
          </button>

          <div className="flex-1">
            <ProgressBar
              value={((index + 1) / lesson.blocks.length) * 100}
              tone="chalk"
            />
            <p className="mt-1.5 text-xs text-paper/50">
              Block {index + 1} of {lesson.blocks.length} · use ← → to move,
              Esc to exit
            </p>
          </div>

          {index === last ? (
            <Link
              to="/results"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              End &amp; see results →
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => go(1)}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              Next →
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
