import type { ReactNode } from 'react'
import { Providers } from './providers'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatSidebar } from '@/features/chat/components/ChatSidebar'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex h-svh">
            <ChatSidebar />
            <AppLayout>{children}</AppLayout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
