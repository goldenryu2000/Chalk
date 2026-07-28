import type { LearningOutcome, Lesson } from '../types/lesson'

/**
 * Pure functions shared by the Play, Present and Results screens. Kept free of
 * React so they can be tested directly — this is the only part of the demo with
 * logic worth getting wrong.
 */

export interface BlockResult {
  blockId: string
  correct: number
  total: number
}

export function percent(correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((correct / total) * 100)
}

/** Number of items sitting in their authored position. */
export function gradeSequence(submitted: string[], correct: string[]): number {
  return submitted.reduce(
    (hits, step, index) => (step === correct[index] ? hits + 1 : hits),
    0,
  )
}

/** Number of left-hand terms paired with their authored right-hand match. */
export function gradeMatch(
  assignments: Record<string, string>,
  pairs: { left: string; right: string }[],
): number {
  return pairs.reduce(
    (hits, pair) => (assignments[pair.left] === pair.right ? hits + 1 : hits),
    0,
  )
}

/** Number of hotspots holding their authored label. */
export function gradeLabel(
  assignments: Record<string, string>,
  targets: { id: string; label: string }[],
): number {
  return targets.reduce(
    (hits, target) =>
      assignments[target.id] === target.label ? hits + 1 : hits,
    0,
  )
}

export const RAPID_FIRE_SECONDS = 15

/**
 * Rapid Fire scoring: a flat 100 for a correct answer, up to 100 more for
 * answering quickly, and a streak bonus that rewards not breaking the chain.
 * Wrong answers score nothing, so guessing fast is never a strategy.
 */
export function rapidFirePoints(
  isCorrect: boolean,
  secondsLeft: number,
  streak: number,
): number {
  if (!isCorrect) return 0
  const clamped = Math.max(0, Math.min(RAPID_FIRE_SECONDS, secondsLeft))
  const speedBonus = Math.round((clamped / RAPID_FIRE_SECONDS) * 100)
  const streakBonus = Math.max(0, streak - 1) * 25
  return 100 + speedBonus + streakBonus
}

/**
 * Deterministic shuffle, so a student who reloads sees the same arrangement and
 * so the tests can assert on it. Mulberry32 + Fisher–Yates.
 */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items]
  let state = seed >>> 0
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export interface Coverage {
  covered: LearningOutcome[]
  missing: LearningOutcome[]
  /** Outcome id → how many blocks address it. */
  counts: Record<string, number>
}

/**
 * Which of the chapter's declared outcomes this lesson actually teaches. The
 * gap is the point: the teacher needs to see what the draft left out.
 */
export function computeCoverage(lesson: Lesson): Coverage {
  const counts: Record<string, number> = {}
  for (const outcome of lesson.meta.outcomes) counts[outcome.id] = 0
  for (const block of lesson.blocks) {
    for (const id of block.outcomes) {
      if (id in counts) counts[id] += 1
    }
  }
  return {
    covered: lesson.meta.outcomes.filter((o) => counts[o.id] > 0),
    missing: lesson.meta.outcomes.filter((o) => counts[o.id] === 0),
    counts,
  }
}

export function totalScore(results: BlockResult[]): {
  correct: number
  total: number
  percent: number
} {
  const correct = results.reduce((sum, r) => sum + r.correct, 0)
  const total = results.reduce((sum, r) => sum + r.total, 0)
  return { correct, total, percent: percent(correct, total) }
}
