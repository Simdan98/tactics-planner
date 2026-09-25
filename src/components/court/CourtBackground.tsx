import { Circle, Group, Line, Rect, Text } from 'react-konva'
import { COURT_HEIGHT, COURT_WIDTH, ZALGIRIS } from '../../theme'

const LINE_WIDTH = 3
const MARGIN = 16

export function CourtBackground() {
  const innerW = COURT_WIDTH - MARGIN * 2
  const innerH = COURT_HEIGHT - MARGIN * 2
  const centerX = COURT_WIDTH / 2
  const baselineY = MARGIN
  const halfCourtY = COURT_HEIGHT - MARGIN

  const keyWidth = innerW * 0.32
  const keyDepth = innerH * 0.31
  const rimY = baselineY + 24
  const threePtRadius = 250
  const halfCircleRadius = innerH * 0.09
  const restrictedRadius = 25

  const threePtStartDeg = 14
  const threePtEndDeg = 166
  const threePtStartRad = (threePtStartDeg * Math.PI) / 180
  const threePtEndRad = (threePtEndDeg * Math.PI) / 180
  const threePtRightX = centerX + threePtRadius * Math.cos(threePtStartRad)
  const threePtRightY = rimY + threePtRadius * Math.sin(threePtStartRad)
  const threePtLeftX = centerX + threePtRadius * Math.cos(threePtEndRad)
  const threePtLeftY = rimY + threePtRadius * Math.sin(threePtEndRad)

  return (
    <Group>
      {/* Floor */}
      <Rect x={0} y={0} width={COURT_WIDTH} height={COURT_HEIGHT} fill={ZALGIRIS.greenDark} />

      {/* Watermark */}
      <Text
        text="ŽALGIRIS"
        x={0}
        y={COURT_HEIGHT * 0.62}
        width={COURT_WIDTH}
        align="center"
        fontSize={48}
        fontStyle="bold"
        fill={ZALGIRIS.green}
        opacity={0.15}
        letterSpacing={6}
      />

      {/* Court boundary (sidelines, baseline, half-court line) */}
      <Rect
        x={MARGIN}
        y={MARGIN}
        width={innerW}
        height={innerH}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH}
        cornerRadius={4}
      />

      {/* Half-court circle marking */}
      <Line
        points={arcPoints(centerX, halfCourtY, halfCircleRadius, 180, 360)}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH}
        tension={0.4}
        lineCap="round"
      />

      {/* Key / paint area */}
      <Rect
        x={centerX - keyWidth / 2}
        y={baselineY}
        width={keyWidth}
        height={keyDepth}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH}
      />

      {/* Free-throw circle */}
      <Circle
        x={centerX}
        y={baselineY + keyDepth}
        radius={keyWidth * 0.32}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH}
      />

      {/* Backboard + rim */}
      <Line
        points={[centerX - 30, baselineY + 8, centerX + 30, baselineY + 8]}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH}
      />
      <Circle x={centerX} y={rimY} radius={5} fill={ZALGIRIS.courtLine} />

      {/* Restricted area arc */}
      <Line
        points={arcPoints(centerX, rimY, restrictedRadius, 0, 180)}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH * 0.7}
        tension={0.4}
        lineCap="round"
        opacity={0.5}
      />

      {/* Three-point line: left corner segment */}
      <Line
        points={[threePtLeftX, baselineY, threePtLeftX, threePtLeftY]}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH}
        lineCap="round"
      />

      {/* Three-point arc */}
      <Line
        points={arcPoints(centerX, rimY, threePtRadius, threePtStartDeg, threePtEndDeg)}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH}
        tension={0.4}
        lineCap="round"
      />

      {/* Three-point line: right corner segment */}
      <Line
        points={[threePtRightX, baselineY, threePtRightX, threePtRightY]}
        stroke={ZALGIRIS.courtLine}
        strokeWidth={LINE_WIDTH}
        lineCap="round"
      />
    </Group>
  )
}

function arcPoints(cx: number, cy: number, radius: number, startDeg: number, endDeg: number, steps = 32) {
  const points: number[] = []
  for (let i = 0; i <= steps; i++) {
    const deg = startDeg + ((endDeg - startDeg) * i) / steps
    const rad = (deg * Math.PI) / 180
    points.push(cx + radius * Math.cos(rad), cy + radius * Math.sin(rad))
  }
  return points
}
