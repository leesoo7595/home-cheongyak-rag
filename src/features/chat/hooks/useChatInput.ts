import { useState } from 'react'
import { useChatStreamMutation } from './mutations/useChatStreamMutation'
import { useSaveLocalMessageMutation } from './mutations/useSaveLocalMessage'
import { useLocalMessagesQuery } from './queries/useLocalMessagesQuery'

export type ChatInputController = ReturnType<typeof useChatInput>

export function useChatInput(): {
  streamText: string
  value: string
  setValue: (value: string) => void
  handleSubmit: () => void
} {
  const [value, setValue] = useState('')
  const { streamText, mutate: mutateSendChat } = useChatStreamMutation()
  const messages = useLocalMessagesQuery().data || []
  const saveLocalMessage = useSaveLocalMessageMutation()

  const handleSubmit = () => {
    mutateSendChat({
      messages: [
        ...messages,
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
    streamText,
    value,
    setValue,
    handleSubmit,
    
  }
}
