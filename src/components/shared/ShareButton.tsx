import { useState } from 'react'
import { useCourtStore } from '../../store/useCourtStore'
import { buildShareUrl } from '../../utils/shareLink'

export function ShareButton() {
  const players = useCourtStore((s) => s.players)
  const ball = useCourtStore((s) => s.ball)
  const screens = useCourtStore((s) => s.screens)
  const actions = useCourtStore((s) => s.actions)
  const frames = useCourtStore((s) => s.frames)
  const [copied, setCopied] = useState(false)

  async function handleButtonClick() {
    const url = buildShareUrl({ name: 'Shared Play', players, ball, screens, actions, frames })
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-white hover:bg-secondary-dark"
    >
      {copied ? 'Copied!' : '↗ Share'}
    </button>
  )
}
