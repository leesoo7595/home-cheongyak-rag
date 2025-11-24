import { ChatInputGroup } from '../components/ChatInputGroup'
import { useChatInputController } from '@/contexts/useChatInputController'

export function NewChatView() {
  const { value, setValue, handleSubmit } = useChatInputController()

  return (
    <div className='flex min-h-[65vh] flex-col items-center justify-center'>
      <div className='w-full max-w-3xl text-center'>
        <h2 className='text-xl font-semibold'>새 채팅 시작하기</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          궁금한 내용을 편하게 물어보세요.
        </p>

        <div className='mt-4'>
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
