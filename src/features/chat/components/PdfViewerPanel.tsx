import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// worker 설정 (Vite)
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

interface PdfViewerPanelProps {
  url: string | null
}

export function PdfViewerPanel({ url }: PdfViewerPanelProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center justify-between border-b px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1 disabled:opacity-50"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            Prev
          </button>
          <button
            className="rounded border px-2 py-1 disabled:opacity-50"
            onClick={() => setPageNumber((p) => Math.min(numPages ?? 1, p + 1))}
            disabled={!numPages || pageNumber >= numPages}
          >
            Next
          </button>
        </div>

        {/* 현재 페이지 / 전체 페이지 */}
        <div>
          {numPages ? (
            <>Page {pageNumber} / {numPages}</>
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
                key={pageNumber} // 페이지 전환 시 Page만 바뀜
                pageNumber={pageNumber}
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
