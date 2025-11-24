import { useQuery } from "@tanstack/react-query"

import { fetchConversations } from "@/api/localdb"
import type { Conversation } from "@/api/localdb.types"

export function useConversationsQuery() {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  })
}