import { createContext, useContext } from 'react'

interface PdfPanelState {
  file: File | null
  setFile: (file: File | null) => void
}

export const PdfPanelContext = createContext<PdfPanelState | null>(null)

export function usePdfPanel() {
  const ctx = useContext(PdfPanelContext)
  if (!ctx) {
    throw new Error('usePdfPanel must be used within PdfPanelProvider')
  }

  return ctx
}
