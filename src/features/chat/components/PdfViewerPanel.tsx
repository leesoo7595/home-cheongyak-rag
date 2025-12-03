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

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex flex-1 justify-center overflow-auto">
        <div className="w-full max-w-[720px]">
          <Document
            key={url} // 🔥 url 변경 시 새로 마운트
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => {
              console.error('PDF load error', err)
            }}
            loading={
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                PDF 로딩 중...
              </div>
            }
          >
            <Page
              pageNumber={1}
              width={720}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>

      {numPages && (
        <p className="mt-1 text-xs text-muted-foreground">
          전체 페이지: {numPages}p
        </p>
      )}
    </div>
  )
}
