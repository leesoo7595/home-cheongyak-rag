import { ChatMessageItem } from './ChatMessageItem'
import type { ChatMessage } from '../types'
import '@/index.css'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isSaving: boolean
  isThinking: boolean
  streamText?: string
}

export function ChatMessages({
  messages,
  isSaving,
  isThinking,
  streamText,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {messages.map((message, i) => (
        <ChatMessageItem key={i} message={message} />
      ))}
      {isSaving && <FlowingText text="질문 분석 중..." />}
      {isThinking ? (
        <ThinkingDot />
      ) : (
        <ChatMessageItem
          message={{
            role: 'assistant',
            content: streamText ?? '',
          }}
        />
      )}
    </div>
  )
}

function ThinkingDot() {
  return (
    <span className="inline-block h-2 w-2 rounded-full bg-black m-4 thinking-dot" />
  )
}

function FlowingText({ text }: { text: string }) {
  return <span className="text-sm flowing-text">{text}</span>
}
