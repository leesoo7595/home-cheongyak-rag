import { api } from '../lib/http'
import type {
  Conversation,
  MessageRequest,
  MessageResponse,
  PdfUploadResponse,
  SaveMessageResponse,
} from './api.types'
import type {
  ChatCompletionsRequestBody,
  StreamingChatCompletionsErrorEvent,
  StreamingChatCompletionsResultEvent,
  StreamingChatCompletionsTokenEvent,
} from './chat-completions.types'

export const fetchMessages = (id: string): Promise<MessageResponse[]> => {
  return api<MessageResponse[]>(`/conversations/${id}/messages`)
}

export const saveMessage = (
  body: MessageRequest
): Promise<SaveMessageResponse> => {
  return api<SaveMessageResponse>(`/messages`, {
    body: JSON.stringify(body),
    method: 'POST',
  })
}

export const fetchConversations = (): Promise<Conversation[]> => {
  return api<Conversation[]>(`/conversations`)
}

export const uploadPdf = (file: File): Promise<PdfUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  return api<PdfUploadResponse>('/conversations', {
    body: formData,
    method: 'POST',
  })
}

interface StreamChatCompletionsParams {
  body: ChatCompletionsRequestBody
  onToken?: (tokenEvent: StreamingChatCompletionsTokenEvent) => void
  onResult?: (resultEvent: StreamingChatCompletionsResultEvent) => void
  onError?: (errorEvent: StreamingChatCompletionsErrorEvent) => void
}

export const streamChatCompletions = (params: StreamChatCompletionsParams) => {
  const { body, onToken, onResult, onError } = params

  return api.stream<
    StreamingChatCompletionsTokenEvent,
    StreamingChatCompletionsResultEvent,
    StreamingChatCompletionsErrorEvent
  >(`/v3/chat-completions/HCX-007`, {
    body: JSON.stringify(body),
    method: 'POST',
    onToken,
    onResult,
    onError,
  })
}
