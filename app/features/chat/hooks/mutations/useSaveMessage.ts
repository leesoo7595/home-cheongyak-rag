import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveMessage } from '@/features/chat/api'
import type {
  MessageRequest,
  SaveMessageResponse,
} from '@/features/chat/api.types'

export function useSaveMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation<SaveMessageResponse, Error, MessageRequest>({
    mutationFn: (variables) => {
      const { role, content, conversationId } = variables
      const message: MessageRequest = { role, content }
      if (conversationId) {
        message.conversationId = conversationId
      }

      return saveMessage(message)
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', res.conversation.id],
      })
    },
    onError: (error) => {
      console.error(error)
    },
  })
}
