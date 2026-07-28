import { Link } from 'react-router-dom'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/** Small shared primitives. Deliberately few — the screens carry the design. */

export function Logo({ tone = 'ink' }: { tone?: 'ink' | 'chalk' }) {
  const text = tone === 'chalk' ? 'text-paper' : 'text-ink'
  return (
    <Link to="/" className={`flex items-center gap-2 ${text}`}>
      <svg viewBox="0 0 64 64" className="size-7" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#16211d" />
        <g transform="rotate(-32 32 32)">
          <rect x="26" y="12" width="12" height="40" rx="3" fill="#faf7f2" />
          <rect x="26" y="12" width="12" height="7" rx="3" fill="#d9541e" />
        </g>
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">
        Chalk
      </span>
    </Link>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'board'

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-deep disabled:bg-ink-3 disabled:hover:bg-ink-3',
  secondary:
    'bg-white text-ink border border-line hover:border-ink-3 hover:bg-paper',
  ghost: 'text-ink-2 hover:bg-paper-2 hover:text-ink',
  board:
    'bg-board-2 text-paper border border-board-line hover:border-paper/40 hover:bg-board-line',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ComponentPropsWithoutRef<'button'> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  )
}

export function LinkButton({
  to,
  variant = 'primary',
  className = '',
  children,
}: {
  to: string
  variant?: ButtonVariant
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}

export function Chip({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'good' | 'bad' | 'chalk'
}) {
  const tones = {
    neutral: 'bg-paper-2 text-ink-2',
    accent: 'bg-accent-soft text-accent-deep',
    good: 'bg-good-soft text-good',
    bad: 'bg-bad-soft text-bad',
    chalk: 'bg-board-2 text-paper/80 border border-board-line',
  }
  return <span className={`chip ${tones[tone]}`}>{children}</span>
}

/** The board/class/chapter provenance line. Used on nearly every screen. */
export function CurriculumTag({
  board,
  grade,
  subject,
  chapterNumber,
  tone = 'paper',
}: {
  board: string
  grade: number
  subject: string
  chapterNumber: number
  tone?: 'paper' | 'board'
}) {
  const cls =
    tone === 'board'
      ? 'text-paper/60 border-board-line'
      : 'text-ink-3 border-line'
  return (
    <p
      className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      <span>{board}</span>
      <span aria-hidden="true">·</span>
      <span>Class {grade}</span>
      <span aria-hidden="true">·</span>
      <span>{subject}</span>
      <span aria-hidden="true">·</span>
      <span>Chapter {chapterNumber}</span>
    </p>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">
      {children}
    </p>
  )
}

export function ProgressBar({
  value,
  tone = 'accent',
}: {
  value: number
  tone?: 'accent' | 'good' | 'chalk'
}) {
  const fill = {
    accent: 'bg-accent',
    good: 'bg-good',
    chalk: 'bg-paper',
  }[tone]
  const track = tone === 'chalk' ? 'bg-board-line' : 'bg-paper-2'
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${track}`}>
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-out ${fill}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function TickIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none">
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CrossIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none">
      <path
        d="M5.5 5.5l9 9m0-9-9 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Banner that keeps the "this is a demo" promise visible without nagging. */
export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-line bg-paper-2/60 px-3 py-2 text-xs leading-relaxed text-ink-3">
      {children}
    </p>
  )
}
