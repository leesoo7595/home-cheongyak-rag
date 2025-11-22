import { ChatInputGroup } from "../components/ChatInputGroup"
import { ChatMessages } from "../components/ChatMessages"
import { useLocalMessagesQuery } from "../hooks/queries/useLocalMessagesQuery"
import { useChatInput } from "../hooks/useChatInput"
import { NewChatPage } from "./NewChatPage"

export function ChatDetailPage() {

  const { data = [] } = useLocalMessagesQuery()
  const {value, setValue, handleSubmit} = useChatInput()
  
  if (data.length === 0) {
    return <NewChatPage />
  }

  return <div className="relative">
    <div className="h-full overflow-y-auto pb-24">
      <ChatMessages messages={data} />
    </div>
    <div className="fixed bottom-0 inset-x-0 bg-background p-4 pt-0">
      <ChatInputGroup
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
      />
    </div>
  </div>
}