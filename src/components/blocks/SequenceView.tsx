import { useEffect, useState } from 'react'
import type { SequenceBlock } from '../../types/lesson'
import { gradeSequence, seededShuffle } from '../../lib/scoring'
import { Button, CrossIcon, TickIcon } from '../ui'
import { tones, type BlockViewProps } from './types'

/** Move steps with the arrow buttons until the order is right, then check. */
export function SequenceView({
  block,
  variant,
  onResult,
}: BlockViewProps<SequenceBlock>) {
  const t = tones(variant)
  const big = variant === 'present'
  const preview = variant === 'preview'

  const [order, setOrder] = useState<string[]>(block.steps)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setOrder(preview ? block.steps : seededShuffle(block.steps, 91))
    setChecked(false)
  }, [block.id, block.steps, preview])

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (checked || target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setOrder(next)
  }

  function check() {
    setChecked(true)
    onResult?.(gradeSequence(order, block.steps), block.steps.length)
  }

  return (
    <div className={big ? 'space-y-8' : 'space-y-5'}>
      <h3
        className={`${big ? 'text-4xl' : 'text-xl'} font-semibold ${t.heading}`}
      >
        {block.title}
      </h3>

      {!preview && !checked && (
        <p className={`text-sm ${t.muted}`}>
          Use the arrows to put the steps into the order you would actually do
          them.
        </p>
      )}

      <ol className="space-y-2.5">
        {order.map((step, index) => {
          const rightPlace = step === block.steps[index]
          let state = t.surface
          if (preview) state = t.surface
          else if (checked) state = rightPlace ? t.correct : t.wrong

          return (
            <li
              key={step}
              className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${state}`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  checked
                    ? rightPlace
                      ? 'bg-good text-white'
                      : 'bg-bad text-white'
                    : t.board
                      ? 'bg-board-line text-paper/70'
                      : 'bg-paper-2 text-ink-3'
                }`}
              >
                {checked ? (
                  rightPlace ? (
                    <TickIcon className="size-4" />
                  ) : (
                    <CrossIcon className="size-4" />
                  )
                ) : (
                  index + 1
                )}
              </span>

              <span
                className={`flex-1 leading-relaxed ${big ? 'text-lg' : 'text-sm'} ${t.heading}`}
              >
                {step}
              </span>

              {!preview && !checked && (
                <span className="flex shrink-0 flex-col gap-1">
                  <ArrowButton
                    dir="up"
                    board={t.board}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  />
                  <ArrowButton
                    dir="down"
                    board={t.board}
                    disabled={index === order.length - 1}
                    onClick={() => move(index, 1)}
                  />
                </span>
              )}
            </li>
          )
        })}
      </ol>

      {!preview && !checked && (
        <Button variant={t.board ? 'board' : 'primary'} onClick={check}>
          Check the order
        </Button>
      )}

      {checked && (
        <p className={`text-sm font-semibold ${t.heading}`}>
          {gradeSequence(order, block.steps)} of {block.steps.length} steps in
          the right place
        </p>
      )}
    </div>
  )
}

function ArrowButton({
  dir,
  board,
  disabled,
  onClick,
}: {
  dir: 'up' | 'down'
  board: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={dir === 'up' ? 'Move step earlier' : 'Move step later'}
      className={`flex size-7 items-center justify-center rounded-lg border transition-colors disabled:opacity-25 ${
        board
          ? 'border-board-line text-paper/70 hover:bg-board-line'
          : 'border-line text-ink-3 hover:bg-paper-2 hover:text-ink'
      }`}
    >
      <svg viewBox="0 0 20 20" className="size-3.5" fill="none" aria-hidden="true">
        <path
          d={dir === 'up' ? 'M5 12.5 10 7l5 5.5' : 'M5 7.5 10 13l5-5.5'}
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
