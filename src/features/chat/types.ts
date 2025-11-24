import type { ChatCompletionsRole } from '@/api/chat-completions.types'

export type ChatRole = ChatCompletionsRole

export interface ChatMessage {
  role: ChatRole
  content: string
}
