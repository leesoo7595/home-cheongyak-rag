import { useCallback, useMemo, useState } from 'react'

import { useUploadPdfMutation } from '@/features/chat/hooks/mutations/useUploadPdf'
import { PdfPanelContext } from './usePdfPanel'

interface Props {
  children: React.ReactNode
  conversationId?: string
}

export function PdfPanelProvider({ children, conversationId }: Props) {
  const url = conversationId && `/api/pdfs/${conversationId}`
  const { mutate: upload, isPending } = useUploadPdfMutation()
  const [page, setPage] = useState(1)

  const onPageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
    },
    [setPage]
  )

  const value = useMemo(
    () => ({
      url,
      upload,
      isPending,
      page,
      onPageChange,
    }),
    [url, upload, isPending, page, onPageChange]
  )

  return (
    <PdfPanelContext.Provider value={value}>
      {children}
    </PdfPanelContext.Provider>
  )
}
