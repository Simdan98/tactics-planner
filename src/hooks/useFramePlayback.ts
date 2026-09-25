import { useEffect, useRef, useState } from 'react'
import { useCourtStore } from '../store/useCourtStore'

const FRAME_INTERVAL_MS = 800

type PlaybackSpeed = 0.3 | 0.5 | 1 | 2 | 4

export function useFramePlayback() {
  const frames = useCourtStore((s) => s.frames)
  const currentFrameIndex = useCourtStore((s) => s.currentFrameIndex)
  const isPlaying = useCourtStore((s) => s.isPlaying)
  const goToFrame = useCourtStore((s) => s.goToFrame)
  const setIsPlaying = useCourtStore((s) => s.setIsPlaying)
  const removeFrame = useCourtStore((s) => s.removeFrame)
  const clearFrames = useCourtStore((s) => s.clearFrames)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1)

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      const state = useCourtStore.getState()
      const next = state.currentFrameIndex + 1
      if (next >= state.frames.length) {
        setIsPlaying(false)
        return
      }
      goToFrame(next)
    }, FRAME_INTERVAL_MS / playbackSpeed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, playbackSpeed, goToFrame, setIsPlaying])

  function play() {
    if (frames.length === 0) return
    if (currentFrameIndex >= frames.length - 1) goToFrame(0)
    setIsPlaying(true)
  }

  function pause() {
    setIsPlaying(false)
  }

  return {
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
  }
}
