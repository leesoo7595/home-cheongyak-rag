import { api } from "@/lib/http"
import type { 
  ChatCompletionsRequestBody, 
  StreamingChatCompletionsErrorEvent, 
  StreamingChatCompletionsResultEvent, 
  StreamingChatCompletionsTokenEvent 
} from "./chat-completions.types"

export const streamChatCompletions = async (params: {
  body: ChatCompletionsRequestBody,
  onToken?: (tokenEvent: StreamingChatCompletionsTokenEvent) => void,
  onResult?: (resultEvent: StreamingChatCompletionsResultEvent) => void,
  onError?: (errorEvent: StreamingChatCompletionsErrorEvent) => void,
}) => {
  const { body, onToken, onResult, onError } = params

  return await api.stream<
    StreamingChatCompletionsTokenEvent,
    StreamingChatCompletionsResultEvent,
    StreamingChatCompletionsErrorEvent
  >(`/v3/chat-completions/HCX-007`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    onToken,
    onResult,
    onError,
  })
}