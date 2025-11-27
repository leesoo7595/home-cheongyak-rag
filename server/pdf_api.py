from starlette.responses import FileResponse
from storage import create_conversation
from fastapi import APIRouter, UploadFile, File, HTTPException
import fitz
import uuid

from FlagEmbedding import BGEM3FlagModel
from opensearchpy import OpenSearch
from opensearch_dsl import Search

import os

from models import PdfResponse

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

def chunk_text(text: str, chunk_size: int = 1000):
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
async def upload_pdf(file: UploadFile = File(...)):
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

  """PDF 파일 업로드하면서 대화 생성"""
  title = file.filename
  conversation = create_conversation(title)

  # 파일 저장
  UPLOAD_DIR = "pdfs"
  if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
  
  file_path = os.path.join(UPLOAD_DIR, f"{conversation['id']}.pdf")
  
  # file pointer reset
  await file.seek(0)
  
  with open(file_path, "wb") as f:
    content = await file.read()
    f.write(content)

  # 4) OpenSearch에 저장
  pdf_id = str(conversation["id"])

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

  # TODO: FE에 chunks와 해당하는 ID 같이 내려줘서 프론트에서 작업이 가능하게해야할듯
  return PdfResponse(
    pdf_id=pdf_id,
    chunks=len(chunks),
    message="PDF 텍스트 청킹 및 bge-m3 임베딩 + 인덱싱 완료"
  )


UPLOAD_DIR = "pdfs"

@router.get("/pdf/{pdf_id}")
async def get_pdf(pdf_id: str):
    print("[get_pdf] called with:", pdf_id)

    # pdf_id에 확장자 없으면 .pdf 붙이기
    if not pdf_id.endswith(".pdf"):
        pdf_id = f"{pdf_id}.pdf"

    file_path = os.path.join(UPLOAD_DIR, pdf_id)
    print("[get_pdf] file_path:", file_path, "exists?", os.path.exists(file_path))

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF 파일을 찾을 수 없습니다.")

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=pdf_id,
    )