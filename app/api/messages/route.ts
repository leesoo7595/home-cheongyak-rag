import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import {
  loadConversations,
  updateConversationUpdatedAt,
  appendMessage,
} from '@server/services/storage'
import type { Message } from '@server/services/storage'
import { searchSimilarChunks } from '@server/services/rag'

type MessageBody = {
  role: string
  content: string
  conversationId?: string
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as MessageBody

  if (!body.conversationId) {
    return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
  }

  const conversation = loadConversations().get(body.conversationId)
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  let contextText = ''
  if (body.role === 'user') {
    const hits = await searchSimilarChunks(conversation.id, body.content)
    const context = hits.map(
      (h) =>
        `- 문서 내 청크 ${h.chunkIndex} : ${h.text}\n- 청크 ${h.chunkIndex}의 페이지 출처 : ${h.pageNumber}\n\n`,
    )
    contextText =
      '- 답변은 아래 검색된 문서에서 찾아서 합니다.\n### 검색된 문서:\n' + context.join('\n\n')
  }

  const message: Message = {
    id: randomUUID(),
    conversationId: conversation.id,
    role: body.role,
    content: body.content,
    context: contextText,
    createdAt: new Date().toISOString(),
  }

  appendMessage(message)
  const updatedConversation = updateConversationUpdatedAt(conversation.id)

  return NextResponse.json({ conversation: updatedConversation, message })
}
