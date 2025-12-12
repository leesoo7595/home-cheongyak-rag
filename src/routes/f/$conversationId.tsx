import { createFileRoute } from '@tanstack/react-router'

import { ChatDetailView } from '@/features/chat/views/ChatDetailView'
import { ChatInputProvider } from '@/contexts/ChatInputProvider'
import { useMessagesQuery } from '@/features/chat/hooks/queries/useMessagesQuery'
import { NewChatView } from '@/features/chat/views/NewChatView'

export const Route = createFileRoute('/f/$conversationId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { conversationId } = Route.useParams()

  const { data: messages } = useMessagesQuery(conversationId)
  const hasChat = (messages?.length ?? 0) > 0

  return (
    <ChatInputProvider conversationId={conversationId}>
      {hasChat ? (
        <ChatDetailView conversationId={conversationId} />
      ) : (
        <NewChatView disabled={false} />
      )}
    </ChatInputProvider>
  )
}
