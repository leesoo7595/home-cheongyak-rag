import { useState } from 'react'

import { useSaveMessageMutation } from './mutations/useSaveMessage'
import { useChatStreamMutation } from './mutations/useChatStreamMutation'
import type { ChatCompletionsRole } from '@/api/chat-completions.types'
import { useMessagesQuery } from './queries/useMessagesQuery'

export type ChatInputController = ReturnType<typeof useChatInput>

export function useChatInput(conversationId?: string): {
  streamText: string
  value: string
  setValue: (value: string) => void
  handleSubmit: () => void
} {
  const [value, setValue] = useState('')

  const saveMessage = useSaveMessageMutation()
  const { streamText, mutate: streamChat } = useChatStreamMutation()

  const { data: messages } = useMessagesQuery(conversationId)

  const handleSubmit = async () => {
    if (!conversationId) {
      throw new Error('Conversation ID is required')
    }

    const msg = { role: 'user' as ChatCompletionsRole, content: value }
    await saveMessage.mutateAsync({
      ...msg,
      conversationId,
    })

    const historyMessages =
      messages?.map((m) => ({
        role: m.role,
        content: m.content,
      })) ?? []
    const payloadMessages = [...historyMessages, msg]

    streamChat({
      messages: payloadMessages,
      conversationId,
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
