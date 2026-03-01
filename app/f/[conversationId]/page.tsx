import { PdfPanelProvider } from '@/contexts/PdfPanelContext'
import { ChatDetailView } from '@/features/chat/views/ChatDetailView'
import { PdfPanel } from '@/features/chat/components/PdfPanel'

type Props = {
  params: Promise<{ conversationId: string }>
}

export default async function ChatDetailPage({ params }: Props) {
  const { conversationId } = await params

  return (
    <PdfPanelProvider conversationId={conversationId}>
      <ChatDetailView conversationId={conversationId} />
      <PdfPanel />
    </PdfPanelProvider>
  )
}
