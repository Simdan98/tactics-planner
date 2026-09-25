import type Konva from 'konva'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Layer, Line, Stage } from 'react-konva'
import { useContainerSize } from '../../hooks/useContainerSize'
import { useCourtDrop } from '../../hooks/useCourtDrop'
import type { SelectedElement } from '../../hooks/useCourtInteractions'
import { useCourtInteractions } from '../../hooks/useCourtInteractions'
import type { CourtAction, CourtPlayerToken, ScreenToken as ScreenTokenType } from '../../store/useCourtStore'
import { COURT_HEIGHT, COURT_WIDTH, ZALGIRIS } from '../../theme'
import { ActionLayer } from './ActionLayer'
import { BallToken } from './BallToken'
import { CourtBackground } from './CourtBackground'
import { DeleteButton } from './DeleteButton'
import { PlayerToken } from './PlayerToken'
import { ScreenToken } from './ScreenToken'

export const Court = forwardRef<Konva.Stage>(function Court(_props, forwardedRef) {
  const { ref, size } = useContainerSize<HTMLDivElement>()
  const stageRef = useRef<Konva.Stage>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardedRef, () => stageRef.current as Konva.Stage)

  // Fit within both available width and height, so the court never forces
  // the page to scroll and stays correctly proportioned at any breakpoint.
  const scale = size.width > 0 && size.height > 0
    ? Math.min(size.width / COURT_WIDTH, size.height / COURT_HEIGHT)
    : 0
  const stageWidth = COURT_WIDTH * scale
  const stageHeight = COURT_HEIGHT * scale

  const {
    players,
    screens,
    actions,
    drawing,
    ballDisplay,
    selectedElement,
    deleteSelected,
    handlePlayerPointerDown,
    handlePlayerClick,
    handleBallPointerDown,
    handleScreenClick,
    handleScreenDragEnd,
    handleStageMove,
    handleStageUp,
    handleActionClick,
    handleStageClick,
  } = useCourtInteractions(stageRef)

  // Dropzone sized to exactly match the canvas (not the flex container it's
  // centered in), so drop coordinates map correctly to logical court space.
  const { handleDragOver, handleDrop } = useCourtDrop(dropRef, scale)

  return (
    <div ref={ref} className="flex min-h-0 w-full flex-1 items-center justify-center">
      {scale > 0 && (
        <div
          ref={dropRef}
          style={{ width: stageWidth, height: stageHeight }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Stage
            ref={stageRef}
            width={stageWidth}
            height={stageHeight}
            scaleX={scale}
            scaleY={scale}
            onMouseMove={handleStageMove}
            onTouchMove={handleStageMove}
            onMouseUp={handleStageUp}
            onTouchEnd={handleStageUp}
            onClick={handleStageClick}
            onTap={handleStageClick}
            className="rounded-lg overflow-hidden"
          >
            <Layer>
              <CourtBackground />
              <ActionLayer actions={actions} selectedActionId={selectedElement?.kind === 'action' ? selectedElement.id : null} onActionClick={handleActionClick} />

              {drawing?.kind === 'path' && (
                <Line
                  points={drawing.points}
                  stroke={ZALGIRIS.moveRed}
                  strokeWidth={3}
                  opacity={0.6}
                  lineCap="round"
                />
              )}

              {screens.map((s) => (
                <ScreenToken
                  key={s.id}
                  x={s.x}
                  y={s.y}
                  draggable
                  selected={selectedElement?.kind === 'screen' && selectedElement.id === s.id}
                  onDragEnd={(x, y) => handleScreenDragEnd(s.id, x, y)}
                  onClick={() => handleScreenClick(s.id)}
                />
              ))}

              {players.map((p) => (
                <PlayerToken
                  key={p.id}
                  x={p.x}
                  y={p.y}
                  number={p.number}
                  selected={selectedElement?.kind === 'player' && selectedElement.id === p.id}
                  onPointerDown={(e) => handlePlayerPointerDown(p.id, e)}
                  onClick={() => handlePlayerClick(p.id)}
                />
              ))}

              <BallToken x={ballDisplay.x} y={ballDisplay.y} onPointerDown={handleBallPointerDown} />

              {selectedElement && <SelectedDeleteButton element={selectedElement} players={players} screens={screens} actions={actions} onDelete={deleteSelected} />}
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  )
})

const DELETE_OFFSET = 22

interface SelectedDeleteButtonProps {
  element: NonNullable<SelectedElement>
  players: CourtPlayerToken[]
  screens: ScreenTokenType[]
  actions: CourtAction[]
  onDelete: () => void
}

function SelectedDeleteButton({ element, players, screens, actions, onDelete }: SelectedDeleteButtonProps) {
  let x: number | undefined
  let y: number | undefined

  if (element.kind === 'player') {
    const p = players.find((p) => p.id === element.id)
    if (p) { x = p.x + DELETE_OFFSET; y = p.y - DELETE_OFFSET }
  } else if (element.kind === 'screen') {
    const s = screens.find((s) => s.id === element.id)
    if (s) { x = s.x + DELETE_OFFSET; y = s.y - DELETE_OFFSET }
  } else {
    const a = actions.find((a) => a.id === element.id)
    if (a) {
      if (a.type === 'move') {
        const midIdx = Math.floor(a.points.length / 4) * 2
        x = (a.points[midIdx] ?? a.points[0]) + DELETE_OFFSET
        y = (a.points[midIdx + 1] ?? a.points[1]) - DELETE_OFFSET
      } else {
        x = (a.fromPoint.x + a.toPoint.x) / 2 + DELETE_OFFSET
        y = (a.fromPoint.y + a.toPoint.y) / 2 - DELETE_OFFSET
      }
    }
  }

  if (x === undefined || y === undefined) return null
  return <DeleteButton x={x} y={y} onDelete={onDelete} />
}
