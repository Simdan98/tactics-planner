export interface CourtPlayerToken {
  id: string
  rosterId: string
  name: string
  number: number
  x: number
  y: number
}

export interface BallToken {
  x: number
  y: number
  holderTokenId: string | null
}

export interface ScreenToken {
  id: string
  x: number
  y: number
}

export interface MoveAction {
  id: string
  type: 'move'
  playerTokenId: string
  points: number[]
}

export interface PassAction {
  id: string
  type: 'pass'
  fromTokenId: string | null
  toTokenId: string
  fromPoint: { x: number; y: number }
  toPoint: { x: number; y: number }
}

export type CourtAction = MoveAction | PassAction

export type Tool = 'move' | 'draw'

export interface Frame {
  id: string
  players: CourtPlayerToken[]
  ball: BallToken
  screens: ScreenToken[]
  actions: CourtAction[]
}

export interface CourtSnapshot {
  players: CourtPlayerToken[]
  ball: BallToken
  screens: ScreenToken[]
  actions: CourtAction[]
  frames: Frame[]
}
