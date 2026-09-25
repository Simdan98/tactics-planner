import { useEffect } from 'react'
import { useCourtStore } from '../store/useCourtStore'
import { clearSharedPlayFromLocation, readSharedPlayFromLocation } from '../utils/shareLink'

export function useSharedPlayLoader() {
  const loadSnapshot = useCourtStore((s) => s.loadSnapshot)

  useEffect(() => {
    const shared = readSharedPlayFromLocation()
    if (!shared) return

    loadSnapshot(shared)
    clearSharedPlayFromLocation()
  }, [loadSnapshot])
}
