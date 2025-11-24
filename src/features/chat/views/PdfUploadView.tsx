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
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    setFileName(file.name)
    onFileSelected?.(file)
  }

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>Cloud Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload PDF files to your cloud storage to access them anywhere.
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
