import { useNavigate } from 'react-router-dom'
import { useCourtStore } from '../../store/useCourtStore'
import { usePlaysStore } from '../../store/usePlaysStore'
import { buildShareUrl } from '../../utils/shareLink'

export function PlaysGrid() {
  const plays = usePlaysStore((s) => s.plays)
  const removePlay = usePlaysStore((s) => s.removePlay)
  const loadSnapshot = useCourtStore((s) => s.loadSnapshot)
  const navigate = useNavigate()

  if (plays.length === 0) {
    return <p className="text-sm text-white/50">No saved plays yet. Create one in the editor and save it.</p>
  }

  function handleOpenClick(playId: string) {
    const play = plays.find((p) => p.id === playId)
    if (!play) return
    loadSnapshot(play)
    navigate('/')
  }

  async function handleShareClick(playId: string) {
    const play = plays.find((p) => p.id === playId)
    if (!play) return
    const url = buildShareUrl(play)
    await navigator.clipboard.writeText(url)
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {plays.map((play) => (
        <div key={play.id} className="flex flex-col gap-2 rounded-lg bg-black/30 p-4">
          <h3 className="font-semibold text-white">{play.name}</h3>
          <p className="text-xs text-white/50">
            {play.players.length} players · {play.frames.length} frames ·{' '}
            {new Date(play.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-auto flex gap-2">
            <button
              type="button"
              onClick={() => handleOpenClick(play.id)}
              className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-black hover:brightness-95"
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => handleShareClick(play.id)}
              className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-white hover:bg-secondary-dark"
            >
              Share
            </button>
            <button
              type="button"
              onClick={() => removePlay(play.id)}
              className="rounded-md bg-red-600/80 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
