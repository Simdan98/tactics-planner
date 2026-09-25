import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { CourtSnapshot } from '../store/useCourtStore'

export interface SharedPlayPayload extends CourtSnapshot {
  name: string
}

const HASH_PREFIX = '#play='

export function buildShareUrl(payload: SharedPlayPayload): string {
  const encoded = compressToEncodedURIComponent(JSON.stringify(payload))
  const url = new URL('/', window.location.href)
  url.hash = `play=${encoded}`
  return url.toString()
}

export function readSharedPlayFromLocation(): SharedPlayPayload | null {
  const { hash } = window.location
  if (!hash.startsWith(HASH_PREFIX)) return null

  try {
    const encoded = hash.slice(HASH_PREFIX.length)
    const json = decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    return JSON.parse(json) as SharedPlayPayload
  } catch {
    return null
  }
}

export function clearSharedPlayFromLocation() {
  const url = new URL(window.location.href)
  url.hash = ''
  window.history.replaceState(null, '', url.toString())
}
