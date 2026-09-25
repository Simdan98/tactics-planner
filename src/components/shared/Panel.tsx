import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  className?: string
}

export function Panel({ children, className = '' }: PanelProps) {
  return <div className={`rounded-lg bg-black/30 p-3 ${className}`}>{children}</div>
}
