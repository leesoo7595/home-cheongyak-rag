import { FileText } from 'lucide-react'
import { useState } from 'react'

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

  return (
    <Empty className='border border-dashed'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <FileText />
        </EmptyMedia>
        <EmptyTitle>Cloud Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload PDF files to your cloud storage to access them anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant='outline' size='sm'>
          Upload Files
        </Button>

        {fileName && (
          <p className='mt-2 text-xs text-muted-foreground'>
            Selected: {fileName}
          </p>
        )}
      </EmptyContent>
    </Empty>
  )
}
