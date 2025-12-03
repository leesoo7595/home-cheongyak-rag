import { useMemo } from 'react'

import { useUploadPdfMutation } from '@/features/chat/hooks/mutations/useUploadPdf'
import { PdfPanelContext } from './usePdfPanel'

interface Props {
  children: React.ReactNode
  conversationId?: string
}

export function PdfPanelProvider({ children, conversationId }: Props) {
  const url = conversationId ? `/api/pdfs/${conversationId}` : null
  const { mutate: upload, isPending } = useUploadPdfMutation()

  const value = useMemo(
    () => ({
      url,
      upload,
      isPending,
    }),
    [url, upload, isPending],
  )

  return (
    <PdfPanelContext.Provider value={value}>
      {children}
    </PdfPanelContext.Provider>
  )
}
