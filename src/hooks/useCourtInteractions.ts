import type Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { RefObject } from 'react'
import { useRef, useState } from 'react'
import { useCourtStore } from '../store/useCourtStore'

interface Point {
  x: number
  y: number
}

type PointerEventLike = KonvaEventObject<PointerEvent | MouseEvent | TouchEvent>

type Drawing =
  | { kind: 'reposition'; tokenId: string; current: Point }
  | { kind: 'path'; tokenId: string; points: number[] }
  | { kind: 'ball'; current: Point }
  | null

export type SelectedElement =
  | { kind: 'player'; id: string }
  | { kind: 'screen'; id: string }
  | { kind: 'action'; id: string }
  | null

const HIT_RADIUS = 34
const MIN_MOVE_DISTANCE = 6
const BALL_HOLD_OFFSET = 22

function offsetFromPlayer(player: Point): Point {
  const angle = Math.PI / 4
  return {
    x: player.x + BALL_HOLD_OFFSET * Math.cos(angle),
    y: player.y - BALL_HOLD_OFFSET * Math.sin(angle),
  }
}

export function useCourtInteractions(stageRef: RefObject<Konva.Stage | null>) {
  const [drawing, setDrawing] = useState<Drawing>(null)
  const [selectedElement, setSelectedElement] = useState<SelectedElement>(null)
  const clickHandledRef = useRef(false)

  const players = useCourtStore((s) => s.players)
  const ball = useCourtStore((s) => s.ball)
  const screens = useCourtStore((s) => s.screens)
  const actions = useCourtStore((s) => s.actions)
  const tool = useCourtStore((s) => s.tool)
  const recordMove = useCourtStore((s) => s.recordMove)
  const recordPass = useCourtStore((s) => s.recordPass)
  const moveBallFree = useCourtStore((s) => s.moveBallFree)
  const movePlayerPosition = useCourtStore((s) => s.movePlayerPosition)
  const removePlayerFromCourt = useCourtStore((s) => s.removePlayerFromCourt)
  const removeAction = useCourtStore((s) => s.removeAction)
  const moveScreenPosition = useCourtStore((s) => s.moveScreenPosition)
  const removeScreenToken = useCourtStore((s) => s.removeScreenToken)

  function getLogicalPointer(): Point | null {
    return stageRef.current?.getRelativePointerPosition() ?? null
  }

  function toggleSelect(element: NonNullable<SelectedElement>) {
    setSelectedElement((prev) =>
      prev?.kind === element.kind && prev.id === element.id ? null : element,
    )
  }

  function handlePlayerPointerDown(tokenId: string, e: PointerEventLike) {
    setSelectedElement(null)
    e.cancelBubble = true
    const player = players.find((p) => p.id === tokenId)
    if (!player) return

    if (tool === 'move') {
      setDrawing({ kind: 'reposition', tokenId, current: { x: player.x, y: player.y } })
    } else {
      setDrawing({ kind: 'path', tokenId, points: [player.x, player.y] })
    }
  }

  function handlePlayerClick(tokenId: string) {
    clickHandledRef.current = true
    toggleSelect({ kind: 'player', id: tokenId })
  }

  function handleBallPointerDown(e: PointerEventLike) {
    setSelectedElement(null)
    e.cancelBubble = true
    setDrawing({ kind: 'ball', current: { x: ball.x, y: ball.y } })
  }

  function handleScreenClick(id: string) {
    clickHandledRef.current = true
    toggleSelect({ kind: 'screen', id })
  }

  function handleScreenDragEnd(id: string, x: number, y: number) {
    moveScreenPosition(id, x, y)
  }

  function handleStageMove() {
    if (!drawing) return
    const pos = getLogicalPointer()
    if (!pos) return

    if (drawing.kind === 'path') {
      setDrawing({ ...drawing, points: [...drawing.points, pos.x, pos.y] })
    } else {
      setDrawing({ ...drawing, current: pos })
    }
  }

  function handleStageUp() {
    if (!drawing) return

    if (drawing.kind === 'path') finalizePath(drawing.tokenId, drawing.points)
    else if (drawing.kind === 'reposition') movePlayerPosition(drawing.tokenId, drawing.current.x, drawing.current.y)
    else finalizeBallDrop(drawing.current)

    setDrawing(null)
  }

  function finalizePath(tokenId: string, points: number[]) {
    const startX = points[0]
    const startY = points[1]
    const endX = points[points.length - 2]
    const endY = points[points.length - 1]
    const distance = Math.hypot(endX - startX, endY - startY)
    if (distance >= MIN_MOVE_DISTANCE) recordMove(tokenId, points)
  }

  function finalizeBallDrop(current: Point) {
    const target = players.find((p) => Math.hypot(p.x - current.x, p.y - current.y) <= HIT_RADIUS)
    if (target) recordPass(target.id, offsetFromPlayer(target))
    else moveBallFree(current.x, current.y)
  }

  function handleActionClick(actionId: string) {
    clickHandledRef.current = true
    toggleSelect({ kind: 'action', id: actionId })
  }

  function handleStageClick() {
    if (clickHandledRef.current) {
      clickHandledRef.current = false
      return
    }
    setSelectedElement(null)
  }

  function deleteSelected() {
    if (!selectedElement) return
    if (selectedElement.kind === 'player') removePlayerFromCourt(selectedElement.id)
    else if (selectedElement.kind === 'screen') removeScreenToken(selectedElement.id)
    else removeAction(selectedElement.id)
    setSelectedElement(null)
  }

  const displayPlayers = players.map((p) =>
    drawing?.kind === 'reposition' && drawing.tokenId === p.id
      ? { ...p, x: drawing.current.x, y: drawing.current.y }
      : p,
  )
  const ballDisplay = drawing?.kind === 'ball' ? drawing.current : ball

  return {
    players: displayPlayers,
    screens,
    actions,
    drawing,
    ballDisplay,
    tool,
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
  }
}
