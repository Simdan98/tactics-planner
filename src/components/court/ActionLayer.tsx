import { Arrow, Group, Label, Tag, Text } from 'react-konva'
import type { CourtAction } from '../../store/useCourtStore'
import { ZALGIRIS } from '../../theme'

interface ActionLayerProps {
  actions: CourtAction[]
  selectedActionId: string | null
  onActionClick: (actionId: string) => void
}

export function ActionLayer({ actions, selectedActionId, onActionClick }: ActionLayerProps) {
  let moveCount = 0
  let passCount = 0

  return (
    <Group>
      {actions.map((action) => {
        const order = action.type === 'move' ? ++moveCount : ++passCount
        const isSelected = action.id === selectedActionId

        if (action.type === 'move') {
          const midIndex = Math.floor(action.points.length / 4) * 2
          const midX = action.points[midIndex] ?? action.points[0]
          const midY = action.points[midIndex + 1] ?? action.points[1]
          return (
            <Group key={action.id} onClick={() => onActionClick(action.id)} onTap={() => onActionClick(action.id)}>
              <Arrow
                points={action.points}
                stroke={ZALGIRIS.moveRed}
                fill={ZALGIRIS.moveRed}
                strokeWidth={isSelected ? 5 : 3}
                pointerLength={10}
                pointerWidth={10}
                tension={0.3}
                lineCap="round"
                hitStrokeWidth={16}
                opacity={isSelected ? 1 : 0.85}
              />
              <OrderBadge x={midX} y={midY} order={order} color={ZALGIRIS.moveRed} />
            </Group>
          )
        }

        const midX = (action.fromPoint.x + action.toPoint.x) / 2
        const midY = (action.fromPoint.y + action.toPoint.y) / 2
        return (
          <Group key={action.id} onClick={() => onActionClick(action.id)} onTap={() => onActionClick(action.id)}>
            <Arrow
              points={[action.fromPoint.x, action.fromPoint.y, action.toPoint.x, action.toPoint.y]}
              stroke={ZALGIRIS.passOrange}
              fill={ZALGIRIS.passOrange}
              strokeWidth={isSelected ? 5 : 3}
              dash={[10, 6]}
              pointerLength={10}
              pointerWidth={10}
              hitStrokeWidth={16}
              opacity={isSelected ? 1 : 0.85}
            />
            <OrderBadge x={midX} y={midY} order={order} color={ZALGIRIS.passOrange} />
          </Group>
        )
      })}
    </Group>
  )
}

interface OrderBadgeProps {
  x: number
  y: number
  order: number
  color: string
}

function OrderBadge({ x, y, order, color }: OrderBadgeProps) {
  return (
    <Label x={x} y={y} offsetX={9} offsetY={9}>
      <Tag fill={color} cornerRadius={9} />
      <Text text={String(order)} fontSize={12} fontStyle="bold" fill={ZALGIRIS.badgeText} padding={4} />
    </Label>
  )
}
