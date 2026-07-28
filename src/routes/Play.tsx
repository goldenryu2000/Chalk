import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { BlockView } from '../components/blocks/BlockView'
import {
  Button,
  Chip,
  CurriculumTag,
  LinkButton,
  Logo,
  ProgressBar,
  SectionLabel,
} from '../components/ui'
import { classInfo } from '../content/library'
import { totalScore, type BlockResult } from '../lib/scoring'
import { useLessonStore } from '../store/useLessonStore'
import { BLOCK_LABELS, isInteractive, type McqBlock } from '../types/lesson'
import { RapidFire } from './play/RapidFire'

type Phase = 'intro' | 'lesson' | 'game' | 'done'

/** The student renderer: one block at a time, scored, on a phone. */
export function Play() {
  const lesson = useLessonStore((s) => s.lesson)
  const includeGames = useLessonStore((s) => s.wizard.includeGames)

  // /play?game jumps straight to Rapid Fire, so the game can be shown on its own
  // without walking all eleven blocks first.
  const [params] = useSearchParams()
  const [phase, setPhase] = useState<Phase>(
    params.has('game') ? 'game' : 'intro',
  )
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<BlockResult[]>([])
  const [answeredCurrent, setAnsweredCurrent] = useState(false)
  const [gamePoints, setGamePoints] = useState(0)

  const block = lesson.blocks[index]
  const quizBlocks = lesson.blocks.filter(
    (b): b is McqBlock => b.type === 'mcq',
  )
  const playGame = includeGames && quizBlocks.length > 0

  function recordResult(correct: number, total: number) {
    setResults((current) => [
      ...current.filter((r) => r.blockId !== block.id),
      { blockId: block.id, correct, total },
    ])
    setAnsweredCurrent(true)
  }

  function next() {
    if (index === lesson.blocks.length - 1) {
      setPhase(playGame ? 'game' : 'done')
      return
    }
    setIndex((i) => i + 1)
    setAnsweredCurrent(false)
  }

  if (phase === 'intro') {
    return (
      <PlayFrame>
        <div className="py-8">
          <Chip tone="accent">Set by Meera Iyer · due tomorrow</Chip>
          <h1 className="mt-4 text-3xl font-semibold leading-tight">
            {lesson.title}
          </h1>
          <div className="mt-3">
            <CurriculumTag
              board={lesson.meta.board}
              grade={lesson.meta.grade}
              subject={lesson.meta.subject}
              chapterNumber={lesson.meta.chapterNumber}
            />
          </div>
          <p className="mt-4 leading-relaxed text-ink-2">{lesson.summary}</p>

          <ul className="mt-6 space-y-2 text-sm">
            <Line>{lesson.blocks.length} blocks, about 15 minutes</Line>
            <Line>
              {lesson.blocks.filter(isInteractive).length} of them are
              interactive
            </Line>
            {playGame && (
              <Line>
                A {quizBlocks.length}-question Rapid Fire round at the end
              </Line>
            )}
          </ul>

          <Button
            className="mt-8 w-full px-5 py-4 text-base"
            onClick={() => setPhase('lesson')}
          >
            Start →
          </Button>
        </div>
      </PlayFrame>
    )
  }

  if (phase === 'game') {
    // /play?game is a hand-typed URL, and the teacher may have deleted every
    // quiz block in review. Rapid Fire with nothing to ask would crash.
    if (quizBlocks.length === 0) {
      return <ScoreScreen results={results} gamePoints={gamePoints} />
    }
    return (
      <RapidFire
        blocks={quizBlocks}
        onFinish={(points) => {
          setGamePoints(points)
          setPhase('done')
        }}
      />
    )
  }

  if (phase === 'done') {
    return <ScoreScreen results={results} gamePoints={gamePoints} />
  }

  const needsAnswer = isInteractive(block)
  const canContinue = !needsAnswer || answeredCurrent

  return (
    <PlayFrame>
      <div className="sticky top-0 z-10 -mx-5 bg-paper/90 px-5 pb-3 pt-2 backdrop-blur">
        <ProgressBar value={((index + 1) / lesson.blocks.length) * 100} />
        <p className="mt-1.5 flex items-center justify-between text-xs text-ink-3">
          <span>
            {index + 1} of {lesson.blocks.length}
          </span>
          <span>{BLOCK_LABELS[block.type]}</span>
        </p>
      </div>

      <motion.div
        key={block.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="py-6"
      >
        <BlockView block={block} variant="play" onResult={recordResult} />
      </motion.div>

      <div className="sticky bottom-0 -mx-5 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur">
        <Button
          className="w-full py-3.5 text-base"
          disabled={!canContinue}
          onClick={next}
        >
          {canContinue
            ? index === lesson.blocks.length - 1
              ? playGame
                ? 'Start Rapid Fire →'
                : 'Finish →'
              : 'Continue →'
            : 'Answer to continue'}
        </Button>
      </div>
    </PlayFrame>
  )
}

function PlayFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line px-5 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Logo />
          <span className="text-xs text-ink-3">{classInfo.name}</span>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-5">{children}</div>
    </div>
  )
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-ink-2">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
      {children}
    </li>
  )
}

function ScoreScreen({
  results,
  gamePoints,
}: {
  results: BlockResult[]
  gamePoints: number
}) {
  const lesson = useLessonStore((s) => s.lesson)
  const score = totalScore(results)

  // Which outcomes this student actually got right, from their own answers.
  const byOutcome = new Map<string, { correct: number; total: number }>()
  for (const result of results) {
    const block = lesson.blocks.find((b) => b.id === result.blockId)
    if (!block) continue
    for (const outcomeId of block.outcomes) {
      const entry = byOutcome.get(outcomeId) ?? { correct: 0, total: 0 }
      entry.correct += result.correct
      entry.total += result.total
      byOutcome.set(outcomeId, entry)
    }
  }

  return (
    <PlayFrame>
      <div className="py-10">
        <SectionLabel>Lesson complete</SectionLabel>
        <p className="mt-2 font-display text-6xl font-semibold">
          {score.percent}%
        </p>
        <p className="mt-1 text-ink-2">
          {score.correct} of {score.total} correct
          {gamePoints > 0 && (
            <>
              {' '}
              · <strong>{gamePoints}</strong> Rapid Fire points
            </>
          )}
        </p>

        <div className="mt-8">
          <SectionLabel>How you did, outcome by outcome</SectionLabel>
          <ul className="mt-3 space-y-3">
            {lesson.meta.outcomes
              .filter((outcome) => byOutcome.has(outcome.id))
              .map((outcome) => {
                const entry = byOutcome.get(outcome.id)!
                const pct = Math.round((entry.correct / entry.total) * 100)
                return (
                  <li key={outcome.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span>
                        <span className="font-mono text-xs text-ink-3">
                          {outcome.id}
                        </span>{' '}
                        {outcome.text}
                      </span>
                      <span className="shrink-0 font-semibold">{pct}%</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar value={pct} tone={pct >= 60 ? 'good' : 'accent'} />
                    </div>
                  </li>
                )
              })}
          </ul>
        </div>

        <p className="mt-8 rounded-xl bg-paper-2 px-4 py-3 text-sm leading-relaxed text-ink-2">
          This is what the teacher sees for all 31 students at once — which is
          the{' '}
          <Link to="/results" className="font-semibold text-accent underline">
            class results
          </Link>{' '}
          screen.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <LinkButton to="/results" className="px-5 py-3.5 text-base">
            See the teacher's view →
          </LinkButton>
          <LinkButton to="/dashboard" variant="secondary" className="px-5 py-3.5 text-base">
            Back to the dashboard
          </LinkButton>
        </div>
      </div>
    </PlayFrame>
  )
}
