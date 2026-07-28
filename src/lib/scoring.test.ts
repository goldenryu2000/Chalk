import { describe, expect, it } from 'vitest'
import { lightLesson } from '../content/light-class10'
import {
  RAPID_FIRE_SECONDS,
  computeCoverage,
  gradeLabel,
  gradeMatch,
  gradeSequence,
  percent,
  rapidFirePoints,
  seededShuffle,
  totalScore,
} from './scoring'

describe('percent', () => {
  it('rounds to the nearest whole number', () => {
    expect(percent(2, 3)).toBe(67)
  })

  it('returns 0 rather than NaN when nothing was answerable', () => {
    expect(percent(0, 0)).toBe(0)
  })
})

describe('gradeSequence', () => {
  const correct = ['a', 'b', 'c', 'd']

  it('counts only items in the right position', () => {
    expect(gradeSequence(['a', 'c', 'b', 'd'], correct)).toBe(2)
  })

  it('awards full marks for the exact order', () => {
    expect(gradeSequence([...correct], correct)).toBe(4)
  })
})

describe('gradeMatch', () => {
  const pairs = [
    { left: 'Pole', right: 'Centre of the mirror surface' },
    { left: 'Focus', right: 'Where parallel rays converge' },
  ]

  it('counts correct pairings and ignores unanswered ones', () => {
    expect(gradeMatch({ Pole: 'Centre of the mirror surface' }, pairs)).toBe(1)
  })

  it('does not credit a swapped pairing', () => {
    const swapped = {
      Pole: 'Where parallel rays converge',
      Focus: 'Centre of the mirror surface',
    }
    expect(gradeMatch(swapped, pairs)).toBe(0)
  })
})

describe('gradeLabel', () => {
  const targets = [
    { id: 't1', label: 'Normal' },
    { id: 't2', label: 'Incident ray' },
  ]

  it('credits a hotspot only when it holds its own label', () => {
    expect(gradeLabel({ t1: 'Normal', t2: 'Normal' }, targets)).toBe(1)
  })
})

describe('rapidFirePoints', () => {
  it('scores nothing for a wrong answer, however fast', () => {
    expect(rapidFirePoints(false, RAPID_FIRE_SECONDS, 5)).toBe(0)
  })

  it('gives the full speed bonus for an instant answer', () => {
    expect(rapidFirePoints(true, RAPID_FIRE_SECONDS, 1)).toBe(200)
  })

  it('drops the speed bonus as the clock runs down', () => {
    expect(rapidFirePoints(true, 0, 1)).toBe(100)
  })

  it('adds 25 per answer of streak beyond the first', () => {
    expect(rapidFirePoints(true, 0, 3)).toBe(150)
  })

  it('clamps a seconds value above the round length', () => {
    expect(rapidFirePoints(true, 999, 1)).toBe(200)
  })
})

describe('seededShuffle', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8]

  it('is deterministic for a given seed', () => {
    expect(seededShuffle(items, 42)).toEqual(seededShuffle(items, 42))
  })

  it('produces a different arrangement for a different seed', () => {
    expect(seededShuffle(items, 1)).not.toEqual(seededShuffle(items, 2))
  })

  it('keeps every element exactly once', () => {
    expect([...seededShuffle(items, 7)].sort((a, b) => a - b)).toEqual(items)
  })

  it('does not mutate its input', () => {
    const original = [...items]
    seededShuffle(items, 3)
    expect(items).toEqual(original)
  })
})

describe('computeCoverage', () => {
  const coverage = computeCoverage(lightLesson)

  it('reports the lens outcome as the gap the teacher must fill', () => {
    expect(coverage.missing.map((o) => o.id)).toEqual(['9.6'])
  })

  it('covers the other five chapter outcomes', () => {
    expect(coverage.covered).toHaveLength(5)
  })

  it('counts how many blocks address each outcome', () => {
    expect(coverage.counts['9.1']).toBe(3)
  })
})

describe('totalScore', () => {
  it('aggregates across blocks', () => {
    const result = totalScore([
      { blockId: 'a', correct: 3, total: 5 },
      { blockId: 'b', correct: 1, total: 1 },
    ])
    expect(result).toEqual({ correct: 4, total: 6, percent: 67 })
  })
})
