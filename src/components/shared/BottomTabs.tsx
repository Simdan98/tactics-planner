import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Court', icon: '🏀' },
  { to: '/roster', label: 'Roster', icon: '👥' },
  { to: '/library', label: 'Plays', icon: '📋' },
]

interface BottomTabsProps {
  className?: string
}

export function BottomTabs({ className = '' }: BottomTabsProps) {
  return (
    <nav
      className={`shrink-0 border-t border-white/10 bg-black/85 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-md ${className}`}
    >
      <div className="mx-auto flex max-w-sm items-center justify-around gap-2 pt-1.5 pb-2">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl px-5 py-2 text-[11px] font-medium transition-colors ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-white/40 active:bg-white/5 active:text-white/60'
              }`
            }
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
