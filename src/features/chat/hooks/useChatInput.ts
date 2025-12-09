import { useState, useCallback } from 'react'

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
  isThinking: boolean
  isSending: boolean
  isSaving: boolean
  isStreaming: boolean
} {
  const [value, setValue] = useState('')

  const saveMessage = useSaveMessageMutation()
  const {
    streamText,
    mutate: streamChat,
    isPending: isStreaming,
    isThinking,
  } = useChatStreamMutation()

  const { data: messages } = useMessagesQuery(conversationId)
  const isSaving = saveMessage.isPending
  const isSending = isSaving || isStreaming

  const handleSubmit = useCallback(async () => {
    if (!conversationId) {
      console.error('Conversation ID is required for useChatInput')
      return
    }

    const trimmed = value.trim()
    if (!trimmed || isSending) return

    try {
      const response = await saveMessage.mutateAsync({
        role: 'user',
        content: trimmed,
        conversationId,
      })

      const historyMessages =
        messages?.map((m) => ({
          role: m.role,
          content: m.role === 'user' ? m.content + m.context : m.content,
        })) ?? []
      const payloadMessages = [
        ...historyMessages,
        {
          role: 'user' as ChatCompletionsRole,
          content: trimmed + response.message.context,
        },
      ]

      streamChat({
        messages: payloadMessages,
        conversationId,
      })
      setValue('')
    } catch (error) {
      // TODO: toast 등으로 에러 노출
      console.error('Failed to send message', error)
    }
  }, [conversationId, value, isSending, messages, saveMessage, streamChat])

  return {
    streamText,
    value,
    setValue,
    handleSubmit,
    isThinking,
    isSending,
    isSaving,
    isStreaming,
  }
}
