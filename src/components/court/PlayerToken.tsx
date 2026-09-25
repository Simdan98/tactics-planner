import { Circle, Group, Text } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { ZALGIRIS } from '../../theme'

export const PLAYER_RADIUS = 16

interface PlayerTokenProps {
  x: number
  y: number
  number: number
  selected?: boolean
  onPointerDown: (e: KonvaEventObject<PointerEvent | MouseEvent | TouchEvent>) => void
  onClick: () => void
}

export function PlayerToken({ x, y, number, selected = false, onPointerDown, onClick }: PlayerTokenProps) {
  return (
    <Group x={x} y={y} onMouseDown={onPointerDown} onTouchStart={onPointerDown} onClick={onClick} onTap={onClick}>
      {selected && (
        <Circle radius={PLAYER_RADIUS + 5} stroke={ZALGIRIS.gold} strokeWidth={2} dash={[4, 3]} />
      )}
      <Circle radius={PLAYER_RADIUS} fill={ZALGIRIS.white} stroke={ZALGIRIS.gold} strokeWidth={2.5} />
      <Text
        text={String(number)}
        fontSize={12}
        fontStyle="bold"
        fill={ZALGIRIS.greenDark}
        width={PLAYER_RADIUS * 2}
        height={PLAYER_RADIUS * 2}
        offsetX={PLAYER_RADIUS}
        offsetY={PLAYER_RADIUS}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  )
}
