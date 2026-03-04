import fs from 'fs'
import path from 'path'
import os from 'os'
import { randomUUID } from 'crypto'
import { Client } from '@opensearch-project/opensearch'
import { OpenAIEmbeddings } from '@langchain/openai'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

type RagConfig = {
  indexName: string
  opensearchHost: string
  opensearchPort: string
  opensearchUser: string
  opensearchPassword: string
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getRagConfig(): RagConfig {
  return {
    indexName: requireEnv('OPENSEARCH_INDEX'),
    opensearchHost: requireEnv('OPENSEARCH_HOST'),
    opensearchPort: requireEnv('OPENSEARCH_PORT'),
    opensearchUser: requireEnv('OPENSEARCH_USER'),
    opensearchPassword: requireEnv('OPENSEARCH_PASSWD'),
  }
}

let opensearchClient: Client | null = null
function getOpenSearchClient(config: RagConfig): Client {
  if (!opensearchClient) {
    opensearchClient = new Client({
      node: `https://${config.opensearchHost}:${config.opensearchPort}`,
      auth: {
        username: config.opensearchUser,
        password: config.opensearchPassword,
      },
      ssl: { rejectUnauthorized: false },
      requestTimeout: 300_000,
    })
  }

  return opensearchClient
}

let embeddings: OpenAIEmbeddings | null = null
function getEmbeddings(): OpenAIEmbeddings {
  if (!embeddings) {
    embeddings = new OpenAIEmbeddings({
      apiKey: process.env.EMBEDDING_API_KEY ?? 'dummy',
      model: '/data/models/baai_bge-m3',
      configuration: {
        baseURL: process.env.EMBEDDING_API_URL,
      },
    })
  }

  return embeddings
}

// ---------- Types ----------

export type SearchHit = {
  text: string
  pageNumber: number
  chunkIndex: number
}

// ---------- Indexing ----------

export async function indexPdf(
  conversationId: string,
  pdfBuffer: Buffer,
): Promise<void> {
  const config = getRagConfig()
  const client = getOpenSearchClient(config)
  const embeddingClient = getEmbeddings()

  const tmpPath = path.join(os.tmpdir(), `${randomUUID()}.pdf`)
  fs.writeFileSync(tmpPath, pdfBuffer)

  try {
    // 1) Parse PDF — one Document per page
    const loader = new PDFLoader(tmpPath, { splitPages: true })
    const docs = await loader.load()

    // 2) Chunk each page's text while preserving page number
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const chunks = await splitter.splitDocuments(docs)

    if (chunks.length === 0) return

    // 3) Embed all chunks
    const texts = chunks.map((c) => c.pageContent)
    const vectors = await embeddingClient.embedDocuments(texts)

    // 4) Index to OpenSearch
    for (let i = 0; i < chunks.length; i++) {
      const pageNumber =
        (chunks[i].metadata as { loc?: { pageNumber?: number } }).loc
          ?.pageNumber ?? 1
      await client.index({
        index: config.indexName,
        id: `${conversationId}-${i}`,
        body: {
          pdf_id: conversationId,
          chunk_index: i,
          text: chunks[i].pageContent,
          embedding: vectors[i],
          page_number: pageNumber,
        },
      })
    }
  } finally {
    fs.unlinkSync(tmpPath)
  }
}

// ---------- KNN search ----------

export async function searchSimilarChunks(
  conversationId: string,
  query: string,
  size = 10,
  k = 20,
): Promise<SearchHit[]> {
  const config = getRagConfig()
  const client = getOpenSearchClient(config)
  const embeddingClient = getEmbeddings()
  const [queryVec] = await embeddingClient.embedDocuments([query])

  const result = await client.search({
    index: config.indexName,
    body: {
      size,
      query: {
        bool: {
          filter: [{ terms: { pdf_id: [conversationId] } }],
          must: [
            {
              knn: {
                embedding: { vector: queryVec, k },
              },
            },
          ],
        },
      },
    },
  })

  const hits = (result.body.hits?.hits ?? []) as unknown as Array<{
    _source: { text: string; page_number: number; chunk_index: number }
  }>

  return hits.map((h, i) => ({
    text: h._source.text,
    pageNumber: h._source.page_number,
    chunkIndex: h._source.chunk_index ?? i,
  }))
}
