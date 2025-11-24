import { NewChatView } from '@/features/chat/views/NewChatView'
import { PdfEmptyUpload } from '@/features/chat/views/PdfUploadView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <PdfEmptyUpload />
      <NewChatView />
    </>
  )
}
