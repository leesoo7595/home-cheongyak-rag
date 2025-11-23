import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { streamChatCompletions } from "@/api/chat-completions";
import type { ChatCompletionsRequestMessage } from "@/api/chat-completions.types";

import { useSaveLocalMessageMutation } from "./useSaveLocalMessage";

export function useChatStreamMutation() {
  const [streamText, setStreamText] = useState('')
  const saveLocalMessageMutate = useSaveLocalMessageMutation()
  
  const mutation = useMutation({
    mutationFn: async (params: {
      messages: ChatCompletionsRequestMessage[]
    }) => {
      setStreamText('')

      const finalResult = await streamChatCompletions({
        body: {
          messages: params.messages
        },
        onToken: (e) => {
          const chunk = e.message.content ?? ''
          if (chunk) {
            setStreamText((prev) => prev + chunk)
          }
        },
        onResult: (e) => {
          saveLocalMessageMutate.mutate({ ...e.message })
        },
        onError: (e) => {
          console.error('stream error', e)
        }
      })

      return finalResult
    }
  })

  return {
    ...mutation,
    streamText,
  }
}