interface PdfViewerPanelProps {
  file: File | null
}

export function PdfViewerPanel({ file }: PdfViewerPanelProps) {
  if (!file) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground border rounded-md">
        PDF 파일을 업로드하면 여기에 미리보기가 표시됩니다.
      </div>
    )
  }

  return (
    <div>
      {/* 나중에 실제 PDF 내용을 넣을 자리 */}
      <p className="mb-2 text-sm text-muted-foreground">{file.name}</p>
    </div>
  )
}
