import fs from 'fs'
import path from 'path'
import os from 'os'
import { randomUUID } from 'crypto'
import { Client } from '@opensearch-project/opensearch'
import { OpenAIEmbeddings } from '@langchain/openai'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

// ---------- OpenSearch client ----------

const opensearchClient = new Client({
  node: `https://${process.env.OPENSEARCH_HOST}:${process.env.OPENSEARCH_PORT}`,
  auth: {
    username: process.env.OPENSEARCH_USER!,
    password: process.env.OPENSEARCH_PASSWD!,
  },
  ssl: { rejectUnauthorized: false },
  requestTimeout: 300_000,
})

const INDEX_NAME = process.env.OPENSEARCH_INDEX!

// ---------- Embeddings ----------

const embeddings = new OpenAIEmbeddings({
  model: '/data/models/baai_bge-m3',
  configuration: {
    baseURL: process.env.EMBEDDING_API_URL,
  },
})

// ---------- Types ----------

export type SearchHit = {
  text: string
  pageNumber: number
  chunkIndex: number
}

// ---------- Indexing ----------

export async function indexPdf(conversationId: string, pdfBuffer: Buffer): Promise<void> {
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
    const vectors = await embeddings.embedDocuments(texts)

    // 4) Index to OpenSearch
    for (let i = 0; i < chunks.length; i++) {
      const pageNumber = (chunks[i].metadata as { loc?: { pageNumber?: number } }).loc?.pageNumber ?? 1
      await opensearchClient.index({
        index: INDEX_NAME,
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
  const [queryVec] = await embeddings.embedDocuments([query])

  const result = await opensearchClient.search({
    index: INDEX_NAME,
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
