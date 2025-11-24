import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ChatSidebar } from '@/features/chat/components/ChatSidebar'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatInputProvider } from '@/contexts/ChatInputProvider'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <AppLayout>
        <ChatInputProvider>
          <Outlet />
        </ChatInputProvider>
      </AppLayout>
    </SidebarProvider>
  )
}
