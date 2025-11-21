import { sendChatCompletions } from "@/api/chat-completions"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useSendChatCompletionsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
      mutationFn: sendChatCompletions,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['messages'] })
        console.log(data)
      },
      onError: (error) => {
        console.error(error)
      },
  })
}