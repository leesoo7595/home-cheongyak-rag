import { ChatInputGroup } from '../components/ChatInputGroup'
import { useChatInput } from '../hooks/useChatInput'

export function NewChatPage() {
  const { value, setValue, handleSubmit } = useChatInput()

  return (
    <div className="grid w-full gap-6 p-6">
      <h2 className="scroll-m-20 px-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        지금 무슨 생각을 하고 있어?
      </h2>

      <ChatInputGroup
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
