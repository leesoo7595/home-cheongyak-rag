import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

const UPLOAD_DIR = path.join(process.cwd(), 'server', 'data', 'pdfs')

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const filename = id.endsWith('.pdf') ? id : `${id}.pdf`
  const pdfPath = path.join(UPLOAD_DIR, filename)

  if (!fs.existsSync(pdfPath)) {
    return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
  }

  const buffer = fs.readFileSync(pdfPath)
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  })
}
