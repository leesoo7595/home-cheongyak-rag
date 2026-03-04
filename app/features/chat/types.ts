import type { ChatCompletionsRole } from '@/features/chat/chat-completions.types'

export type ChatRole = ChatCompletionsRole

export interface ChatMessage {
  role: ChatRole
  content: string
}
