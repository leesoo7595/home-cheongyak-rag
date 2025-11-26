import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveMessage } from '@/api/localdb'
import type {
  MessageRequest,
  SaveMessageResponse,
} from '@/api/localdb.types'

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
