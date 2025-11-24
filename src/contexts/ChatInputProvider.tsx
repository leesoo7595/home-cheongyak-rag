import { useRouterState } from '@tanstack/react-router'
import { ChatInputContext } from './useChatInputController'
import { useChatInput } from '@/features/chat/hooks/useChatInput'

export function ChatInputProvider({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState()

  const conversationMatch = routerState.matches.find(
    (m) => m.routeId === '/f/$conversationId'
  )

  const conId = conversationMatch?.params?.conversationId as string | undefined

  const controller = useChatInput(conId)

  return (
    <ChatInputContext.Provider value={controller}>
      {children}
    </ChatInputContext.Provider>
  )
}
