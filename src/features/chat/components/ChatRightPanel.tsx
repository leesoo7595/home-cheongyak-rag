import { useState } from 'react'
import { PdfEmptyUploadPanel } from './PdfUploadPanel'
import { PdfViewerPanel } from './PdfViewerPanel'

export function ChatRightPanel() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const handleFileSelected = (file: File | null) => {
    setPdfFile(file)
  }

  return (
    <div className="flex h-full flex-col border-l ">
      {!pdfFile ? (
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <PdfEmptyUploadPanel onFileSelected={handleFileSelected} />
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          <PdfViewerPanel file={pdfFile} />
        </div>
      )}
    </div>
  )
}
