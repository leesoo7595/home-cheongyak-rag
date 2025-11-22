import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/common/AppSidebar"
import { useLocalMessagesQuery } from '@/features/chat/hooks/queries/useLocalMessagesQuery'
import { ChatDetailPage } from '@/features/chat/pages/ChatDetailPage'
import { NewChatPage } from '@/features/chat/pages/NewChatPage'
import { AppBreadcrumb } from './components/common/AppBreadcrumb'

function App() {
  const { data = [], isLoading, isError } = useLocalMessagesQuery()

  const hasMessages = data.length > 0

  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (isError) {
    return <div>Error loading messages.</div>
  }
  return <SidebarProvider>
    <AppSidebar />
    <div className="flex flex-1 flex-col overflow-hidden">
      <header>
        <div className="w-full max-w-3xl px-6 py-4">
          <AppBreadcrumb />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          {hasMessages ? <ChatDetailPage /> : <div className="flex min-h-[65vh] flex-col justify-center">
            <NewChatPage />
          </div>}
        </div>
      </main>
    </div>
  </SidebarProvider>
}

export default App