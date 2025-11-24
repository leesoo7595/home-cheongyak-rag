import { ChatPage } from '@/features/chat/pages/ChatPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <ChatPage />
}
