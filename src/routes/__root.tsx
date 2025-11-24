import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/common/AppSidebar'
import { AppLayout } from '@/components/layout/AppLayout'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AppLayout>
        <Outlet />
      </AppLayout>
    </SidebarProvider>
  )
}
