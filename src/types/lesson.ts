/**
 * The lesson document is the whole product in one shape.
 *
 * Four renderers consume it and nothing else:
 *   Review   — every block, editable
 *   Present  — every block, projector-sized, teacher-driven
 *   Play     — one block at a time, scored
 *   Results  — the scores that came back out
 *
 * A real backend would only ever be asked to produce this JSON. That is why the
 * demo hard-codes it: the interface is the deliverable, the generator is not.
 */

export type Board = 'CBSE' | 'ICSE' | 'State Board'

export interface LearningOutcome {
  /** NCERT-style identifier, e.g. "9.4". */
  id: string
  text: string
}

export interface LessonMeta {
  board: Board
  grade: number
  subject: string
  chapterNumber: number
  chapter: string
  /** Every outcome the chapter declares — including ones this lesson misses. */
  outcomes: LearningOutcome[]
  durationMinutes: number
  difficulty: 'Foundation' | 'Standard' | 'Advanced'
  language: 'English' | 'Hindi' | 'Bilingual'
}

interface BlockBase {
  id: string
  /** Outcome ids this block teaches or assesses. Drives the coverage panel. */
  outcomes: string[]
}

export interface KeyTerm {
  term: string
  definition: string
}

export interface ExplainerBlock extends BlockBase {
  type: 'explainer'
  title: string
  body: string[]
  keyTerms?: KeyTerm[]
  /** Which hand-built SVG figure to draw alongside the text. */
  figure?: FigureId
}

export interface McqBlock extends BlockBase {
  type: 'mcq'
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface MatchBlock extends BlockBase {
  type: 'match'
  title: string
  pairs: { left: string; right: string }[]
}

export interface SequenceBlock extends BlockBase {
  type: 'sequence'
  title: string
  /** Authored in the correct order; the player shuffles them. */
  steps: string[]
}

export interface LabelBlock extends BlockBase {
  type: 'label'
  title: string
  figure: FigureId
  /** Each hotspot on the figure, with the label that belongs in it. */
  targets: { id: string; label: string; x: number; y: number }[]
}

export type Block =
  | ExplainerBlock
  | McqBlock
  | MatchBlock
  | SequenceBlock
  | LabelBlock

export type BlockType = Block['type']

export type FigureId = 'plane-mirror' | 'concave-mirror' | 'refraction-slab'

export interface Lesson {
  id: string
  title: string
  summary: string
  meta: LessonMeta
  blocks: Block[]
}

/** Blocks a student can be scored on. Explainers are read, not answered. */
export const INTERACTIVE_TYPES: BlockType[] = [
  'mcq',
  'match',
  'sequence',
  'label',
]

export function isInteractive(block: Block): boolean {
  return INTERACTIVE_TYPES.includes(block.type)
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  explainer: 'Explainer',
  mcq: 'Quiz',
  match: 'Match the pairs',
  sequence: 'Put in order',
  label: 'Label the diagram',
}
