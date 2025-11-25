import { PdfEmptyUploadPanel } from '@/features/chat/components/PdfUploadPanel'
import { PdfViewerPanel } from '@/features/chat/components/PdfViewerPanel'
import { NewChatView } from '@/features/chat/views/NewChatView'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const handleFileSelected = (file: File | null) => {
    setPdfFile(file)
  }

  return (
    <>
      <NewChatView disabled={!pdfFile} />
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
    </>
  )
}
