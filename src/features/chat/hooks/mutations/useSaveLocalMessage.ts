import { saveLocalMessage } from "@/api/localdb"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useSaveLocalMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveLocalMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
    onError: (error) => {
      console.error(error)
    },
  })
}