import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'server', 'data')
const CONVERSATIONS_PATH = path.join(DATA_DIR, 'conversations.jsonl')
const CONVERSATIONS_DIR = path.join(DATA_DIR, 'conversations')

fs.mkdirSync(DATA_DIR, { recursive: true })
fs.mkdirSync(CONVERSATIONS_DIR, { recursive: true })

export function getMessagesPath(conversationId: string): string {
  return path.join(CONVERSATIONS_DIR, `${conversationId}.jsonl`)
}

// ---------- JSONL Helpers ----------

type JsonObject = Record<string, unknown>

function* iterJsonl(filePath: string): Generator<JsonObject> {
  if (!fs.existsSync(filePath)) return
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    yield JSON.parse(trimmed) as JsonObject
  }
}

function appendJsonl(filePath: string, obj: JsonObject): void {
  fs.appendFileSync(filePath, JSON.stringify(obj) + '\n', 'utf-8')
}

// ---------- Conversations ----------

export type Conversation = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export function loadConversations(): Map<string, Conversation> {
  const convos = new Map<string, Conversation>()
  for (const row of iterJsonl(CONVERSATIONS_PATH)) {
    const c = row as unknown as Conversation
    convos.set(c.id, c)
  }
  return convos
}

function saveConversations(convos: Map<string, Conversation>): void {
  const lines = Array.from(convos.values())
    .map((c) => JSON.stringify(c))
    .join('\n') + '\n'
  fs.writeFileSync(CONVERSATIONS_PATH, lines, 'utf-8')
}

export function createConversation(title: string): Conversation {
  const now = new Date().toISOString()
  const convo: Conversation = {
    id: randomUUID(),
    title,
    createdAt: now,
    updatedAt: now,
  }
  appendJsonl(CONVERSATIONS_PATH, convo as unknown as JsonObject)
  return convo
}

export function updateConversationUpdatedAt(id: string): Conversation {
  const convos = loadConversations()
  const convo = convos.get(id)
  if (!convo) throw new Error('Conversation not found')

  convo.updatedAt = new Date().toISOString()
  convos.set(id, convo)
  saveConversations(convos)
  return convo
}

// ---------- Messages ----------

export type Message = {
  id: string
  conversationId: string
  role: string
  content: string
  createdAt: string
  context: string
}

export function loadMessages(conversationId: string): Message[] {
  const filePath = getMessagesPath(conversationId)
  return Array.from(iterJsonl(filePath)) as unknown as Message[]
}

export function appendMessage(message: Message): void {
  const filePath = getMessagesPath(message.conversationId)
  appendJsonl(filePath, message as unknown as JsonObject)
}
