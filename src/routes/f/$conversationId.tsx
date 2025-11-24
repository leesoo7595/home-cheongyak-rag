import { createFileRoute } from '@tanstack/react-router'

import { ChatDetailView } from '@/features/chat/views/ChatDetailView'

export const Route = createFileRoute('/f/$conversationId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { conversationId } = Route.useParams()

  return <ChatDetailView conversationId={conversationId} />
}
