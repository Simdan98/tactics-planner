import { nanoid } from 'nanoid'
import { create } from 'zustand'
import type {
  BallToken,
  CourtAction,
  CourtPlayerToken,
  CourtSnapshot,
  Frame,
  MoveAction,
  PassAction,
  ScreenToken,
  Tool,
} from './courtTypes'

export type { BallToken, CourtAction, CourtPlayerToken, CourtSnapshot, Frame, ScreenToken, Tool } from './courtTypes'

interface CourtState {
  players: CourtPlayerToken[]
  ball: BallToken
  screens: ScreenToken[]
  actions: CourtAction[]
  tool: Tool
  frames: Frame[]
  currentFrameIndex: number
  isPlaying: boolean

  setTool: (tool: Tool) => void

  addPlayerToCourt: (rosterId: string, name: string, number: number, x: number, y: number) => void
  removePlayerFromCourt: (tokenId: string) => void
  movePlayerPosition: (tokenId: string, x: number, y: number) => void

  recordMove: (tokenId: string, points: number[]) => void
  recordPass: (toTokenId: string, toPoint: { x: number; y: number }) => void
  moveBallFree: (x: number, y: number) => void
  removeAction: (actionId: string) => void

  addScreenAt: (x: number, y: number) => void
  moveScreenPosition: (id: string, x: number, y: number) => void
  removeScreenToken: (id: string) => void

  captureFrame: () => void
  goToFrame: (index: number) => void
  setIsPlaying: (playing: boolean) => void
  removeFrame: (index: number) => void
  clearFrames: () => void

  clearCourt: () => void
  loadSnapshot: (snapshot: CourtSnapshot) => void
}

const initialBall: BallToken = { x: 300, y: 300, holderTokenId: null }

export const useCourtStore = create<CourtState>()((set) => ({
  players: [],
  ball: initialBall,
  screens: [],
  actions: [],
  tool: 'move',
  frames: [],
  currentFrameIndex: -1,
  isPlaying: false,

  setTool: (tool) => set({ tool }),

  addPlayerToCourt: (rosterId, name, number, x, y) =>
    set((state) => ({
      players: [...state.players, { id: nanoid(8), rosterId, name, number, x, y }],
    })),

  removePlayerFromCourt: (tokenId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== tokenId),
      actions: state.actions.filter(
        (a) =>
          !(
            (a.type === 'move' && a.playerTokenId === tokenId) ||
            (a.type === 'pass' && (a.fromTokenId === tokenId || a.toTokenId === tokenId))
          ),
      ),
    })),

  movePlayerPosition: (tokenId, x, y) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === tokenId ? { ...p, x, y } : p)),
    })),

  recordMove: (tokenId, points) =>
    set((state) => {
      const action: MoveAction = { id: nanoid(8), type: 'move', playerTokenId: tokenId, points }
      return { actions: [...state.actions, action] }
    }),

  recordPass: (toTokenId, toPoint) =>
    set((state) => {
      const fromTokenId = state.ball.holderTokenId
      const fromPoint = { x: state.ball.x, y: state.ball.y }

      const action: PassAction = {
        id: nanoid(8),
        type: 'pass',
        fromTokenId: fromTokenId ?? null,
        toTokenId,
        fromPoint,
        toPoint,
      }

      return {
        actions: [...state.actions, action],
        ball: { x: toPoint.x, y: toPoint.y, holderTokenId: toTokenId },
      }
    }),

  moveBallFree: (x, y) => set((state) => ({ ball: { ...state.ball, x, y } })),

  removeAction: (actionId) =>
    set((state) => ({ actions: state.actions.filter((a) => a.id !== actionId) })),

  addScreenAt: (x, y) =>
    set((state) => ({ screens: [...state.screens, { id: nanoid(8), x, y }] })),

  moveScreenPosition: (id, x, y) =>
    set((state) => ({
      screens: state.screens.map((s) => (s.id === id ? { ...s, x, y } : s)),
    })),

  removeScreenToken: (id) =>
    set((state) => ({ screens: state.screens.filter((s) => s.id !== id) })),

  captureFrame: () =>
    set((state) => {
      const frame: Frame = {
        id: nanoid(8),
        players: state.players.map((p) => ({ ...p })),
        ball: { ...state.ball },
        screens: state.screens.map((s) => ({ ...s })),
        actions: state.actions.map((a) => ({ ...a })),
      }
      const frames = [...state.frames, frame]
      return { frames, currentFrameIndex: frames.length - 1 }
    }),

  goToFrame: (index) =>
    set((state) => {
      const frame = state.frames[index]
      if (!frame) return state
      return {
        currentFrameIndex: index,
        players: frame.players.map((p) => ({ ...p })),
        ball: { ...frame.ball },
        screens: frame.screens.map((s) => ({ ...s })),
        actions: frame.actions.map((a) => ({ ...a })),
      }
    }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  removeFrame: (index) =>
    set((state) => {
      const newFrames = state.frames.filter((_, i) => i !== index)
      if (newFrames.length === 0) {
        return { frames: [], currentFrameIndex: -1, isPlaying: false }
      }

      let nextIndex: number
      if (index < state.currentFrameIndex) {
        nextIndex = state.currentFrameIndex - 1
      } else if (index === state.currentFrameIndex) {
        nextIndex = Math.min(index, newFrames.length - 1)
      } else {
        nextIndex = state.currentFrameIndex
      }

      const frame = newFrames[nextIndex]
      return {
        frames: newFrames,
        currentFrameIndex: nextIndex,
        isPlaying: false,
        players: frame.players.map((p) => ({ ...p })),
        ball: { ...frame.ball },
        screens: frame.screens.map((s) => ({ ...s })),
        actions: frame.actions.map((a) => ({ ...a })),
      }
    }),

  clearFrames: () => set({ frames: [], currentFrameIndex: -1, isPlaying: false }),

  clearCourt: () =>
    set({
      players: [],
      ball: initialBall,
      screens: [],
      actions: [],
      frames: [],
      currentFrameIndex: -1,
    }),

  loadSnapshot: (snapshot) =>
    set({
      players: snapshot.players,
      ball: snapshot.ball,
      screens: snapshot.screens,
      actions: snapshot.actions,
      frames: snapshot.frames,
      currentFrameIndex: snapshot.frames.length > 0 ? 0 : -1,
    }),
}))
