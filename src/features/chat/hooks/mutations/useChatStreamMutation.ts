import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { streamChatCompletions } from '@/api/chat-completions'
import type { ChatCompletionsRequestMessage } from '@/api/chat-completions.types'

import { useSaveMessageMutation } from './useSaveMessage'

interface ChatStreamParams {
  messages: ChatCompletionsRequestMessage[]
  conversationId: string
}

export function useChatStreamMutation() {
  const [streamText, setStreamText] = useState('')
  const saveLocalMessageMutate = useSaveMessageMutation()

  const mutation = useMutation({
    mutationFn: async ({ messages, conversationId }: ChatStreamParams) => {
      setStreamText('')

      const finalResult = await streamChatCompletions({
        body: {
          messages,
        },
        onToken: (e) => {
          const chunk = e.message.content ?? ''
          if (chunk) {
            setStreamText((prev) => prev + chunk)
          }
        },
        onResult: (e) => {
          saveLocalMessageMutate.mutate({
            ...e.message,
            conversationId,
          })
        },
        onError: (e) => {
          console.error('stream error', e)
        },
      })

      return finalResult
    },
  })

  return {
    ...mutation,
    streamText,
  }
}
