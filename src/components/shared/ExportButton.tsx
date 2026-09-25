import type Konva from 'konva'
import type { RefObject } from 'react'
import { useState } from 'react'
import { useCourtStore } from '../../store/useCourtStore'
import { exportFramesToPdf, exportStageToPng } from '../../utils/exportCourt'

interface ExportButtonProps {
  stageRef: RefObject<Konva.Stage | null>
  filename?: string
}

export function ExportButton({ stageRef, filename = 'play' }: ExportButtonProps) {
  const frames = useCourtStore((s) => s.frames)
  const currentFrameIndex = useCourtStore((s) => s.currentFrameIndex)
  const goToFrame = useCourtStore((s) => s.goToFrame)
  const [exportingPdf, setExportingPdf] = useState(false)

  function handlePngButtonClick() {
    const stage = stageRef.current
    if (!stage) return
    exportStageToPng(stage, filename)
  }

  async function handlePdfButtonClick() {
    const stage = stageRef.current
    if (!stage || exportingPdf) return
    setExportingPdf(true)
    try {
      await exportFramesToPdf(stage, frames.length, goToFrame, currentFrameIndex, filename)
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={handlePngButtonClick}
        className="rounded-md bg-white/10 px-1.5 py-1 text-[11px] font-medium text-white hover:bg-white/20"
      >
        PNG
      </button>
      <button
        type="button"
        onClick={handlePdfButtonClick}
        disabled={exportingPdf}
        className="rounded-md bg-white/10 px-1.5 py-1 text-[11px] font-medium text-white hover:bg-white/20 disabled:opacity-50"
      >
        {exportingPdf ? '…' : 'PDF'}
      </button>
    </div>
  )
}
