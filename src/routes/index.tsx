import { createFileRoute } from '@tanstack/react-router'

import { NewChatView } from '@/features/chat/views/NewChatView'
import { ChatInputProvider } from '@/contexts/ChatInputProvider'
import { usePdfPanel } from '@/contexts/usePdfPanel'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { file } = usePdfPanel()

  return (
    <ChatInputProvider>
      <NewChatView disabled={!file} />
    </ChatInputProvider>
  )
}
