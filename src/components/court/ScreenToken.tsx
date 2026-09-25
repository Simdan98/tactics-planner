import { Circle, Group, Text } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { ZALGIRIS } from '../../theme'

export const SCREEN_RADIUS = 11

interface ScreenTokenProps {
  x: number
  y: number
  draggable: boolean
  selected?: boolean
  onDragEnd: (x: number, y: number) => void
  onClick: () => void
}

export function ScreenToken({ x, y, draggable, selected = false, onDragEnd, onClick }: ScreenTokenProps) {
  function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    onDragEnd(e.target.x(), e.target.y())
  }

  return (
    <Group x={x} y={y} draggable={draggable} onDragEnd={handleDragEnd} onClick={onClick} onTap={onClick}>
      {selected && (
        <Circle radius={SCREEN_RADIUS + 5} stroke={ZALGIRIS.white} strokeWidth={2} dash={[4, 3]} />
      )}
      <Circle radius={SCREEN_RADIUS} fill={ZALGIRIS.screenRed} stroke={ZALGIRIS.white} strokeWidth={1.5} />
      <Text
        text="S"
        fontSize={12}
        fontStyle="bold"
        fill={ZALGIRIS.white}
        width={SCREEN_RADIUS * 2}
        height={SCREEN_RADIUS * 2}
        offsetX={SCREEN_RADIUS}
        offsetY={SCREEN_RADIUS}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  )
}
