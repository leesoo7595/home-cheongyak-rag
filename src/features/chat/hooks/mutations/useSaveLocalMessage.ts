import { useMutation, useQueryClient } from "@tanstack/react-query"

import { saveLocalMessage } from "@/api/localdb"

export function useSaveLocalMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveLocalMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
    onError: (error) => {
      console.error(error)
    },
  })
}