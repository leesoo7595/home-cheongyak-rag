import { ChatInputGroup } from '../components/ChatInputGroup'
import { useChatInputController } from '@/contexts/useChatInputController'

interface NewChatViewProps {
  disabled: boolean
}

export function NewChatView({ disabled }: NewChatViewProps) {
  const { value, setValue, handleSubmit } = useChatInputController()

  return (
    <div className="flex flex-col px-6 py-8 overflow-y-auto">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">새 채팅 시작하기</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {disabled
            ? '질문할 내용의 청약공고문(PDF) 파일을 먼저 업로드 한 후 대화가 가능합니다.'
            : '궁금한 내용을 편하게 물어보세요.'}
        </p>
        <ChatInputGroup
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
