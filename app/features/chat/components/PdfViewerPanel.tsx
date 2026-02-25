'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerPanelProps {
  url: string | null
  page: number
  onPageChange: (page: number) => void
}

export function PdfViewerPanel({
  url,
  page,
  onPageChange,
}: PdfViewerPanelProps) {
  const [numPages, setNumPages] = useState<number | null>(null)

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center justify-between border-b px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1 disabled:opacity-50"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <button
            className="rounded border px-2 py-1 disabled:opacity-50"
            onClick={() => onPageChange(Math.min(numPages ?? 1, page + 1))}
            disabled={!numPages || page >= numPages}
          >
            Next
          </button>
        </div>

        {/* 현재 페이지 / 전체 페이지 */}
        <div>
          {numPages ? (
            <>
              Page {page} / {numPages}
            </>
          ) : (
            'Loading...'
          )}
        </div>
      </div>

      {/* PDF 페이지 렌더 */}
      <div className="flex flex-1 justify-center overflow-auto">
        <div className="w-full max-w-[720px]">
          <Document
            key={url} // url 바뀌면 Document 리셋
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => console.error('PDF load error', err)}
            loading={
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                PDF 로딩 중...
              </div>
            }
          >
            {numPages && (
              <Page
                key={page} // 페이지 전환 시 Page만 바뀜
                pageNumber={page}
                width={720}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            )}
          </Document>
        </div>
      </div>
    </div>
  )
}
