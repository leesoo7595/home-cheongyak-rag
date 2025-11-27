import { createContext, useContext } from 'react'

interface PdfPanelState {
  file: Blob | null
  upload: (file: File) => void
  isPending: boolean
}

export const PdfPanelContext = createContext<PdfPanelState | null>(null)

export function usePdfPanel() {
  const ctx = useContext(PdfPanelContext)
  if (!ctx) {
    throw new Error('usePdfPanel must be used within PdfPanelProvider')
  }

  return ctx
}
