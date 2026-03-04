import { PdfPanelProvider } from '@/contexts/PdfPanelContext'
import { NewChatView } from '@/features/chat/views/NewChatView'
import { PdfPanel } from '@/features/chat/components/PdfPanel'

export default function HomePage() {
  return (
    <PdfPanelProvider>
      <NewChatView />
      <PdfPanel />
    </PdfPanelProvider>
  )
}
