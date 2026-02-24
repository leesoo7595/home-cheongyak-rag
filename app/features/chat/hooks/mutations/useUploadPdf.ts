import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { uploadPdf } from '@/features/chat/api'

export function useUploadPdfMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: uploadPdf,
    onSuccess: ({ conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['pdf'] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })

      router.push(`/f/${conversationId}`)
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
