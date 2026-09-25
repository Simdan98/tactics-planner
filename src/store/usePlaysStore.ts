import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CourtSnapshot } from './useCourtStore'

export interface SavedPlay extends CourtSnapshot {
  id: string
  name: string
  createdAt: number
}

interface PlaysState {
  plays: SavedPlay[]
  savePlay: (play: Omit<SavedPlay, 'id' | 'createdAt'>) => SavedPlay
  updatePlay: (id: string, updates: Partial<Omit<SavedPlay, 'id'>>) => void
  removePlay: (id: string) => void
  getPlay: (id: string) => SavedPlay | undefined
}

export const usePlaysStore = create<PlaysState>()(
  persist(
    (set, get) => ({
      plays: [],
      savePlay: (play) => {
        const saved: SavedPlay = { ...play, id: nanoid(8), createdAt: Date.now() }
        set((state) => ({ plays: [...state.plays, saved] }))
        return saved
      },
      updatePlay: (id, updates) =>
        set((state) => ({
          plays: state.plays.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      removePlay: (id) => set((state) => ({ plays: state.plays.filter((p) => p.id !== id) })),
      getPlay: (id) => get().plays.find((p) => p.id === id),
    }),
    { name: 'basketball-planner-plays' },
  ),
)
