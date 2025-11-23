import { serverApi } from "../lib/http"
import type { ChatCompletionsRequestMessage } from "./chat-completions.types"

export const fetchChatCompletions = async () => {
  return await serverApi<ChatCompletionsRequestMessage[]>(`/_localdb/chat_completions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
}

export const saveLocalMessage = async (body: ChatCompletionsRequestMessage) => {
  return await serverApi(`/_localdb/`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}