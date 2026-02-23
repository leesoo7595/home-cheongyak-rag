import type { ReactNode } from 'react'
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb'

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="absolute">
        <div className="w-full px-6 py-4">
          <AppBreadcrumb />
        </div>
      </header>

      <main className="grid flex-1 grid-cols-2">{children}</main>
    </div>
  )
}
