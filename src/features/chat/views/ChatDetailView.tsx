import { useEffect, useRef } from 'react'

import { useChatInputController } from '@/contexts/useChatInputController'
import { ChatMessages } from '@/features/chat/components/ChatMessages'
import { ChatInputGroup } from '@/features/chat/components/ChatInputGroup'
import { useMessagesQuery } from '../hooks/queries/useMessagesQuery'

type ChatDetailViewProps = {
  conversationId: string
}

export function ChatDetailView({ conversationId }: ChatDetailViewProps) {
  const { data = [] } = useMessagesQuery(conversationId)
  const { value, setValue, handleSubmit, streamText } = useChatInputController()

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!bottomRef.current) return

    bottomRef.current.scrollIntoView({
      behavior: 'auto',
      block: 'end',
    })
  }, [data.length, streamText.length])

  return (
    <div className="relative h-screen flex flex-col pt-14">
      <div className="flex-1 overflow-y-auto pb-28">
        <ChatMessages messages={data} streamText={streamText} />
        <div ref={bottomRef} className="h-28" />
      </div>
      <div
        className="absolute bottom-0 left-0 w-full
          bg-background
          px-6 py-3"
      >
        <ChatInputGroup
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
