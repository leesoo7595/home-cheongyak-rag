import type { ChatCompletionsRequestMessage } from './chat-completions.types'

export interface MessageRequest extends ChatCompletionsRequestMessage {
  conversationId?: string
}

export interface MessageResponse extends ChatCompletionsRequestMessage {
  id: string
  conversationId: string
  createdAt: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface SaveMessageResponse {
  conversation: Conversation
  message: MessageResponse
}

export interface PdfResponse {
  pdfId: string
  chunks: number
  message: string
}