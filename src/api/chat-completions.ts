import { api, type ApiResponse } from "@/api/base"

export interface ChatCompletions {
  messages: Message[]
}

export type FinishReason = "stop" | "length";

export interface ChatCompletionsUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  completionTokensDetails: {
      thinkingTokens: number
  }
}

export interface ChatCompletionsResponse {
  message: Message  
  finishReason: FinishReason
  created: number
  seed: number
  usage: ChatCompletionsUsage
}

export interface Message {
  role: string
  content: string
}

export const sendChatCompletions = async (body: ChatCompletions) => {
  return await api<ApiResponse<ChatCompletionsResponse>>(`/v3/chat-completions/HCX-007`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
}