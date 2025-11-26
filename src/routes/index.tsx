import { usePdfPanel } from '@/contexts/usePdfPanel'
import { NewChatView } from '@/features/chat/views/NewChatView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { file } = usePdfPanel()

  return <NewChatView disabled={!file} />
}
