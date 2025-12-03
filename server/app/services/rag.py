from typing import Any, Dict, List
import os

from FlagEmbedding import BGEM3FlagModel
from opensearchpy import OpenSearch


# ---------- OpenSearch & Embedding 초기화 ----------

host = os.getenv("OPENSEARCH_HOST")
port = os.getenv("OPENSEARCH_PORT")
auth = (os.getenv("OPENSEARCH_USER"), os.getenv("OPENSEARCH_PASSWD"))

client = OpenSearch(
    hosts=[{"host": host, "port": port}],
    http_compress=True,
    http_auth=auth,
    use_ssl=True,
    verify_certs=False,
    ssl_assert_hostname=False,
    ssl_show_warn=False,
    timeout=300,
)

INDEX_NAME = os.getenv("OPENSEARCH_INDEX")

# 한 번만 로드해서 재사용
bge_model = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)


# ---------- 텍스트 청킹 ----------

def chunk_text(pages_text: list[str], chunk_size: int = 500) -> tuple[list[str], list[int]]:
    chunks: list[str] = []
    page_numbers: list[int] = []

    for page_number, text in enumerate(pages_text, start=1):
        words = text.split()
        curr: list[str] = []
      
        for word in words:
            curr.append(word)
            if len(curr) >= chunk_size:
                chunks.append(" ".join(curr))
                page_numbers.append(page_number)
                curr = []

    if curr:
        chunks.append(" ".join(curr)) 
        page_numbers.append(page_number)

    return chunks, page_numbers


# ---------- 임베딩 ----------

def embed_in_batches(chunks: List[str], size: int = 24):
    """chunks 리스트를 받아서 순서대로 dense_vecs 리스트를 반환"""
    all_vecs = []

    for i in range(0, len(chunks), size):
        batch = chunks[i : i + size]

        encoded = bge_model.encode(
            batch,
            batch_size=8,
            max_length=8192,
        )
        # encoded["dense_vecs"] 길이 확인용 로그
        print("encoded batch size:", len(encoded["dense_vecs"]))
        all_vecs.extend(encoded["dense_vecs"])

    return all_vecs

# ---------- 인덱싱 ----------

def index_chunks_for_pdf(
    id: str,
    chunks: List[str],
    dense_vecs: List[list[float]],
    page_numbers: List[int],
) -> None:
    """
    주어진 pdf_id에 대해 (chunk, embedding) 쌍을 OpenSearch에 인덱싱.
    """
    for i, (chunk, vec) in enumerate(zip(chunks, dense_vecs)):
        client.index(
            index=INDEX_NAME,
            id=f"{id}-{i}",
            body={
                "pdf_id": id,
                "chunk_index": i,
                "text": chunk,
                "embedding": vec,
                "page_number": page_numbers[i],
            },
        )

# ---------- KNN 검색 ----------

def search_similar_chunks(
    conversation_id: str,
    query_vec: List[float],
    size: int = 10,
    k: int = 10,
) -> Dict[str, Any]:
    """
    특정 conversation(pdf_id) 내부에서,
    query 임베딩과 가장 유사한 청크들을 OpenSearch로 조회하는 함수.

    Args:
        conversation_id (str): pdf_id (= conversation_id)
        query_vec (List[float]): bge-m3 dense vector (768차원 or 다차원)
        size (int): 반환할 문서 개수
        k (int): knn 이웃 개수

    Returns:
        dict: opensearch search 결과 전체
    """
    body = {
        "size": size,
        "query": {
            "bool": {
                "filter": [
                    {"terms": {"pdf_id": [conversation_id]}}
                ],
                "must": [
                    {
                        "knn": {
                            "embedding": {
                                "vector": query_vec,
                                "k": k
                            }
                        }
                    }
                ]
            }
        }
    }

    result = client.search(
        index=INDEX_NAME,
        body=body,
    )

    return result
