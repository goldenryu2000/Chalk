import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { teacher } from '../content/library'
import { Logo } from './ui'

/** The signed-in teacher chrome. Present and Play run outside it, full-bleed. */
export function Shell({
  children,
  wide = false,
}: {
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-3">
          <Logo />

          <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
            <NavItem to="/dashboard">My lessons</NavItem>
            <NavItem to="/generate">Create</NavItem>
            <NavItem to="/results">Class results</NavItem>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right leading-tight md:block">
              <p className="text-sm font-semibold">{teacher.name}</p>
              <p className="text-xs text-ink-3">{teacher.school}</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full bg-board text-sm font-semibold text-paper">
              {teacher.initials}
            </span>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-5 py-8 ${wide ? 'max-w-7xl' : 'max-w-5xl'}`}>
        {children}
      </main>
    </div>
  )
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg px-3 py-1.5 transition-colors ${
          isActive ? 'bg-paper-2 text-ink' : 'text-ink-3 hover:text-ink'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
