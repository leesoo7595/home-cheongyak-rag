import { baseURL, http } from "@/api/base"

interface ChatCompletionsBody {
    messages: Message[]
}

interface Message {
    role: string
    content: string
}

export const sendChatCompletions = async (body: ChatCompletionsBody) => {
    return await http(`/v3/chat-completions/HCX-007`, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
  }