import { Circle, Group, Line } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { ZALGIRIS } from '../../theme'

export const BALL_RADIUS = 11

interface BallTokenProps {
  x: number
  y: number
  onPointerDown: (e: KonvaEventObject<PointerEvent | MouseEvent | TouchEvent>) => void
}

export function BallToken({ x, y, onPointerDown }: BallTokenProps) {
  const r = BALL_RADIUS
  return (
    <Group x={x} y={y} onMouseDown={onPointerDown} onTouchStart={onPointerDown}>
      <Circle radius={r} fill={ZALGIRIS.ball} stroke={ZALGIRIS.ballStroke} strokeWidth={1.25} />
      <Line points={[-r, 0, r, 0]} stroke={ZALGIRIS.ballStroke} strokeWidth={1} />
      <Line points={[0, -r * 0.92, -r * 0.58, 0, 0, r * 0.92]} stroke={ZALGIRIS.ballStroke} strokeWidth={1} tension={0.6} />
      <Line points={[0, -r * 0.92, r * 0.58, 0, 0, r * 0.92]} stroke={ZALGIRIS.ballStroke} strokeWidth={1} tension={0.6} />
    </Group>
  )
}
