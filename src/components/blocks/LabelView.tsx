import { useEffect, useMemo, useState } from 'react'
import type { LabelBlock } from '../../types/lesson'
import { gradeLabel, seededShuffle } from '../../lib/scoring'
import { Figure } from '../Figures'
import { Button, CrossIcon, TickIcon } from '../ui'
import { tones, type BlockViewProps } from './types'

/**
 * Tap a label, then tap the spot on the diagram it belongs to. Hotspots are
 * positioned as percentages of the shared 400×260 figure viewBox, so the whole
 * thing scales from a phone to a projector without recalculating anything.
 */
export function LabelView({
  block,
  variant,
  onResult,
}: BlockViewProps<LabelBlock>) {
  const t = tones(variant)
  const big = variant === 'present'
  const preview = variant === 'preview'

  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setAssignments({})
    setActiveLabel(null)
    setChecked(false)
  }, [block.id, variant])

  const shuffledLabels = useMemo(
    () => seededShuffle(block.targets.map((target) => target.label), 53),
    [block.targets],
  )

  const placed = new Set(Object.values(assignments))
  const allPlaced = Object.keys(assignments).length === block.targets.length

  function placeOn(targetId: string) {
    if (preview || checked) return
    if (assignments[targetId]) {
      const next = { ...assignments }
      delete next[targetId]
      setAssignments(next)
      return
    }
    if (!activeLabel) return
    setAssignments((current) => ({ ...current, [targetId]: activeLabel }))
    setActiveLabel(null)
  }

  function check() {
    setChecked(true)
    onResult?.(gradeLabel(assignments, block.targets), block.targets.length)
  }

  return (
    <div className={big ? 'space-y-7' : 'space-y-5'}>
      <h3
        className={`${big ? 'text-4xl' : 'text-xl'} font-semibold ${t.heading}`}
      >
        {block.title}
      </h3>

      {!preview && !checked && (
        <p className={`text-sm ${t.muted}`}>
          {activeLabel
            ? `Now tap where “${activeLabel}” belongs.`
            : 'Tap a label below, then tap the spot on the diagram.'}
        </p>
      )}

      <div className={`relative rounded-2xl border p-4 ${t.surface}`}>
        <Figure
          id={block.figure}
          tone={t.board ? 'board' : 'paper'}
          unlabelled={!preview}
        />

        {!preview &&
          block.targets.map((target, index) => {
            const held = assignments[target.id]
            const isRight = held === target.label
            let ring = t.board
              ? 'border-paper/50 bg-board/85 text-paper'
              : 'border-ink-3 bg-white/90 text-ink-2'
            if (held && !checked)
              ring = t.board
                ? 'border-amber-200 bg-board/90 text-paper'
                : 'border-accent bg-accent-soft text-accent-deep'
            if (checked)
              ring = isRight
                ? 'border-good bg-good text-white'
                : 'border-bad bg-bad text-white'

            return (
              <button
                key={target.id}
                type="button"
                disabled={preview || checked}
                onClick={() => placeOn(target.id)}
                aria-label={held ?? `Label position ${index + 1}`}
                style={{ left: `${target.x}%`, top: `${target.y}%` }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-2 py-1 font-semibold shadow-sm transition-colors ${ring} ${
                  big ? 'text-sm' : 'text-[10px]'
                } ${!preview && !checked ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              >
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  {checked &&
                    (isRight ? (
                      <TickIcon className="size-3" />
                    ) : (
                      <CrossIcon className="size-3" />
                    ))}
                  {held ?? index + 1}
                </span>
              </button>
            )
          })}
      </div>

      {!preview && (
        <div className="flex flex-wrap gap-2">
          {shuffledLabels.map((label) => {
            const used = placed.has(label)
            const isActive = activeLabel === label
            return (
              <button
                key={label}
                type="button"
                disabled={used || checked}
                onClick={() => setActiveLabel(isActive ? null : label)}
                className={`rounded-full border px-3 py-1.5 font-medium transition-colors ${big ? 'text-base' : 'text-sm'} ${
                  used
                    ? `opacity-25 ${t.surface} ${t.body}`
                    : isActive
                      ? 'border-accent bg-accent text-white'
                      : `${t.surface} ${t.body} ${checked ? '' : `cursor-pointer ${t.surfaceHover}`}`
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {!preview && !checked && (
        <Button
          variant={t.board ? 'board' : 'primary'}
          disabled={!allPlaced}
          onClick={check}
        >
          {allPlaced
            ? 'Check the diagram'
            : `${Object.keys(assignments).length} of ${block.targets.length} placed`}
        </Button>
      )}

      {checked && (
        <div className="space-y-2">
          <p className={`text-sm font-semibold ${t.heading}`}>
            {gradeLabel(assignments, block.targets)} of {block.targets.length}{' '}
            labels in the right place
          </p>
          {block.targets
            .filter((target) => assignments[target.id] !== target.label)
            .map((target) => (
              <p key={target.id} className={`text-xs ${t.muted}`}>
                Position {block.targets.indexOf(target) + 1} should be “
                {target.label}”.
              </p>
            ))}
        </div>
      )}
    </div>
  )
}
