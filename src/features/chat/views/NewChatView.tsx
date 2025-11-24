import { ChatInputGroup } from '../components/ChatInputGroup'
import { useChatInputController } from '@/contexts/useChatInputController'

export function NewChatView() {
  const { value, setValue, handleSubmit } = useChatInputController()

  return (
    <div className="flex flex-col px-6 py-8 overflow-y-auto">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">새 채팅 시작하기</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          궁금한 내용을 편하게 물어보세요.
        </p>
        <ChatInputGroup
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
