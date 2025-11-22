import { useState } from 'react'
import { ChatInputGroup } from './components/ChatInputGroup'
import { useSendChatCompletionsMutation } from './hooks/mutations/useSendChatCompletionsMutation'
import { useSaveLocalMessageMutation } from './hooks/mutations/useSaveLocalMessage'

export function ChatPage() {
  const [value, setValue] = useState('')

  const sendChatCompletions = useSendChatCompletionsMutation()
  const saveLocalMessage = useSaveLocalMessageMutation()

  const isSubmitting =
    sendChatCompletions.isPending || saveLocalMessage.isPending

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return

    sendChatCompletions.mutate({
      messages: [
        {
          role: 'user',
          content: trimmed,
        },
      ],
    })

    saveLocalMessage.mutate({
      role: 'user',
      content: trimmed,
    })

    setValue('')
  }

  return (
    <div className="grid w-full gap-6 p-6">
      <h2 className="scroll-m-20 px-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        지금 무슨 생각을 하고 있어?
      </h2>

      <ChatInputGroup
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
