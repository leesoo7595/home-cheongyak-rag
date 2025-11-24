import { NewChatView } from '@/features/chat/views/NewChatView'
import { PdfEmptyUploadPanel } from '@/features/chat/components/PdfUploadPanel'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <PdfEmptyUploadPanel />
      <NewChatView />
    </>
  )
}
