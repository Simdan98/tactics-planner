import { useState } from 'react'
import { useCourtStore } from '../../store/useCourtStore'
import { usePlaysStore } from '../../store/usePlaysStore'

export function SavePlayButton() {
  const savePlay = usePlaysStore((s) => s.savePlay)
  const players = useCourtStore((s) => s.players)
  const ball = useCourtStore((s) => s.ball)
  const screens = useCourtStore((s) => s.screens)
  const actions = useCourtStore((s) => s.actions)
  const frames = useCourtStore((s) => s.frames)
  const [saved, setSaved] = useState(false)

  function handleButtonClick() {
    const name = window.prompt('Name this play', 'Untitled Play')
    if (!name) return
    savePlay({ name, players, ball, screens, actions, frames })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      className="rounded-md bg-accent px-2 py-1 text-[11px] font-semibold text-black hover:brightness-95"
    >
      {saved ? 'Saved!' : '💾 Save'}
    </button>
  )
}
