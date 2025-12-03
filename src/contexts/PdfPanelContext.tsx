import { useMemo, type ReactNode } from 'react'
import { useParams } from '@tanstack/react-router'

import { useUploadPdfMutation } from '@/features/chat/hooks/mutations/useUploadPdf'

import { PdfPanelContext } from './usePdfPanel'


export function PdfPanelProvider({ children }: { children: ReactNode }) {
  const { conversationId } = useParams({ from: '/f/$conversationId' }) ?? {}

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
