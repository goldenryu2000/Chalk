import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import type { McqBlock } from '../../types/lesson'
import { RAPID_FIRE_SECONDS, rapidFirePoints } from '../../lib/scoring'
import { OPTION_LETTERS } from '../../components/blocks/types'
import { Button } from '../../components/ui'

/**
 * The game shell: the lesson's own quiz blocks, on a clock, with a streak.
 * No new content is authored for it — that is the whole idea. Any question set
 * in any lesson can be played this way.
 */
export function RapidFire({
  blocks,
  onFinish,
}: {
  blocks: McqBlock[]
  onFinish: (points: number, correct: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(RAPID_FIRE_SECONDS)
  const [picked, setPicked] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [lastGain, setLastGain] = useState(0)

  const block = blocks[index]

  // One ticking clock per question; answering stops it by clearing `picked`'s gate.
  useEffect(() => {
    if (picked !== null) return
    if (secondsLeft <= 0) {
      settle(null)
      return
    }
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, picked])

  function settle(choice: number | null) {
    const isRight = choice === block.answerIndex
    const nextStreak = isRight ? streak + 1 : 0
    const gain = rapidFirePoints(isRight, secondsLeft, nextStreak)

    setPicked(choice ?? -1)
    setStreak(nextStreak)
    setPoints((p) => p + gain)
    setLastGain(gain)
    if (isRight) setCorrect((c) => c + 1)
  }

  function next() {
    if (index === blocks.length - 1) {
      onFinish(points, correct)
      return
    }
    setIndex((i) => i + 1)
    setSecondsLeft(RAPID_FIRE_SECONDS)
    setPicked(null)
    setLastGain(0)
  }

  const answered = picked !== null
  const timeFraction = (secondsLeft / RAPID_FIRE_SECONDS) * 100

  return (
    <div className="board-surface min-h-dvh px-5 py-6 text-paper">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-paper/60">
            Rapid Fire · {index + 1} / {blocks.length}
          </span>
          <span className="flex items-center gap-3">
            {streak > 1 && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold">
                {streak}× streak
              </span>
            )}
            <span className="font-display text-2xl font-semibold">
              {points}
            </span>
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-board-line">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              secondsLeft <= 5 ? 'bg-rose-400' : 'bg-paper'
            }`}
            // The clock stops on answer, so the bar simply freezes where it was.
            style={{ width: `${timeFraction}%` }}
          />
        </div>
        {!answered && (
          <p className="mt-1.5 text-right text-xs text-paper/50">
            {secondsLeft}s
          </p>
        )}

        <h2 className="mt-8 text-2xl font-semibold leading-snug sm:text-3xl">
          {block.question}
        </h2>

        <ul className="mt-6 grid gap-3">
          {block.options.map((option, i) => {
            const isAnswer = i === block.answerIndex
            const isPicked = i === picked
            let state = 'border-board-line bg-board-2'
            if (answered && isAnswer)
              state = 'border-emerald-300/70 bg-emerald-300/15'
            else if (answered && isPicked)
              state = 'border-rose-300/70 bg-rose-300/15'
            else if (answered) state = 'border-board-line bg-board-2 opacity-40'

            return (
              <li key={option}>
                <button
                  type="button"
                  disabled={answered}
                  onClick={() => settle(i)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${state} ${
                    answered ? 'cursor-default' : 'hover:border-paper/40'
                  }`}
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-board-line text-xs font-bold">
                    {OPTION_LETTERS[i]}
                  </span>
                  <span>{option}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <p className="font-display text-2xl font-semibold">
              {lastGain > 0 ? `+${lastGain}` : picked === -1 ? 'Time!' : '+0'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-paper/70">
              {block.explanation}
            </p>
            <Button variant="board" className="mt-5" onClick={next}>
              {index === blocks.length - 1 ? 'Finish' : 'Next question →'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
