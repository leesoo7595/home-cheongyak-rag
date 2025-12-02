import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import { uploadPdf } from "@/api/api"

export function useUploadPdfMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: uploadPdf,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pdf'] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })

      navigate({ to: '/f/$conversationId', params: { conversationId: data.pdfId } })
    },
    onError: (error) => {
      console.log(error)
    },
  })
}