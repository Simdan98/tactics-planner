import { useFramePlayback } from '../../hooks/useFramePlayback'
import { Panel } from '../shared/Panel'

const SPEED_OPTIONS = [0.3, 0.5, 1, 2, 4] as const

export function AnimationControls() {
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

  if (frames.length === 0) {
    return (
      <Panel className="text-sm text-white/60">
        No frames yet — set up a position and click "Capture Frame" to start building an animation.
      </Panel>
    )
  }

  return (
    <Panel className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={isPlaying ? pause : play}
          className="rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-black hover:brightness-95"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span className="text-sm text-white/70">
          Frame {currentFrameIndex + 1} / {frames.length}
        </span>
        <button
          type="button"
          onClick={() => removeFrame(currentFrameIndex)}
          disabled={currentFrameIndex === -1}
          className="rounded-md px-2 py-1 text-sm text-white/50 hover:bg-white/10 hover:text-white/80 disabled:opacity-30 disabled:pointer-events-none"
          title="Delete current frame"
        >
          ✕
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={frames.length - 1}
        value={Math.max(currentFrameIndex, 0)}
        onChange={(e) => goToFrame(Number(e.target.value))}
        className="w-full"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-white/50">Speed</span>
          {SPEED_OPTIONS.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => setPlaybackSpeed(speed)}
              className={
                speed === playbackSpeed
                  ? 'rounded px-2 py-0.5 text-xs font-semibold bg-accent text-black'
                  : 'rounded px-2 py-0.5 text-xs bg-white/10 text-white/70 hover:bg-white/20'
              }
            >
              {speed}×
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => removeFrame(frames.length - 1)}
            className="text-xs text-white/50 hover:text-white/80"
          >
            Undo last frame
          </button>
          <button
            type="button"
            onClick={clearFrames}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Clear all frames
          </button>
        </div>
      </div>
    </Panel>
  )
}
