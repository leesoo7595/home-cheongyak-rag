import { useQuery } from "@tanstack/react-query"

import { fetchConversations } from "@/api/api"
import type { Conversation } from "@/api/api.types"

export function useConversationsQuery() {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  })
}