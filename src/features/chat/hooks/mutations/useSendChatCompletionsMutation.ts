import { sendChatCompletions } from "@/api/chat-completions"
import { useMutation } from "@tanstack/react-query"
import { useSaveLocalMessageMutation } from "./useSaveLocalMessage"

export function useSendChatCompletionsMutation() {
  const saveLocalMessageMutate = useSaveLocalMessageMutation()

  return useMutation({
    mutationFn: sendChatCompletions,
    onSuccess: ({ result }) => {
      saveLocalMessageMutate.mutate({
        role: result.message.role,
        content: result.message.content,
      })
    },
    onError: (error) => {
      console.error(error)
    },
  })
}