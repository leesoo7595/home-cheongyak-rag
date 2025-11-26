import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ChatSidebar } from '@/features/chat/components/ChatSidebar'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatInputProvider } from '@/contexts/ChatInputProvider'
import { PdfPanelProvider } from '@/contexts/PdfPanelContext'
import { PdfPanel } from '@/features/chat/components/PdfPanel'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <AppLayout>
        <PdfPanelProvider>
          <ChatInputProvider>
            <Outlet />
            <PdfPanel />
          </ChatInputProvider>
        </PdfPanelProvider>
      </AppLayout>
    </SidebarProvider>
  )
}
