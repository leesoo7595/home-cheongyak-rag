import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveMessage } from '@/api/localdb'
import type {
  Conversation,
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
      const newId = res.conversation.id

      const conversations = queryClient.getQueryData<Conversation[]>([
        'conversations',
      ])
      const exists = conversations?.some((c) => c.id === newId)
      if (!exists) {
        queryClient.invalidateQueries({
          queryKey: ['conversations'],
        })
      }

      queryClient.invalidateQueries({
        queryKey: ['messages', newId],
      })
    },
    onError: (error) => {
      console.error(error)
    },
  })
}
