import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { ROSTER_DRAG_MIME } from '../../hooks/useCourtDrop'
import { useCourtStore } from '../../store/useCourtStore'
import { useRosterStore } from '../../store/useRosterStore'
import { Panel } from '../shared/Panel'

export function RosterPanel() {
  const rosterPlayers = useRosterStore((s) => s.players)
  const courtPlayers = useCourtStore((s) => s.players)
  const onCourtIds = new Set(courtPlayers.map((p) => p.rosterId))

  function handlePlayerDragStart(e: DragEvent<HTMLLIElement>, rosterId: string) {
    e.dataTransfer.setData(ROSTER_DRAG_MIME, rosterId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <Panel className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/80">Roster</h2>
        <Link to="/roster" className="text-xs text-accent hover:underline">
          Manage
        </Link>
      </div>

      {rosterPlayers.length === 0 ? (
        <p className="text-xs text-white/50">
          No players yet.{' '}
          <Link to="/roster" className="text-accent hover:underline">
            Add some
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {rosterPlayers.map((p) => {
            const onCourt = onCourtIds.has(p.id)
            return (
              <li
                key={p.id}
                draggable={!onCourt}
                onDragStart={(e) => handlePlayerDragStart(e, p.id)}
                className={`flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                  onCourt ? 'cursor-not-allowed bg-white/5 text-white/30' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={onCourt ? 'Already on court' : 'Drag onto the court'}
              >
                <span className="font-mono text-accent">#{p.number}</span>
                {p.name || <span className="text-white/40">Unnamed</span>}
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}
