import { useMemo, type ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'

import { usePdfQuery } from '@/features/chat/hooks/queries/usePdfQuery'
import { useUploadPdfMutation } from '@/features/chat/hooks/mutations/useUploadPdf'

import { PdfPanelContext } from './usePdfPanel'


export function PdfPanelProvider({ children }: { children: ReactNode }) {
  const routerState = useRouterState()
  
  const conversationMatch = routerState.matches.find(
    (m) => m.routeId === '/f/$conversationId'
  )
  const conId = conversationMatch?.params?.conversationId as string | undefined

  const { data: pdf } = usePdfQuery(conId)
  const { mutate: upload, isPending } = useUploadPdfMutation()

  const value = useMemo(
    () => ({
      file: pdf ?? null,
      upload,
      isPending,
    }),
    [pdf, upload, isPending],
  )

  return (
    <PdfPanelContext.Provider value={value}>
      {children}
    </PdfPanelContext.Provider>
  )
}
