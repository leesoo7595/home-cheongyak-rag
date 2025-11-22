import { ChatInputGroup } from "../components/ChatInputGroup"
import { useLocalMessagesQuery } from "../hooks/queries/useLocalMessagesQuery"
import { useChatInput } from "../hooks/useChatInput"

export function ChatDetailPage() {

  const { data: messages } = useLocalMessagesQuery()
  const {value, setValue, handleSubmit} = useChatInput()
  
  return <div>
    <div>
      {messages?.map((msg, index) => (
        <div key={index}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
    </div>

    <ChatInputGroup
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
    />
  </div>
}