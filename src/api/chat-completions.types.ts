export interface ChatCompletionsResponseMessage {
  role: string
  content: string
  thinkingContent: string
}

export type ChatCompletionsRequestMessage = Omit<ChatCompletionsResponseMessage, 'thinkingContent'>;

export interface ChatCompletionsRequestBody {
  messages: ChatCompletionsRequestMessage[]
}
type FinishReason = "stop" | "length";

interface ChatCompletionsUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  completionTokensDetails: {
      thinkingTokens: number
  }
}

export interface StreamingChatCompletionsTokenEvent {
  message: ChatCompletionsResponseMessage
  finishReason: FinishReason
  created: number
  seed: number
  usage: ChatCompletionsUsage
}

export interface StreamingChatCompletionsResultEvent {
  message: ChatCompletionsResponseMessage
  finishReason: FinishReason
  created: number
  seed: number
  usage: ChatCompletionsUsage
}

export interface StreamingChatCompletionsErrorEvent {
  status: StatusCode
}

export interface ApiResponse<T> {
  status: StatusCode
  result: T
}

export interface StatusCode {
  code: number
  message: string
}