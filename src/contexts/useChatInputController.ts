import { useChatInput } from '@/features/chat/hooks/useChatInput'
import { createContext, useContext } from 'react'

type ChatController = ReturnType<typeof useChatInput>

export const ChatInputContext = createContext<ChatController | null>(null)

export function useChatInputController() {
  const ctx = useContext(ChatInputContext)
  if (!ctx) {
    throw new Error(
      'useChatInputController must be used within <ChatInputProvider />'
    )
  }
  return ctx
}
