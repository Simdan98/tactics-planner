import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Position } from '../../store/useRosterStore'
import { useRosterStore } from '../../store/useRosterStore'

const POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']

export function PlayerForm() {
  const addPlayer = useRosterStore((s) => s.addPlayer)
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [position, setPosition] = useState<Position | ''>('')

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const parsedNumber = Number(number)
    if (Number.isNaN(parsedNumber) || parsedNumber < 0 || parsedNumber > 99) return

    addPlayer({ name: name.trim(), number: parsedNumber, position: position || null })
    setName('')
    setNumber('')
    setPosition('')
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-wrap items-end gap-2 rounded-lg bg-black/30 p-3">
      <div className="flex flex-col">
        <label className="text-xs text-white/60">#</label>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          type="number"
          min={0}
          max={99}
          className="w-16 rounded-md bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-white/60">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-accent"
          placeholder="Jonas Valančiūnas"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-white/60">Position</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value as Position | '')}
          className="rounded-md bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="" className="bg-surface">—</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p} className="bg-surface">
              {p}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-black hover:brightness-95"
      >
        Add Player
      </button>
    </form>
  )
}
