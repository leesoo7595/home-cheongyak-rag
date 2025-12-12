import { useEffect, useRef } from 'react'

import { ChatMessages } from '@/features/chat/components/ChatMessages'
import { ChatInputGroup } from '@/features/chat/components/ChatInputGroup'
import { useMessagesQuery } from '../hooks/queries/useMessagesQuery'
import { useChatInput } from '../hooks/useChatInput'

type ChatDetailViewProps = {
  conversationId: string
}

export function ChatDetailView({ conversationId }: ChatDetailViewProps) {
  const { data = [] } = useMessagesQuery(conversationId)
  const {
    value,
    setValue,
    handleSubmit,
    streamText,
    isSaving,
    isThinking,
    isSending,
  } = useChatInput(conversationId)

  const isSubmitDisabled = isSending || !value.trim()

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
        <ChatMessages
          messages={data}
          isSaving={isSaving}
          isThinking={isThinking}
          streamText={streamText}
        />
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
          disabled={isSubmitDisabled}
        />
      </div>
    </div>
  )
}
