import { serverApi } from "./base"
import type { Message } from "./chat-completions"

export const fetchChatCompletions = async () => {
  return await serverApi<Message[]>(`/_localdb/chat_completions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
}

export const saveLocalMessage = async (body: Message) => {
  return await serverApi(`/_localdb/`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}