import { ChatInputGroup } from '../components/ChatInputGroup'
import { useChatInput } from '../hooks/useChatInput'

export function NewChatPage() {
  const { value, setValue, handleSubmit } = useChatInput()

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h2 className="text-3xl font-semibold tracking-tight">
        지금 무슨 생각을 하고 있어?
      </h2>

      <div className="w-full max-w-lg">
        <ChatInputGroup
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
