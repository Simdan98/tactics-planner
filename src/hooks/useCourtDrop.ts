import type { DragEvent, RefObject } from 'react'
import { useCourtStore } from '../store/useCourtStore'
import { useRosterStore } from '../store/useRosterStore'

export const ROSTER_DRAG_MIME = 'application/x-roster-player-id'
export const SCREEN_DRAG_MIME = 'application/x-screen-marker'

export function useCourtDrop(containerRef: RefObject<HTMLElement | null>, scale: number) {
  const rosterPlayers = useRosterStore((s) => s.players)
  const addPlayerToCourt = useCourtStore((s) => s.addPlayerToCourt)
  const addScreenAt = useCourtStore((s) => s.addScreenAt)

  function handleDragOver(e: DragEvent<HTMLElement>) {
    e.preventDefault()
  }

  function toLogicalPoint(e: DragEvent<HTMLElement>) {
    const container = containerRef.current
    if (!container || scale === 0) return null
    const rect = container.getBoundingClientRect()
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale }
  }

  function handleDrop(e: DragEvent<HTMLElement>) {
    e.preventDefault()
    const point = toLogicalPoint(e)
    if (!point) return

    if (e.dataTransfer.types.includes(SCREEN_DRAG_MIME)) {
      addScreenAt(point.x, point.y)
      return
    }

    const rosterId = e.dataTransfer.getData(ROSTER_DRAG_MIME)
    const rosterPlayer = rosterPlayers.find((p) => p.id === rosterId)
    if (!rosterPlayer) return
    addPlayerToCourt(rosterPlayer.id, rosterPlayer.name, rosterPlayer.number, point.x, point.y)
  }

  return { handleDragOver, handleDrop }
}
