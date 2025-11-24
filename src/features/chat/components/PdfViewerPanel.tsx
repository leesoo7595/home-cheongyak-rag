interface PdfViewerPanelProps {
  src: string | null
  fileName?: string | null
}

export function PdfViewerPanel({ src, fileName }: PdfViewerPanelProps) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      {fileName && (
        <div className="mb-2 text-sm text-muted-foreground">{fileName}</div>
      )}

      {/* 여기부터가 실제 PDF "페이지" 영역 */}
      <div className="flex flex-1 justify-center overflow-auto">
        {/* 한 장짜리 페이지 카드 느낌 컨테이너 */}
        <div className="my-4 w-full max-w-[720px]">
          {/* A4 비율(대략 1 : 1.414) 유지용 래퍼 */}
          <div className="relative w-full pt-[141.4%] rounded-md border bg-background shadow-sm">
            <iframe
              src={src ?? undefined}
              title={fileName ?? 'PDF preview'}
              className="absolute inset-0 h-full w-full rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
