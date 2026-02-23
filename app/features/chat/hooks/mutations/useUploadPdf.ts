import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { uploadPdf } from '@/features/chat/api'

export function useUploadPdfMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: uploadPdf,
    onSuccess: ({ conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['pdf'] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })

      navigate({
        to: '/f/$conversationId',
        params: { conversationId },
      })
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
