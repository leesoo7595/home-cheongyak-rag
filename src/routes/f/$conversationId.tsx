import { createFileRoute } from '@tanstack/react-router'

import { ChatDetailView } from '@/features/chat/views/ChatDetailView'
import { ChatInputProvider } from '@/contexts/ChatInputProvider'

export const Route = createFileRoute('/f/$conversationId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { conversationId } = Route.useParams()

  return (
    <ChatInputProvider conversationId={conversationId}>
      <ChatDetailView conversationId={conversationId} />
    </ChatInputProvider>
  )
}
