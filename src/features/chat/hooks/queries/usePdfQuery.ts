import { useQuery } from '@tanstack/react-query'

export function usePdfQuery(conversationId?: string) {
  return useQuery<Blob>({
    queryKey: ['pdf', conversationId],
    enabled: !!conversationId,
    queryFn: () => {
      if (!conversationId) {
        throw new Error('Conversation ID is required')
      }

      const pdfUrl = `http://localhost:4000/api/pdfs/${conversationId}.pdf`
      // TODO: fetch로 가져온 blob을 File로 변환
      return fetch(pdfUrl).then((res) => res.blob())
    },
  })
}
