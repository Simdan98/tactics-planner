import type Konva from 'konva'
import { useRef } from 'react'
import { Court } from '../components/court/Court'
import { FrameStrip } from '../components/court/FrameStrip'
import { ScreenPalette } from '../components/court/ScreenPalette'
import { Toolbar } from '../components/court/Toolbar'
import { SavePlayButton } from '../components/plays/SavePlayButton'
import { RosterDrawer } from '../components/roster/RosterDrawer'
import { RosterPanel } from '../components/roster/RosterPanel'
import { ExportButton } from '../components/shared/ExportButton'
import { ShareButton } from '../components/shared/ShareButton'
import { useSharedPlayLoader } from '../hooks/useSharedPlayLoader'

export function Editor() {
  const stageRef = useRef<Konva.Stage>(null)
  useSharedPlayLoader()

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Editor header — tools left, actions right, fits in one row */}
      <div className="flex shrink-0 items-center gap-2 border-b border-white/8 bg-black/20 px-2 py-1.5">
        <Toolbar />
        <div className="ml-auto flex items-center gap-1">
          <ShareButton />
          <SavePlayButton />
          <ExportButton stageRef={stageRef} />
        </div>
      </div>

      {/* Main area: side panel (md+) + court column */}
      <div className="flex min-h-0 flex-1">
        {/* Side panel — hidden on mobile */}
        <aside className="hidden shrink-0 flex-col gap-3 overflow-y-auto border-r border-white/8 bg-black/20 p-3 md:flex md:w-48 lg:w-56">
          <RosterPanel />
          <ScreenPalette />
        </aside>

        {/* Court + roster strip + frame strip column */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Court area — no overlay, toolbar is in the header */}
          <div className="flex min-h-0 flex-1 flex-col">
            <Court ref={stageRef} />
          </div>

          {/* Roster strip — directly under court on mobile */}
          <RosterDrawer className="md:hidden" />

          {/* Frame strip — always visible */}
          <FrameStrip />
        </div>
      </div>
    </div>
  )
}
