export const ZALGIRIS = {
  green: '#007A33',
  greenDark: '#00591F',
  gold: '#FDB913',
  white: '#FFFFFF',
  courtLine: '#FFFFFF',
  moveRed: '#E4002B',
  passOrange: '#FF6B00',
  screenRed: '#D91E36',
  ball: '#E8792C',
  ballStroke: '#2A1A0D',
  badgeText: '#111111',
} as const

// Logical coordinate system for court content (player/ball/screen positions,
// arrow points, saved play data). The Court component measures its container
// and scales a Konva Stage to fit any screen size — these are NOT rendered
// pixel dimensions, just the fixed internal grid everything is stored in.
// This is a half-court (basket at the top, half-court line at the bottom).
export const COURT_WIDTH = 600
export const COURT_HEIGHT = 640
