import { ChatMessageItem } from './ChatMessageItem'
import type { ChatMessage } from '../types'

interface ChatMessagesProps {
  messages: ChatMessage[]
  streamText?: string
}

export function ChatMessages({ messages, streamText }: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {messages.map((message, i) => (
        <ChatMessageItem key={i} message={message} />
      ))}

      <ChatMessageItem
        message={{
          role: 'assistant',
          content: streamText ?? '',
        }}
      />
    </div>
  )
}
