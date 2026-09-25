import { Circle, Group, Text } from 'react-konva'

interface DeleteButtonProps {
  x: number
  y: number
  onDelete: () => void
}

const VISIBLE_RADIUS = 14
const HIT_RADIUS = 22

export function DeleteButton({ x, y, onDelete }: DeleteButtonProps) {
  return (
    <Group x={x} y={y} onClick={onDelete} onTap={onDelete}>
      <Circle radius={HIT_RADIUS} fill="transparent" />
      <Circle radius={VISIBLE_RADIUS} fill="#dc2626" stroke="#fff" strokeWidth={1.5} />
      <Text
        text="✕"
        fontSize={14}
        fontStyle="bold"
        fill="#fff"
        width={VISIBLE_RADIUS * 2}
        height={VISIBLE_RADIUS * 2}
        offsetX={VISIBLE_RADIUS}
        offsetY={VISIBLE_RADIUS}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  )
}
