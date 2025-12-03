import { usePdfPanel } from '@/contexts/usePdfPanel'
import { PdfEmptyUploadPanel } from './PdfUploadPanel'
import { PdfViewerPanel } from './PdfViewerPanel'

export function PdfPanel() {
  const { url, upload, isPending } = usePdfPanel()

  return (
    <div className="flex h-full flex-col border-l ">
      {!url ? (
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <PdfEmptyUploadPanel onUpload={(f) => f && upload(f)} isPending={isPending} />
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          <PdfViewerPanel url={url} />
        </div>
      )}
    </div>
  )
}
