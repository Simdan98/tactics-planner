import { useRosterStore } from '../../store/useRosterStore'

export function PlayerList() {
  const players = useRosterStore((s) => s.players)
  const removePlayer = useRosterStore((s) => s.removePlayer)

  if (players.length === 0) {
    return <p className="text-sm text-white/50">No players yet. Add your roster above.</p>
  }

  return (
    <ul className="flex flex-col gap-1">
      {players.map((p) => (
        <li
          key={p.id}
          className="flex items-center justify-between rounded-md bg-black/30 px-3 py-2 text-sm text-white"
        >
          <span>
            <span className="mr-2 font-mono text-accent">#{p.number}</span>
            {p.name || <span className="text-white/40">Unnamed</span>}
            {p.position && <span className="ml-2 text-white/50">({p.position})</span>}
          </span>
          <button
            type="button"
            onClick={() => removePlayer(p.id)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
