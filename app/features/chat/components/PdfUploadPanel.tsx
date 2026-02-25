'use client'

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

interface PdfEmptyUploadPanelProps {
  onUpload?: (file: File | null) => void
  isPending: boolean
}

export function PdfEmptyUploadPanel({
  onUpload,
  isPending,
}: PdfEmptyUploadPanelProps) {
  const [file, setFile] = useState<File | null>(null)
  const [, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const validatePdf = (f: File | null): File | null => {
    if (!f) return null

    const isPdf =
      f.type === 'application/pdf' ||
      f.name.toLowerCase().endsWith('.pdf')

    if (!isPdf) {
      setError('PDF 파일만 업로드할 수 있어요.')
      return null
    }

    setError(null)
    return f
  }

  const handleFile = (f: File | null) => {
    const validFile = validatePdf(f)
    if (!validFile) return
    setFile(f)

    return f
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

    const f = e.dataTransfer.files?.[0] ?? null
    handleFile(f)
  }

  const handleSubmit = async () => {
    if (!file) {
      return
    }
    
    onUpload?.(file)
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
        {file ? (
          <>
            <EmptyTitle>{file.name}</EmptyTitle>
            <EmptyDescription>
              이 파일을 임베딩하여 분석을 시작하시겠습니까?
            </EmptyDescription>
          </>
        ) : (
          <>
            <EmptyTitle>아직 업로드된 청약 공고문이 없어요</EmptyTitle>
            <EmptyDescription>
              여기에 PDF 파일을 드래그하거나, 버튼을 눌러 업로드할 수 있어요.
            </EmptyDescription>
          </>
        )}
      </EmptyHeader>
      <EmptyContent>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleChange}
        />

        {file ? (
          <div className="flex flex-col gap-3 items-center">
            <Button 
              size="sm" 
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? '분석 중...' : '분석 시작하기'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFile(null)}
            >
              취소
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={handleButtonClick}>
            Upload PDF
          </Button>
        )}
      </EmptyContent>
    </Empty>
  )
}
