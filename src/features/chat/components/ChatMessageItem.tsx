import type { Message } from '@/api/chat-completions'
import { cn } from '../../../lib/utils'
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer'

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
      {isUser ? 
        <div
          className={
          'max-w rounded-xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed bg-primary text-primary-foreground'
          }
        >
          {message.content}
        </div> 
        : <div className="max-w text-sm leading-relaxed text-left">
          <MarkdownRenderer content={message.content} />
        </div>
      }
    </div>
  )
}
