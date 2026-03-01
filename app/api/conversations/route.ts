import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { loadConversations, createConversation } from '@server/services/storage'
import { indexPdf } from '@server/services/rag'

const UPLOAD_DIR = path.join(process.cwd(), 'server', 'data', 'pdfs')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

export async function GET() {
  const convos = Array.from(loadConversations().values())
  convos.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return NextResponse.json(convos)
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'PDF 파일만 가능합니다.' }, { status: 400 })
  }

  const pdfBuffer = Buffer.from(await file.arrayBuffer())
  const conversation = createConversation(file.name)

  fs.writeFileSync(path.join(UPLOAD_DIR, `${conversation.id}.pdf`), pdfBuffer)

  await indexPdf(conversation.id, pdfBuffer)

  return NextResponse.json({ conversationId: conversation.id })
}
