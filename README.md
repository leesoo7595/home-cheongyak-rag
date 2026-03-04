
# 📚 주택청약공고 문서 기반 Q&A 서비스 (RAG)

![무제](https://github.com/user-attachments/assets/53d1499a-7114-4e86-ba7d-be2d24713e1a)


주택청약공고 PDF를 업로드하면 페이지 단위로 텍스트를 추출하고, 이를 청킹·임베딩하여 OpenSearch 에 저장한 뒤 사용자가 질문하면 관련 청크를 벡터 검색하여 답변을 생성하는 **RAG 기반 Q&A 서비스**입니다.

Next.js(Route Handler), OpenSearch, bge-m3 임베딩 모델 기반으로 구현되었습니다.

## 🧪 Development Setup

### 테스트 환경 정보

- MAC M1 Max(10코어 CPU 및 32코어 GPU) 메모리 64GB
- node 24.11.1
- OpenSearch 2.18

### OpenSearch 스키마

```
PUT home-cheongyak-rag-v3
{
  "settings": {
    "index": {
      "knn": true,
      "number_of_shards": 1,
      "number_of_replicas": 1
    }
  },
  "mappings": {
      "properties": {
        "chunk_index": {
          "type": "integer"
        },
        "embedding": {
          "type": "knn_vector",
          "dimension": 1024,
          "method": {
            "engine": "nmslib",
            "space_type": "cosinesimil",
            "name": "hnsw",
            "parameters": {
              "ef_construction": 200,
              "m": 32
            }
          }
        },
        "pdf_id": {
          "type": "keyword"
        },
        "text": {
          "type": "text"
        },
        "page_number": {
          "type": "integer"
        }
      }
    }
}
```

### App (Next.js)

```bash
export OPENSEARCH_HOST=<OPENSEARCH_HOST>
export OPENSEARCH_USER=<OPENSEARCH_USER>
export OPENSEARCH_PASSWD=<OPENSEARCH_PASSWD>
export OPENSEARCH_PORT=<OPENSEARCH_PORT>
export OPENSEARCH_INDEX=<OPENSEARCH_INDEX>
export EMBEDDING_API_URL=<EMBEDDING_API_URL>
export EMBEDDING_API_KEY=<EMBEDDING_API_KEY>
export CLOVA_API_TOKEN=<CLOVA_API_TOKEN starting with 'nv-...'>
npm install
npm run dev
```
