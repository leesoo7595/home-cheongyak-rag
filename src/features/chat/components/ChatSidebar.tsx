import { Link } from '@tanstack/react-router'
import { FilePlus } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useConversationsQuery } from '@/features/chat/hooks/queries/useConversationsQuery'

export function ChatSidebar() {
  const { data: conversations } = useConversationsQuery()
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={'/'}>
                  <FilePlus /> <span>새 채팅</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupLabel>내 채팅</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations?.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/f/${conversation.id}`}>
                      <span>{conversation.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
