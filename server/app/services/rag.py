from typing import List
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

def chunk_text(text: str, chunk_size: int = 1000) -> list[str]:
    words = text.split()
    chunks: list[str] = []
    curr: list[str] = []

    for w in words:
        curr.append(w)
        if len(curr) >= chunk_size:
            chunks.append(" ".join(curr))
            curr = []

    if curr:
        chunks.append(" ".join(curr))

    return chunks


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
    conversation_id: str,
    chunks: List[str],
    dense_vecs: List[list[float]],
) -> None:
    """
    주어진 pdf_id에 대해 (chunk, embedding) 쌍을 OpenSearch에 인덱싱.
    """
    for i, (chunk, vec) in enumerate(zip(chunks, dense_vecs)):
        client.index(
            index=INDEX_NAME,
            id=f"{conversation_id}-{i}",
            body={
                "pdf_id": conversation_id,
                "chunk_index": i,
                "text": chunk,
                "embedding": vec,
            },
        )
