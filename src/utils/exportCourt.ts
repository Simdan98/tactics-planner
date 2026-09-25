import type Konva from 'konva'
import jsPDF from 'jspdf'

export function exportStageToPng(stage: Konva.Stage, filename: string) {
  const dataUrl = stage.toDataURL({ pixelRatio: 2 })
  downloadDataUrl(dataUrl, `${filename}.png`)
}

/**
 * Exports one PDF page per captured frame (or a single page of the current
 * canvas state if no frames have been captured). `goToFrame` mutates the
 * store, which re-renders the Stage — a frame is awaited so Konva has
 * repainted before each page is captured.
 */
export async function exportFramesToPdf(
  stage: Konva.Stage,
  frameCount: number,
  goToFrame: (index: number) => void,
  restoreIndex: number,
  filename: string,
) {
  const width = stage.width()
  const height = stage.height()
  const orientation = width >= height ? 'landscape' : 'portrait'
  const pdf = new jsPDF({ orientation, unit: 'px', format: [width, height] })

  const pageCount = Math.max(frameCount, 1)
  for (let i = 0; i < pageCount; i++) {
    if (frameCount > 0) {
      goToFrame(i)
      await waitForRepaint()
    }
    if (i > 0) pdf.addPage([width, height], orientation)
    pdf.addImage(stage.toDataURL({ pixelRatio: 2 }), 'PNG', 0, 0, width, height)
  }

  if (frameCount > 0) goToFrame(restoreIndex)
  pdf.save(`${filename}.pdf`)
}

function waitForRepaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
