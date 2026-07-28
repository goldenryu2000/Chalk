import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { BlockView } from '../components/blocks/BlockView'
import {
  Button,
  Chip,
  CurriculumTag,
  DemoNote,
  LinkButton,
  SectionLabel,
  TickIcon,
} from '../components/ui'
import { computeCoverage } from '../lib/scoring'
import { useLessonStore } from '../store/useLessonStore'
import { BLOCK_LABELS, type Block } from '../types/lesson'
import { BlockEditor } from './review/BlockEditor'

export function Review() {
  const navigate = useNavigate()
  const lesson = useLessonStore((s) => s.lesson)
  const approved = useLessonStore((s) => s.approved)
  const approve = useLessonStore((s) => s.approve)
  const moveBlock = useLessonStore((s) => s.moveBlock)
  const removeBlock = useLessonStore((s) => s.removeBlock)
  const regenerateBlock = useLessonStore((s) => s.regenerateBlock)
  const canRegenerate = useLessonStore((s) => s.canRegenerate)
  const addLensBlock = useLessonStore((s) => s.addLensBlock)

  const [selectedId, setSelectedId] = useState(lesson.blocks[0]?.id ?? '')
  const [editing, setEditing] = useState(false)
  const [edits, setEdits] = useState(0)

  const selected =
    lesson.blocks.find((b) => b.id === selectedId) ?? lesson.blocks[0]
  const coverage = computeCoverage(lesson)

  function handleRegenerate(id: string) {
    regenerateBlock(id)
    setEdits((n) => n + 1)
  }

  if (approved) {
    return <ApprovedState blockCount={lesson.blocks.length} edits={edits} />
  }

  return (
    <Shell wide>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel>Draft: nothing is published yet</SectionLabel>
          <h1 className="mt-1 text-3xl font-semibold">{lesson.title}</h1>
          <div className="mt-2">
            <CurriculumTag
              board={lesson.meta.board}
              grade={lesson.meta.grade}
              subject={lesson.meta.subject}
              chapterNumber={lesson.meta.chapterNumber}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/generate')}>
            Regenerate all
          </Button>
          <Button className="px-5 py-3 text-base" onClick={approve}>
            <TickIcon /> Approve &amp; publish
          </Button>
        </div>
      </header>

      <Coverage
        coverage={coverage}
        onCover={() => {
          addLensBlock()
          setEdits((n) => n + 1)
        }}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
        {/* Block list */}
        <ol className="space-y-2 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:pr-1">
          {lesson.blocks.map((block, index) => (
            <BlockRow
              key={block.id}
              block={block}
              index={index}
              total={lesson.blocks.length}
              active={block.id === selected?.id}
              onSelect={() => {
                setSelectedId(block.id)
                setEditing(false)
              }}
              onMove={(dir) => moveBlock(block.id, dir)}
              onRemove={() => {
                removeBlock(block.id)
                setEdits((n) => n + 1)
                if (block.id === selectedId) {
                  const next = lesson.blocks.find((b) => b.id !== block.id)
                  setSelectedId(next?.id ?? '')
                }
              }}
            />
          ))}
        </ol>

        {/* Selected block */}
        {selected && (
          <section className="rounded-3xl border border-line bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <Chip tone="accent">{BLOCK_LABELS[selected.type]}</Chip>
                {selected.outcomes.map((id) => (
                  <Chip key={id} tone="good">
                    Outcome {id}
                  </Chip>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setEditing((v) => !v)}
                >
                  {editing ? 'Done editing' : 'Edit text'}
                </Button>
                <Button
                  variant="secondary"
                  disabled={!canRegenerate(selected.id)}
                  title={
                    canRegenerate(selected.id)
                      ? 'Swap in a different version of this block'
                      : 'No alternate written for this block in the demo'
                  }
                  onClick={() => handleRegenerate(selected.id)}
                >
                  ↻ Regenerate
                </Button>
              </div>
            </div>

            <div className="pt-6">
              {editing ? (
                <BlockEditor
                  block={selected}
                  onEdited={() => setEdits((n) => n + 1)}
                />
              ) : (
                <BlockView block={selected} variant="preview" />
              )}
            </div>
          </section>
        )}
      </div>

      <div className="mt-8">
        <DemoNote>
          “Regenerate” swaps in a second version that was written by hand, not
          generated. Three of the quiz blocks have one. Everything you edit
          here shows up in classroom and solo mode.
        </DemoNote>
      </div>
    </Shell>
  )
}

function Coverage({
  coverage,
  onCover,
}: {
  coverage: ReturnType<typeof computeCoverage>
  onCover: () => void
}) {
  const total = coverage.covered.length + coverage.missing.length
  return (
    <section className="mt-6 rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>Curriculum coverage</SectionLabel>
        <Chip tone={coverage.missing.length ? 'accent' : 'good'}>
          {coverage.covered.length} of {total} outcomes
        </Chip>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {[...coverage.covered, ...coverage.missing].map((outcome) => {
          const count = coverage.counts[outcome.id]
          const covered = count > 0
          return (
            <li key={outcome.id} className="flex items-start gap-2.5 text-sm">
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  covered
                    ? 'bg-good text-white'
                    : 'bg-accent-soft text-accent-deep'
                }`}
              >
                {covered ? <TickIcon className="size-3" /> : '!'}
              </span>
              <span className="flex-1">
                <span className="font-mono text-xs text-ink-3">
                  {outcome.id}
                </span>{' '}
                <span className={covered ? 'text-ink-2' : 'font-semibold'}>
                  {outcome.text}
                </span>
                {covered && (
                  <span className="ml-1 text-xs text-ink-3">
                    · {count} block{count > 1 ? 's' : ''}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>

      {coverage.missing.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-accent-soft px-4 py-3">
          <p className="flex-1 text-sm text-accent-deep">
            The draft skipped{' '}
            <strong>{coverage.missing.map((o) => o.id).join(', ')}</strong>. Add
            a block before you publish, or publish knowing the gap is there.
          </p>
          <Button variant="secondary" onClick={onCover}>
            Cover it
          </Button>
        </div>
      )}
    </section>
  )
}

function BlockRow({
  block,
  index,
  total,
  active,
  onSelect,
  onMove,
  onRemove,
}: {
  block: Block
  index: number
  total: number
  active: boolean
  onSelect: () => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}) {
  const heading = 'title' in block ? block.title : block.question

  return (
    <li
      className={`group rounded-2xl border transition-colors ${
        active ? 'border-accent bg-white' : 'border-line bg-white/60'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-start gap-3 p-3 text-left"
      >
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-paper-2 text-xs font-bold text-ink-3">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-3">
            {BLOCK_LABELS[block.type]}
          </span>
          <span className="mt-0.5 line-clamp-2 text-sm leading-snug">
            {heading}
          </span>
        </span>
      </button>

      <div className="flex items-center gap-1 border-t border-line px-3 py-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <IconBtn
          label="Move up"
          disabled={index === 0}
          onClick={() => onMove(-1)}
        >
          ↑
        </IconBtn>
        <IconBtn
          label="Move down"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
        >
          ↓
        </IconBtn>
        <IconBtn label="Delete block" onClick={onRemove} danger>
          ✕
        </IconBtn>
      </div>
    </li>
  )
}

function IconBtn({
  label,
  children,
  onClick,
  disabled,
  danger,
}: {
  label: string
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-6 items-center justify-center rounded-md text-xs transition-colors disabled:opacity-25 ${
        danger
          ? 'text-ink-3 hover:bg-bad-soft hover:text-bad'
          : 'text-ink-3 hover:bg-paper-2 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function ApprovedState({
  blockCount,
  edits,
}: {
  blockCount: number
  edits: number
}) {
  return (
    <Shell>
      <div className="mx-auto max-w-xl py-10 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-good text-white">
          <TickIcon className="size-7" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold">Published to Class 10-B.</h1>
        <p className="mt-3 leading-relaxed text-ink-2">
          {blockCount} blocks, {edits} teacher edit{edits === 1 ? '' : 's'}. Your
          name is on it, which is the point.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <LinkButton to="/present" className="px-5 py-4 text-base">
            Teach it on the board →
          </LinkButton>
          <LinkButton
            to="/play"
            variant="secondary"
            className="px-5 py-4 text-base"
          >
            Play it as a student →
          </LinkButton>
        </div>

        <p className="mt-6 text-sm text-ink-3">
          Or read the{' '}
          <Link to="/results" className="font-semibold text-accent underline">
            class results
          </Link>{' '}
          from after the lesson.
        </p>
      </div>
    </Shell>
  )
}
