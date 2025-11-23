import { useState } from 'react'
import { useSendChatCompletionsMutation } from './mutations/useSendChatCompletionsMutation'
import { useSaveLocalMessageMutation } from './mutations/useSaveLocalMessage'

export type ChatInputController = ReturnType<typeof useChatInput>

export function useChatInput(): {
  value: string
  setValue: (value: string) => void
  handleSubmit: () => void
} {
  const [value, setValue] = useState('')
  const sendChatCompletions = useSendChatCompletionsMutation()
  const saveLocalMessage = useSaveLocalMessageMutation()

  const handleSubmit = () => {
    sendChatCompletions.mutate({
      messages: [
        {
          role: 'user',
          content: value,
        },
      ],
    })
    saveLocalMessage.mutate({
      role: 'user',
      content: value,
    })
    setValue('')
  }

  return {
    value,
    setValue,
    handleSubmit,
  }
}
