'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { streamChatCompletions } from '@/features/chat/api'
import type { ChatCompletionsRequestMessage } from '@/features/chat/chat-completions.types'

import { useSaveMessageMutation } from './useSaveMessage'

interface ChatStreamParams {
  messages: ChatCompletionsRequestMessage[]
  conversationId: string
}

type StreamStatus = 'idle' | 'thinking' | 'streaming'

export function useChatStreamMutation() {
  const [streamText, setStreamText] = useState('')
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('idle')

  const saveLocalMessageMutate = useSaveMessageMutation()

  const mutation = useMutation({
    mutationFn: async ({ messages, conversationId }: ChatStreamParams) => {
      let isStreamClosed = false

      const closeStream = () => {
        isStreamClosed = true
        setStreamText('')
        setStreamStatus('idle')
      }

      setStreamText('')
      setStreamStatus('thinking')

      try {
        const finalResult = await streamChatCompletions({
          body: {
            messages,
          },
          onToken: (e) => {
            if (isStreamClosed) return

            const chunk = e.message.content ?? ''
            if (chunk) {
              setStreamStatus((prev) =>
                prev === 'thinking' ? 'streaming' : prev,
              )

              setStreamText((prev) => prev + chunk)
            }
          },
          onResult: (e) => {
            closeStream()
            saveLocalMessageMutate.mutate({
              ...e.message,
              conversationId,
            })
          },
          onError: (e) => {
            console.error('stream error', e)
            closeStream()
          },
        })

        return finalResult
      } finally {
        closeStream()
      }
    },
  })

  const isThinking = streamStatus === 'thinking'
  const isStreaming = streamStatus === 'streaming'
  return {
    ...mutation,
    streamText,
    streamStatus,
    isThinking,
    isStreaming,
  }
}
