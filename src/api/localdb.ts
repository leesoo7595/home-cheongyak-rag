import { serverApi } from "../lib/http"
import type { 
  Conversation, 
  MessageRequest, 
  MessageResponse, 
  PdfResponse, 
  SaveMessageResponse 
} from "./localdb.types"

export const fetchMessages = async (id: string) => {
  return await serverApi<MessageResponse[]>(`/_localdb/conversations/${id}/messages`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
}

export const saveMessage = async (body: MessageRequest) => {
  return await serverApi<SaveMessageResponse>(`/_localdb/messages`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const fetchConversations = async () => {
  return await serverApi<Conversation[]>(`/_localdb/conversations`)
}

export const uploadPdf = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return await serverApi<PdfResponse>('/_localdb/pdf', {
    body: formData,
    method: 'POST',
  })
}
