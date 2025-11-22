import { fetchChatCompletions } from "@/api/localdb";
import { useQuery } from "@tanstack/react-query";

export function useLocalMessagesQuery() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: fetchChatCompletions,
  })
}