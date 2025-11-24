import { FileText } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface PdfEmptyUploadProps {
  onFileSelected?: (file: File | null) => void
}

export function PdfEmptyUpload({ onFileSelected }: PdfEmptyUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const validatePdf = (file: File | null): File | null => {
    if (!file) return null

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf')

    if (!isPdf) {
      setError('PDF 파일만 업로드할 수 있어요.')
      return null
    }

    setError(null)
    return file
  }

  const handleFile = (file: File | null) => {
    const validFile = validatePdf(file)
    if (!validFile) return

    setFileName(validFile.name)
    onFileSelected?.(validFile)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] ?? null
    handleFile(file)
  }

  return (
    <Empty
      className={`border border-dashed transition-colors ${
        isDragging ? 'border-primary bg-muted/40' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>아직 업로드된 청약 공고문이 없어요</EmptyTitle>
        <EmptyDescription>
          여기에 PDF 파일을 드래그하거나, 버튼을 눌러 업로드할 수 있어요.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleChange}
        />

        <Button variant="outline" size="sm" onClick={handleButtonClick}>
          Upload PDF
        </Button>

        {fileName && (
          <p className="mt-2 text-xs text-muted-foreground">{fileName}</p>
        )}
      </EmptyContent>
    </Empty>
  )
}
