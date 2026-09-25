import type { DragEvent } from 'react'
import { SCREEN_DRAG_MIME } from '../../hooks/useCourtDrop'
import { ZALGIRIS } from '../../theme'
import { Panel } from '../shared/Panel'

export function ScreenPalette() {
  function handleScreenDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData(SCREEN_DRAG_MIME, 'true')
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <Panel className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-white/80">Actions</h2>
      <div
        draggable
        onDragStart={handleScreenDragStart}
        className="flex w-fit cursor-grab items-center gap-2 rounded-md bg-white/10 px-2 py-1.5 text-sm text-white hover:bg-white/20"
        title="Drag onto the court to mark a screen"
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: ZALGIRIS.screenRed }}
        >
          S
        </span>
        Screen
      </div>
    </Panel>
  )
}
