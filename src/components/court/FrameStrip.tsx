import { useFramePlayback } from '../../hooks/useFramePlayback'

const SPEED_OPTIONS = [0.3, 0.5, 1, 2, 4] as const

export function FrameStrip() {
  const {
    frames,
    currentFrameIndex,
    isPlaying,
    play,
    pause,
    goToFrame,
    playbackSpeed,
    setPlaybackSpeed,
    removeFrame,
    clearFrames,
  } = useFramePlayback()

  function handleCycleSpeed() {
    const idx = SPEED_OPTIONS.indexOf(playbackSpeed)
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length]
    setPlaybackSpeed(next)
  }

  if (frames.length === 0) {
    return (
      <div className="shrink-0 border-t border-white/8 bg-black/40 px-3 py-2 text-xs text-white/40">
        No frames yet — capture a frame to start building an animation.
      </div>
    )
  }

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-white/8 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
      <button
        type="button"
        onClick={isPlaying ? pause : play}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-black"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      <input
        type="range"
        min={0}
        max={frames.length - 1}
        value={Math.max(currentFrameIndex, 0)}
        onChange={(e) => goToFrame(Number(e.target.value))}
        className="hidden min-w-0 flex-1 sm:block"
        style={{ accentColor: 'var(--color-accent)' }}
      />

      {/* Dot indicators on small screens, hidden when range slider shows */}
      <div className="flex gap-1 sm:hidden">
        {frames.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToFrame(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === currentFrameIndex ? 'bg-accent' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <span className="shrink-0 text-[11px] text-white/50">
        {currentFrameIndex + 1}/{frames.length}
      </span>

      {/* Speed: cycle button on small screens, full button row on sm+ */}
      <button
        type="button"
        onClick={handleCycleSpeed}
        className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-black sm:hidden"
        title="Tap to change speed"
      >
        {playbackSpeed}×
      </button>

      <div className="ml-auto hidden items-center gap-1 sm:flex">
        {SPEED_OPTIONS.map((speed) => (
          <button
            key={speed}
            type="button"
            onClick={() => setPlaybackSpeed(speed)}
            className={`rounded px-1.5 py-0.5 text-[10px] ${
              speed === playbackSpeed
                ? 'bg-accent font-semibold text-black'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
          >
            {speed}×
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => removeFrame(currentFrameIndex)}
        disabled={currentFrameIndex === -1}
        className="shrink-0 text-[11px] text-white/40 hover:text-red-400 disabled:pointer-events-none disabled:opacity-30"
        title="Delete current frame"
      >
        ✕
      </button>

      <button
        type="button"
        onClick={clearFrames}
        className="hidden shrink-0 text-[11px] text-red-400/70 hover:text-red-300 sm:block"
      >
        Clear all
      </button>
    </div>
  )
}
