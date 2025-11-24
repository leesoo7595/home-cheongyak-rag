import { useRef, useState } from 'react'
import { PdfEmptyUploadPanel } from './PdfUploadPanel'
import { PdfViewerPanel } from './PdfViewerPanel'

export function ChatRightPanel() {
  const [pdfSrc, setPdfSrc] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)

  const lastUrlRef = useRef<string | null>(null)

  const handleFileSelected = (file: File | null) => {
    if (lastUrlRef.current) {
      URL.revokeObjectURL(lastUrlRef.current)
      lastUrlRef.current = null
    }

    if (!file) {
      setPdfSrc(null)
      setPdfName(null)
      return
    }

    const nextUrl = URL.createObjectURL(file)
    lastUrlRef.current = nextUrl

    setPdfSrc(nextUrl)
    setPdfName(file.name)
  }
  return (
    <div className="flex h-full flex-col border-l ">
      {!pdfSrc ? (
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <PdfEmptyUploadPanel onFileSelected={handleFileSelected} />
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          <PdfViewerPanel src={pdfSrc} fileName={pdfName} />
        </div>
      )}
    </div>
  )
}
