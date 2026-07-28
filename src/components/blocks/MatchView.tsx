import { useEffect, useMemo, useState } from 'react'
import type { MatchBlock } from '../../types/lesson'
import { gradeMatch, seededShuffle } from '../../lib/scoring'
import { Button, CrossIcon, TickIcon } from '../ui'
import { tones, type BlockViewProps } from './types'

/**
 * Tap a term, then tap its meaning. Deliberately not drag-and-drop: this has to
 * work on a shared phone and on a projector clicked with a wireless mouse.
 */
export function MatchView({
  block,
  variant,
  onResult,
}: BlockViewProps<MatchBlock>) {
  const t = tones(variant)
  const big = variant === 'present'
  const preview = variant === 'preview'

  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [activeLeft, setActiveLeft] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setAssignments({})
    setActiveLeft(null)
    setChecked(false)
  }, [block.id, variant])

  const shuffledRight = useMemo(
    () => seededShuffle(block.pairs.map((p) => p.right), block.pairs.length * 17),
    [block.pairs],
  )

  const usedRight = new Set(Object.values(assignments))
  const allPaired = Object.keys(assignments).length === block.pairs.length

  function pickLeft(left: string) {
    if (preview || checked) return
    if (assignments[left]) {
      // Tapping a paired term releases it, so mistakes are cheap to undo.
      const next = { ...assignments }
      delete next[left]
      setAssignments(next)
      setActiveLeft(left)
      return
    }
    setActiveLeft((current) => (current === left ? null : left))
  }

  function pickRight(right: string) {
    if (preview || checked || !activeLeft || usedRight.has(right)) return
    setAssignments((current) => ({ ...current, [activeLeft]: right }))
    setActiveLeft(null)
  }

  function check() {
    setChecked(true)
    onResult?.(gradeMatch(assignments, block.pairs), block.pairs.length)
  }

  function stateFor(left: string) {
    if (preview) return t.correct
    if (!checked) return assignments[left] ? t.correct : t.surface
    const pair = block.pairs.find((p) => p.left === left)
    return assignments[left] === pair?.right ? t.correct : t.wrong
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
          {activeLeft
            ? `Now tap the meaning of “${activeLeft}”.`
            : 'Tap a term, then tap the meaning that belongs to it.'}
        </p>
      )}

      <div className={`grid gap-3 ${big ? 'md:grid-cols-2' : 'sm:grid-cols-2'}`}>
        {/* Terms */}
        <ul className="space-y-2.5">
          {block.pairs.map((pair) => {
            const chosen = preview ? pair.right : assignments[pair.left]
            const isActive = activeLeft === pair.left
            return (
              <li key={pair.left}>
                <button
                  type="button"
                  disabled={preview || checked}
                  onClick={() => pickLeft(pair.left)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${stateFor(pair.left)} ${
                    isActive ? 'ring-2 ring-accent ring-offset-2' : ''
                  } ${!preview && !checked ? `cursor-pointer ${t.surfaceHover}` : 'cursor-default'}`}
                >
                  <span
                    className={`flex items-center gap-2 font-semibold ${big ? 'text-xl' : 'text-sm'} ${t.heading}`}
                  >
                    {checked &&
                      (chosen === pair.right ? (
                        <TickIcon className="size-4 shrink-0 text-good" />
                      ) : (
                        <CrossIcon className="size-4 shrink-0 text-bad" />
                      ))}
                    {pair.left}
                  </span>
                  {chosen && (
                    <span
                      className={`mt-1 block ${big ? 'text-base' : 'text-xs'} ${t.body}`}
                    >
                      {chosen}
                    </span>
                  )}
                  {checked && chosen !== pair.right && (
                    <span
                      className={`mt-1 block ${big ? 'text-base' : 'text-xs'} italic ${t.muted}`}
                    >
                      Correct: {pair.right}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Meanings still on the table */}
        {!preview && (
          <ul className="space-y-2.5">
            {shuffledRight.map((right) => {
              const taken = usedRight.has(right)
              return (
                <li key={right}>
                  <button
                    type="button"
                    disabled={taken || checked || !activeLeft}
                    onClick={() => pickRight(right)}
                    className={`w-full rounded-xl border border-dashed p-3 text-left transition-colors ${big ? 'text-lg' : 'text-sm'} ${
                      taken
                        ? `opacity-30 ${t.surface}`
                        : `${t.surface} ${activeLeft && !checked ? `cursor-pointer ${t.surfaceHover}` : ''}`
                    } ${t.body}`}
                  >
                    {right}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {!preview && !checked && (
        <Button
          variant={t.board ? 'board' : 'primary'}
          disabled={!allPaired}
          onClick={check}
        >
          {allPaired
            ? 'Check my answers'
            : `${Object.keys(assignments).length} of ${block.pairs.length} paired`}
        </Button>
      )}

      {checked && (
        <p className={`text-sm font-semibold ${t.heading}`}>
          {gradeMatch(assignments, block.pairs)} of {block.pairs.length} correct
        </p>
      )}
    </div>
  )
}
