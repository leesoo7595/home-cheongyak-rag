from storage import create_conversation
from fastapi import APIRouter, UploadFile, File, HTTPException
import fitz
import uuid

from FlagEmbedding import BGEM3FlagModel
from opensearchpy import OpenSearch
from opensearch_dsl import Search

import os

router = APIRouter()

host = os.getenv("OPENSEARCH_HOST")
port = os.getenv("OPENSEARCH_PORT")
auth = (os.getenv("OPENSEARCH_USER"), os.getenv("OPENSEARCH_PASSWD"))

client = OpenSearch(
  hosts=[{'host': host, 'port': port}],
  http_compress = True,
  http_auth = auth,
  use_ssl = True,
  verify_certs = False,
  ssl_assert_hostname = False,
  ssl_show_warn = False,
  timeout = 300
)

INDEX_NAME = os.getenv("OPENSEARCH_INDEX")
bge_model = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)

def chunk_text(text: str, chunk_size: int = 2000):
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

def embed_in_batches(chunks, batch_size=24):
    all_vecs = []

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]

        encoded = bge_model.encode(
            batch,
            batch_size=8,
            max_length=8192,
        )
        print(len(encoded["dense_vecs"]))
        all_vecs.extend(encoded["dense_vecs"])

    return all_vecs

@router.post("/pdf")
async def upload_pdf(id: str, file: UploadFile = File(...)):
  if file.content_type != "application/pdf":
    raise HTTPException(status_code=400, detail="PDF 파일만 가능합니다.")
  
  # 1) PDF 텍스트 추출 (pymupdf)
  try:
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    full_text = ""
    for page in doc:
      full_text += page.get_text("text") + "/n"
  
  except Exception as e:
    raise HTTPException(status_code=400, detail=f"PDF 처리 실패: {str(e)}")
  
  if not full_text.strip():
    raise HTTPException(status_code=400, detail="PDF에서 텍스트를 추출할 수 없습니다.")

  # 2) 청킹
  chunks = chunk_text(full_text)
  print(f"청킹 갯수 : {len(chunks)}")

  # 3) bge-m3 임베딩 (dense only)
  dense_vecs = embed_in_batches(chunks, batch_size=8)

  # 4) OpenSearch에 저장
  pdf_id = str(id)

  for i, (chunk, vec) in enumerate(zip(chunks, dense_vecs)):
    client.index(
      index=INDEX_NAME,
      id=f"{pdf_id}-{i}",
      body={
        "pdf_id": pdf_id,
        "chunk_index": i,
        "text": chunk,
        "embedding": vec
      },
    )

  """PDF 파일 업로드하면서 대화 생성"""
  title = file.filename
  create_conversation(title)

  # TODO: FE에 chunks와 해당하는 ID 같이 내려줘서 프론트에서 작업이 가능하게해야할듯
  return {
    "pdf_id": pdf_id,
    "chunks": len(chunks),
    "message": "PDF 텍스트 청킹 및 bge-m3 임베딩 + 인덱싱 완료"
  }