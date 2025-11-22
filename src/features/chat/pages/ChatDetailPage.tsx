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

  return <div>
    <ChatMessages messages={data} />

    <ChatInputGroup
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
    />
  </div>
}