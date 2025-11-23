import { useLocalMessagesQuery } from '@/features/chat/hooks/queries/useLocalMessagesQuery'
import { useChatInput } from '@/features/chat/hooks/useChatInput'
import { ChatDetailView } from '@/features/chat/views/ChatDetailView'
import { NewChatView } from '@/features/chat/views/NewChatView'

export function ChatPage() {
  const { data = [], isLoading, isError } = useLocalMessagesQuery()
  const chatInput = useChatInput()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading messages.</div>

  const hasMessages = data.length > 0

  return  <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full max-w-3xl flex-col">
        {hasMessages ? (
          <ChatDetailView chatInput={chatInput} />
        ) : (
          <NewChatView chatInput={chatInput} />
        )}
      </div>
    </div>
}
