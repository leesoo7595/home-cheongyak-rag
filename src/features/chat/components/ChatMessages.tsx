import type { Message } from '@/api/chat-completions'
import { ChatMessageItem } from './ChatMessageItem'

interface ChatMessagesProps {
  messages: Message[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {messages.map((message, i) => (
        <ChatMessageItem key={i} message={message} />
      ))}
    </div>
  )
}
