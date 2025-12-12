import { createFileRoute } from '@tanstack/react-router'

import { NewChatView } from '@/features/chat/views/NewChatView'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <NewChatView />
}
