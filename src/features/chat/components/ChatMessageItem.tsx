import type { Message } from '@/api/chat-completions'
import { cn } from '../../../lib/utils'

type ChatMessageItemProps = {
  message: Message
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  if (message.role === 'system') {
    return null
  }

  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'w-full flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground border border-border'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
