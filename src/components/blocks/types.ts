import type { Block } from '../../types/lesson'

/**
 * Every block renders in exactly three situations, and knows about no others:
 *
 *   preview — inside the Review editor: static, answers visible to the teacher
 *   play    — a student on their own device: interactive and scored
 *   present — on the projector: interactive, blackboard palette, teacher-paced
 */
export type BlockVariant = 'preview' | 'play' | 'present'

export interface BlockViewProps<B extends Block = Block> {
  block: B
  variant: BlockVariant
  /** Called once, when the student commits an answer. */
  onResult?: (correct: number, total: number) => void
}

export function isBoard(variant: BlockVariant) {
  return variant === 'present'
}

/** Text and surface classes for the two palettes a block can land on. */
export function tones(variant: BlockVariant) {
  const board = isBoard(variant)
  return {
    board,
    heading: board ? 'text-paper' : 'text-ink',
    body: board ? 'text-paper/75' : 'text-ink-2',
    muted: board ? 'text-paper/50' : 'text-ink-3',
    surface: board
      ? 'border-board-line bg-board-2'
      : 'border-line bg-white',
    surfaceHover: board
      ? 'hover:border-paper/40 hover:bg-board-line'
      : 'hover:border-ink-3 hover:bg-paper',
    correct: board
      ? 'border-emerald-300/70 bg-emerald-300/15 text-paper'
      : 'border-good bg-good-soft text-ink',
    wrong: board
      ? 'border-rose-300/70 bg-rose-300/15 text-paper'
      : 'border-bad bg-bad-soft text-ink',
  }
}

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']
