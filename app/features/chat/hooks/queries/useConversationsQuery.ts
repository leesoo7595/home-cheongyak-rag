'use client'

import { useQuery } from "@tanstack/react-query"

import { fetchConversations } from '@/features/chat/api'
import type { Conversation } from '@/features/chat/api.types'

export function useConversationsQuery() {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  })
}