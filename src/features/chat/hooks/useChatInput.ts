import { useState } from 'react'
import { useSaveMessageMutation } from './mutations/useSaveMessage'
import { useChatStreamMutation } from './mutations/useChatStreamMutation'
import type { ChatCompletionsRole } from '@/api/chat-completions.types'
import { useMessagesQuery } from './queries/useMessagesQuery'
import { useNavigate } from '@tanstack/react-router'

export type ChatInputController = ReturnType<typeof useChatInput>

export function useChatInput(conId?: string): {
  streamText: string
  value: string
  setValue: (value: string) => void
  handleSubmit: () => void
} {
  const [value, setValue] = useState('')
  const [conversationId, setConversationId] = useState<string | undefined>(
    conId
  )

  const navigate = useNavigate()
  const saveMessage = useSaveMessageMutation()
  const { streamText, mutate: streamChat } = useChatStreamMutation()

  const { data: messages } = useMessagesQuery(conversationId)

  const handleSubmit = async () => {
    const msg = { role: 'user' as ChatCompletionsRole, content: value }

    let currentConversationId = conversationId
    if (!currentConversationId) {
      const response = await saveMessage.mutateAsync({
        ...msg,
      })

      currentConversationId = response.conversation.id
      setConversationId(currentConversationId)

      navigate({
        to: '/f/$conversationId',
        params: { conversationId: currentConversationId },
      })
    } else {
      await saveMessage.mutateAsync({
        ...msg,
        conversationId: currentConversationId,
      })
    }

    const historyMessages =
      messages?.map((m) => ({
        role: m.role,
        content: m.content,
      })) ?? []
    const payloadMessages = [...historyMessages, msg]

    streamChat({
      messages: payloadMessages,
      conversationId: currentConversationId,
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
