import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C'

export interface RosterPlayer {
  id: string
  name: string
  number: number
  position: Position | null
}

interface RosterState {
  players: RosterPlayer[]
  addPlayer: (player: Omit<RosterPlayer, 'id'>) => void
  updatePlayer: (id: string, updates: Partial<Omit<RosterPlayer, 'id'>>) => void
  removePlayer: (id: string) => void
}

export const useRosterStore = create<RosterState>()(
  persist(
    (set) => ({
      players: [],
      addPlayer: (player) =>
        set((state) => ({
          players: [...state.players, { ...player, id: nanoid(8) }],
        })),
      updatePlayer: (id, updates) =>
        set((state) => ({
          players: state.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        })),
    }),
    { name: 'basketball-planner-roster' },
  ),
)
