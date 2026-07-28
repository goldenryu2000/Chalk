import { useEffect, useState } from 'react'
import type { McqBlock } from '../../types/lesson'
import { classInfo } from '../../content/library'
import { pollPercentages, respondedCount } from '../../lib/fakeClass'
import { Button, CrossIcon, TickIcon } from '../ui'
import { OPTION_LETTERS, tones, type BlockViewProps } from './types'

export function McqView({ block, variant, onResult }: BlockViewProps<McqBlock>) {
  const t = tones(variant)
  const big = variant === 'present'
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(variant === 'preview')

  // A new question means a clean slate, even though the component is reused.
  useEffect(() => {
    setPicked(null)
    setRevealed(variant === 'preview')
  }, [block.id, block.question, variant])

  const poll = pollPercentages(block.id, block.options.length, block.answerIndex)

  function choose(index: number) {
    if (variant === 'preview' || picked !== null) return
    setPicked(index)
    if (variant === 'play') {
      setRevealed(true)
      onResult?.(index === block.answerIndex ? 1 : 0, 1)
    }
  }

  return (
    <div className={big ? 'space-y-8' : 'space-y-5'}>
      <h3
        className={`${big ? 'text-4xl leading-snug' : 'text-xl leading-snug'} font-semibold ${t.heading}`}
      >
        {block.question}
      </h3>

      <ul className={`grid gap-3 ${big ? 'sm:grid-cols-2' : ''}`}>
        {block.options.map((option, index) => {
          const isAnswer = index === block.answerIndex
          const isPicked = index === picked
          const showCorrect = revealed && isAnswer
          const showWrong = revealed && isPicked && !isAnswer

          let state = t.surface
          if (showCorrect) state = t.correct
          else if (showWrong) state = t.wrong

          const interactive = variant !== 'preview' && picked === null

          return (
            <li key={option}>
              <button
                type="button"
                disabled={!interactive}
                onClick={() => choose(index)}
                aria-pressed={isPicked}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${state} ${
                  interactive ? `cursor-pointer ${t.surfaceHover}` : 'cursor-default'
                } ${big ? 'text-xl' : 'text-sm'}`}
              >
                <span
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                    showCorrect
                      ? 'bg-good text-white'
                      : showWrong
                        ? 'bg-bad text-white'
                        : t.board
                          ? 'bg-board-line text-paper/70'
                          : 'bg-paper-2 text-ink-3'
                  }`}
                >
                  {showCorrect ? (
                    <TickIcon className="size-4" />
                  ) : showWrong ? (
                    <CrossIcon className="size-4" />
                  ) : (
                    OPTION_LETTERS[index]
                  )}
                </span>
                <span className={`flex-1 ${t.heading}`}>{option}</span>

                {big && revealed && (
                  <span className={`ml-2 text-base font-semibold ${t.muted}`}>
                    {poll[index]}%
                  </span>
                )}
              </button>

              {big && revealed && (
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-board-line">
                  <div
                    className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                      isAnswer ? 'bg-emerald-300' : 'bg-paper/30'
                    }`}
                    style={{ width: `${poll[index]}%` }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {big && !revealed && (
        <div className="flex items-center gap-4">
          <Button variant="board" onClick={() => setRevealed(true)}>
            Reveal answer
          </Button>
          <p className="text-sm text-paper/50">
            {respondedCount(block.id, classInfo.present)} of {classInfo.present}{' '}
            have answered
          </p>
        </div>
      )}

      {revealed && (
        <div
          className={`rounded-xl border-l-2 border-accent px-4 py-3 ${
            t.board ? 'bg-board-2/80' : 'bg-accent-soft/50'
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-[0.12em] ${t.muted}`}
          >
            Why
          </p>
          <p
            className={`mt-1 leading-relaxed ${big ? 'text-lg' : 'text-sm'} ${t.body}`}
          >
            {block.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
