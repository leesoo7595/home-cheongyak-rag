import { NextRequest, NextResponse } from 'next/server'
import { loadMessages } from '@server/services/storage'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const messages = loadMessages(id)
  return NextResponse.json(messages)
}
