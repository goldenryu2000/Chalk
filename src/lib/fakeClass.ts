/**
 * Plausible-looking class responses for Present mode. Derived from the block id
 * so the same question always shows the same bars. A demo that reshuffles its
 * numbers on every render looks like what it is.
 */

function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Response percentages across the options, summing to 100, with the correct
 * option always leading. Difficult questions still show a meaningful split.
 */
export function pollPercentages(
  blockId: string,
  optionCount: number,
  answerIndex: number,
): number[] {
  const seed = hash(blockId)
  const correctShare = 44 + (seed % 27) // 44–70%
  const rest = 100 - correctShare
  const weights = Array.from(
    { length: optionCount - 1 },
    (_, i) => 1 + ((seed >> (i * 3 + 2)) % 5),
  )
  const weightSum = weights.reduce((a, b) => a + b, 0)

  const shares = Array.from({ length: optionCount }, () => 0)
  shares[answerIndex] = correctShare

  let distributed = 0
  let w = 0
  for (let i = 0; i < optionCount; i++) {
    if (i === answerIndex) continue
    const isLast = w === weights.length - 1
    const share = isLast
      ? rest - distributed
      : Math.round((weights[w] / weightSum) * rest)
    shares[i] = Math.max(0, share)
    distributed += shares[i]
    w++
  }
  return shares
}

/** How many of the class have "answered". Sits under the poll bars. */
export function respondedCount(blockId: string, present: number): number {
  return present - (hash(blockId) % 3)
}
