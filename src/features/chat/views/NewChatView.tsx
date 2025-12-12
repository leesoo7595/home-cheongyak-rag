import { ChatInputGroup } from '../components/ChatInputGroup'
import { useChatInput } from '../hooks/useChatInput'
import { usePdfPanel } from '@/contexts/usePdfPanel'

export function NewChatView() {
  const { url } = usePdfPanel()
  const { value, setValue, handleSubmit } = useChatInput(url)

  const placeholder = !url
    ? '오른쪽에서 PDF를 업로드하면 채팅을 시작할 수 있어요.'
    : 'Ask, Search or Chat...'

  return (
    <div className="flex flex-col px-6 py-8 overflow-y-auto">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">새 채팅 시작하기</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {!url
            ? '질문할 내용의 청약공고문(PDF) 파일을 먼저 업로드 한 후 대화가 가능합니다.'
            : '궁금한 내용을 편하게 물어보세요.'}
        </p>
        <ChatInputGroup
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          disabled={!url}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
