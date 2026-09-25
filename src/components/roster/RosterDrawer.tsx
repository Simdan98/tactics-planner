import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { ROSTER_DRAG_MIME, SCREEN_DRAG_MIME } from '../../hooks/useCourtDrop'
import { useCourtStore } from '../../store/useCourtStore'
import { useRosterStore } from '../../store/useRosterStore'
import { ZALGIRIS } from '../../theme'

interface RosterDrawerProps {
  className?: string
}

export function RosterDrawer({ className = '' }: RosterDrawerProps) {
  const rosterPlayers = useRosterStore((s) => s.players)
  const courtPlayers = useCourtStore((s) => s.players)
  const onCourtIds = new Set(courtPlayers.map((p) => p.rosterId))

  function handlePlayerDragStart(e: DragEvent<HTMLDivElement>, rosterId: string) {
    e.dataTransfer.setData(ROSTER_DRAG_MIME, rosterId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  function handleScreenDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData(SCREEN_DRAG_MIME, 'true')
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      className={`shrink-0 border-t border-white/8 bg-black/30 px-3 py-2 ${className}`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
          Drag onto court
        </span>
        <Link
          to="/roster"
          className="text-[10px] font-medium text-accent hover:underline"
        >
          Manage roster →
        </Link>
      </div>

      {rosterPlayers.length === 0 ? (
        <p className="py-1 text-center text-xs text-white/35">
          No players yet.{' '}
          <Link to="/roster" className="text-accent hover:underline">
            Add some
          </Link>
        </p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {rosterPlayers.map((p) => {
            const onCourt = onCourtIds.has(p.id)
            return (
              <div
                key={p.id}
                draggable={!onCourt}
                onDragStart={(e) => handlePlayerDragStart(e, p.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] ${
                  onCourt
                    ? 'cursor-not-allowed border-white/5 bg-white/5 text-white/25'
                    : 'cursor-grab border-white/10 bg-white/10 text-white hover:bg-white/20'
                }`}
                title={onCourt ? 'Already on court' : 'Drag onto the court'}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-secondary-dark">
                  {p.number}
                </span>
                {p.name || 'Unnamed'}
              </div>
            )
          })}

          {/* Screen chip */}
          <div
            draggable
            onDragStart={handleScreenDragStart}
            className="flex shrink-0 cursor-grab items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-[11px] text-white hover:bg-white/20"
            title="Drag onto the court to place a screen"
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: ZALGIRIS.screenRed }}
            >
              S
            </span>
            Screen
          </div>
        </div>
      )}
    </div>
  )
}
