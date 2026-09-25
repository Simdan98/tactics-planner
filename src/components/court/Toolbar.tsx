import { useCourtStore } from '../../store/useCourtStore'
import type { Tool } from '../../store/useCourtStore'

const TOOLS: { id: Tool; label: string; icon: string }[] = [
  { id: 'move', label: 'Move', icon: '✋' },
  { id: 'draw', label: 'Draw', icon: '✏️' },
]

export function Toolbar() {
  const tool = useCourtStore((s) => s.tool)
  const setTool = useCourtStore((s) => s.setTool)
  const captureFrame = useCourtStore((s) => s.captureFrame)
  const clearCourt = useCourtStore((s) => s.clearCourt)

  return (
    <div className="flex shrink-0 items-center gap-1">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTool(t.id)}
          title={t.label}
          className={`flex h-7 w-7 items-center justify-center rounded-md text-sm transition ${
            tool === t.id ? 'bg-accent text-black' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {t.icon}
        </button>
      ))}

      <button
        type="button"
        onClick={captureFrame}
        className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-white hover:bg-secondary-dark"
      >
        +Frame
      </button>

      <button
        type="button"
        onClick={clearCourt}
        title="Clear court"
        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-sm text-white/60 hover:bg-red-600/60 hover:text-white"
      >
        🗑
      </button>
    </div>
  )
}
