import type { ReactNode } from 'react'
import { Providers } from './providers'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatSidebar } from '@/features/chat/components/ChatSidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <ChatSidebar />
          <SidebarInset>
            <AppLayout>{children}</AppLayout>
          </SidebarInset>
        </Providers>
      </body>
    </html>
  )
}
