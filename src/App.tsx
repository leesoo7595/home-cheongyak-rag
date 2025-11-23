import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/common/AppSidebar';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatPage } from '@/features/chat/pages/ChatPage';

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AppLayout>
        <ChatPage />
      </AppLayout>
    </SidebarProvider>
  );
}

export default App;
