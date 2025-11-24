import { NewChatView } from '@/features/chat/views/NewChatView'
import { createFileRoute } from '@tanstack/react-router'
import { ChatRightPanel } from '@/features/chat/components/ChatRightPanel'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <NewChatView />
      <ChatRightPanel />
    </>
  )
}
