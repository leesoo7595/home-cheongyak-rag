import { fetchMessages } from '@/api/api'
import type { MessageResponse } from '@/api/api.types'
import { useQuery } from '@tanstack/react-query'

export function useMessagesQuery(conversationId?: string) {
  return useQuery<MessageResponse[]>({
    queryKey: ['messages', conversationId],
    enabled: !!conversationId,
    queryFn: ({ queryKey }) => {
      if (!conversationId) {
        const [, conId] = queryKey
        return fetchMessages(conId as string)
      }

      return fetchMessages(conversationId)
    },
  })
}
