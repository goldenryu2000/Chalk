import { create } from 'zustand'
import { alternates, lensBlock, lightLesson } from '../content/light-class10'
import type { Block, Lesson } from '../types/lesson'

/**
 * A single working copy of the lesson, shared by Review, Present, Play and
 * Results. In the real product this would be a server document; here it lives
 * in memory and resets on reload, which is fine — and honest — for a demo.
 */

export interface WizardChoices {
  board: string
  grade: number
  subject: string
  chapter: string
  durationMinutes: number
  difficulty: 'Foundation' | 'Standard' | 'Advanced'
  includeGames: boolean
  language: 'English' | 'Hindi' | 'Bilingual'
}

interface LessonState {
  lesson: Lesson
  /** Set once the teacher clicks Approve & Publish. */
  approved: boolean
  wizard: WizardChoices
  /** Which alternate each block is currently showing, for round-robin regeneration. */
  regenerationIndex: Record<string, number>

  setWizard: (patch: Partial<WizardChoices>) => void
  updateBlock: (id: string, patch: Partial<Block>) => void
  moveBlock: (id: string, direction: -1 | 1) => void
  removeBlock: (id: string) => void
  regenerateBlock: (id: string) => void
  /** True when there is a pre-written alternate to swap in. */
  canRegenerate: (id: string) => boolean
  addLensBlock: () => void
  approve: () => void
  reset: () => void
}

const defaultWizard: WizardChoices = {
  board: 'CBSE',
  grade: 10,
  subject: 'Science',
  chapter: 'Light: Reflection and Refraction',
  durationMinutes: 40,
  difficulty: 'Standard',
  includeGames: true,
  language: 'English',
}

/** Deep enough for our shapes, and keeps the fixture pristine across resets. */
const freshLesson = (): Lesson => structuredClone(lightLesson)

export const useLessonStore = create<LessonState>((set) => ({
  lesson: freshLesson(),
  approved: false,
  wizard: { ...defaultWizard },
  regenerationIndex: {},

  setWizard: (patch) => set((s) => ({ wizard: { ...s.wizard, ...patch } })),

  updateBlock: (id, patch) =>
    set((s) => ({
      lesson: {
        ...s.lesson,
        blocks: s.lesson.blocks.map((b) =>
          b.id === id ? ({ ...b, ...patch } as Block) : b,
        ),
      },
    })),

  moveBlock: (id, direction) =>
    set((s) => {
      const blocks = [...s.lesson.blocks]
      const from = blocks.findIndex((b) => b.id === id)
      const to = from + direction
      if (from < 0 || to < 0 || to >= blocks.length) return s
      ;[blocks[from], blocks[to]] = [blocks[to], blocks[from]]
      return { lesson: { ...s.lesson, blocks } }
    }),

  removeBlock: (id) =>
    set((s) => ({
      lesson: {
        ...s.lesson,
        blocks: s.lesson.blocks.filter((b) => b.id !== id),
      },
    })),

  canRegenerate: (id) => (alternates[id]?.length ?? 0) > 0,

  regenerateBlock: (id) =>
    set((s) => {
      const options = alternates[id]
      if (!options?.length) return s
      // Cycle through the original and its alternates so repeated clicks keep moving.
      const nextIndex = ((s.regenerationIndex[id] ?? 0) + 1) % (options.length + 1)
      const replacement =
        nextIndex === 0
          ? lightLesson.blocks.find((b) => b.id === id)
          : options[nextIndex - 1]
      if (!replacement) return s
      return {
        regenerationIndex: { ...s.regenerationIndex, [id]: nextIndex },
        lesson: {
          ...s.lesson,
          blocks: s.lesson.blocks.map((b) =>
            b.id === id ? structuredClone(replacement) : b,
          ),
        },
      }
    }),

  addLensBlock: () =>
    set((s) => {
      if (s.lesson.blocks.some((b) => b.id === lensBlock.id)) return s
      return {
        lesson: {
          ...s.lesson,
          blocks: [...s.lesson.blocks, structuredClone(lensBlock)],
        },
      }
    }),

  approve: () => set({ approved: true }),

  // Deliberately leaves `wizard` alone: this runs when the teacher presses
  // "Build the lesson", and wiping their board/difficulty/language choices at
  // that exact moment would silently contradict what they just picked.
  reset: () =>
    set({
      lesson: freshLesson(),
      approved: false,
      regenerationIndex: {},
    }),
}))

/** Convenience for screens that only need the block list. */
export const selectBlocks = (s: LessonState) => s.lesson.blocks

export type { LessonState }
