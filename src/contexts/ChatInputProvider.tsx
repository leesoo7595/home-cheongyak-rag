import { ChatInputContext } from './useChatInputController'
import { useChatInput } from '@/features/chat/hooks/useChatInput'

interface Props {
  children: React.ReactNode
  conversationId?: string
}

export function ChatInputProvider({ children, conversationId }: Props) {
  const controller = useChatInput(conversationId)

  return (
    <ChatInputContext.Provider value={controller}>
      {children}
    </ChatInputContext.Provider>
  )
}
