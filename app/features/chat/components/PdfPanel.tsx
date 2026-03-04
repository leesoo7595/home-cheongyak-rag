'use client'

import dynamic from 'next/dynamic'
import { usePdfPanel } from '@/contexts/usePdfPanel'
import { PdfEmptyUploadPanel } from './PdfUploadPanel'

const PdfViewerPanel = dynamic(
  () => import('./PdfViewerPanel').then((m) => ({ default: m.PdfViewerPanel })),
  { ssr: false },
)

export function PdfPanel() {
  const { url, upload, isPending, page, onPageChange } = usePdfPanel()

  return (
    <div className="flex h-full flex-col border-l ">
      {!url ? (
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <PdfEmptyUploadPanel
            onUpload={(f) => f && upload(f)}
            isPending={isPending}
          />
        </div>
      ) : (
        <PdfViewerPanel url={url} page={page} onPageChange={onPageChange} />
      )}
    </div>
  )
}
