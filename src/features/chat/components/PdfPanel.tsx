import { usePdfPanel } from '@/contexts/usePdfPanel'
import { PdfEmptyUploadPanel } from './PdfUploadPanel'
import { PdfViewerPanel } from './PdfViewerPanel'

export function PdfPanel() {
  const { file, setFile } = usePdfPanel()

  return (
    <div className="flex h-full flex-col border-l ">
      {!file ? (
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <PdfEmptyUploadPanel onFileSelected={setFile} />
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          <PdfViewerPanel file={file} />
        </div>
      )}
    </div>
  )
}
