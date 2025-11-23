import type { ChatInputController } from '@/features/chat/hooks/useChatInput'
import { ChatMessages } from '@/features/chat/components/ChatMessages'
import { ChatInputGroup } from '@/features/chat/components/ChatInputGroup'
import { useLocalMessagesQuery } from '../hooks/queries/useLocalMessagesQuery'

type ChatDetailViewProps = {
  chatInput: ChatInputController
}

export function ChatDetailView({ chatInput }: ChatDetailViewProps) {
  const { data = [] } = useLocalMessagesQuery()
  const { value, setValue, handleSubmit } = chatInput

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-28">
        <ChatMessages messages={data}/>
      </div>

      <div
        className="
          fixed bottom-0 right-0 
          left-[var(--sidebar-width,0px)] 
          bg-background
        "
      >
        <div className="mx-auto w-full max-w-3xl px-6 py-3">
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
