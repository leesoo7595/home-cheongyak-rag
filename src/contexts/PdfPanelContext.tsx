import { useMemo, useState, type ReactNode } from 'react'
import { PdfPanelContext } from './usePdfPanel'

export function PdfPanelProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null)

  const value = useMemo(() => ({ file, setFile }), [file])

  return (
    <PdfPanelContext.Provider value={value}>
      {children}
    </PdfPanelContext.Provider>
  )
}
