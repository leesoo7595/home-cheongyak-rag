import { ChatMessages } from '@/features/chat/components/ChatMessages'
import { ChatInputGroup } from '@/features/chat/components/ChatInputGroup'
import { useMessagesQuery } from '../hooks/queries/useMessagesQuery'
import { useChatInputController } from '@/contexts/useChatInputController'

type ChatDetailViewProps = {
  conversationId: string
}

export function ChatDetailView({ conversationId }: ChatDetailViewProps) {
  const { data = [] } = useMessagesQuery(conversationId)
  const { value, setValue, handleSubmit, streamText } = useChatInputController()

  return (
    <div className='relative flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto pb-28'>
        <ChatMessages messages={data} streamText={streamText} />
      </div>

      <div
        className='
          fixed bottom-0 right-0 
          left-[var(--sidebar-width,0px)] 
          bg-background
        '
      >
        <div className='mx-auto w-full max-w-3xl px-6 py-3'>
          <ChatInputGroup
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
