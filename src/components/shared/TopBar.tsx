import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Court' },
  { to: '/roster', label: 'Roster' },
  { to: '/library', label: 'Plays' },
]

interface TopBarProps {
  className?: string
}

export function TopBar({ className = '' }: TopBarProps) {
  return (
    <header
      className={`shrink-0 items-center gap-4 border-b border-white/8 bg-black/40 px-4 py-2 backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none">🏀</span>
        <span className="text-sm font-bold tracking-tight">Tactics Planner</span>
      </div>

      <nav className="ml-6 flex gap-1">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
